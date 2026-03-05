import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { buildEphemeralCommandSequence } from './services/ephemeralRunner';
import { parseProgramArguments } from './services/programArgs';
import { isMainPackageScript } from './services/scriptEligibility';

const EXTENSION_NAME = 'RighToGo';
const TERMINAL_NAME = 'RighToGo Terminal';
const OUTPUT_NAME = 'RighToGo';
const CONFIG_NAMESPACE = 'rightogo';
const PROJECT_COMMAND_ID = 'rightogo.runScript';
const RUN_WITH_ARGS_COMMAND_ID = 'rightogo.runScriptWithArgs';
const RUN_IN_NEW_WINDOW_COMMAND_ID = 'rightogo.runScriptInNewWindow';
const ASK_LLM_COMMAND_ID = 'rightogo.askLlmAboutScript';
const RUN_CONTEXT_KEY = 'rightogo.canRunActiveGoFile';
const MOVE_TERMINAL_NEW_WINDOW_COMMAND = 'workbench.action.terminal.moveIntoNewWindow';
const TERMINAL_NEW_WINDOW_SETTING = 'runInNewWindowTerminalByDefault';
const PROMPT_ARGS_SETTING = 'promptForArgumentsOnRun';

type RunMode = 'project' | 'ephemeral';
type TerminalMode = 'panel' | 'newWindow';

interface RunPayload {
  mode: RunMode;
  sourceFilePath: string;
  goBinaryPath: string;
  cleanupTemp: boolean;
  programArgs: string[];
}

interface ScriptArtifacts {
  shellScriptPath: string;
  statusFilePath: string;
  logFilePath: string;
  metadataDirPath: string;
}

interface ExecutionSnapshot {
  timestampIso: string;
  mode: RunMode;
  sourceFilePath: string;
  exitCode: number;
  errorOutput?: string;
}

interface LlmPromptPayload {
  scriptText: string;
  lastRunError?: string;
  sourceFilePath: string;
  capturedAtIso: string;
}

interface RunCommandOptions {
  targetUri?: vscode.Uri;
  promptForArgs?: boolean;
  terminalMode?: TerminalMode;
}

class ExecutionState {
  private lastSnapshot: ExecutionSnapshot | undefined;

  set(snapshot: ExecutionSnapshot): void {
    this.lastSnapshot = snapshot;
  }

  clear(): void {
    this.lastSnapshot = undefined;
  }

  getLastRunError(): string | undefined {
    return this.lastSnapshot?.errorOutput;
  }

  getSnapshot(): ExecutionSnapshot | undefined {
    return this.lastSnapshot;
  }
}

class LlmBridgeStub {
  async askAboutScript(payload: LlmPromptPayload): Promise<string> {
    const summary = payload.lastRunError
      ? `Last run error captured (${payload.lastRunError.length} chars).`
      : 'No run error captured yet.';
    return [
      'LLM/MCP integration placeholder.',
      'Plug your provider call here (OpenAI/Gemini/MCP).',
      `File: ${payload.sourceFilePath}`,
      summary
    ].join('\n');
  }
}

let quickRunTerminal: vscode.Terminal | undefined;
const executionState = new ExecutionState();
const llmBridge = new LlmBridgeStub();
let lastProgramArgsInput = '';
let warnedMoveToNewWindowUnavailable = false;

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel(OUTPUT_NAME);
  context.subscriptions.push(output);

  const refreshContext = (): void => {
    void updateRunCommandContext();
  };

  refreshContext();

  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((closedTerminal) => {
      if (quickRunTerminal && closedTerminal === quickRunTerminal) {
        quickRunTerminal = undefined;
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(PROJECT_COMMAND_ID, async (uri?: vscode.Uri) => {
      await runScriptCommand(output, {
        targetUri: uri
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(RUN_WITH_ARGS_COMMAND_ID, async (uri?: vscode.Uri) => {
      await runScriptCommand(output, {
        targetUri: uri,
        promptForArgs: true
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(RUN_IN_NEW_WINDOW_COMMAND_ID, async (uri?: vscode.Uri) => {
      await runScriptCommand(output, {
        targetUri: uri,
        terminalMode: 'newWindow'
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(ASK_LLM_COMMAND_ID, async () => {
      await askLlmCommand(output);
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      refreshContext();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor && event.document.uri.toString() === activeEditor.document.uri.toString()) {
        refreshContext();
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(() => {
      refreshContext();
    })
  );
}

export function deactivate(): void {
  if (quickRunTerminal) {
    quickRunTerminal.dispose();
    quickRunTerminal = undefined;
  }
}

async function runScriptCommand(
  output: vscode.OutputChannel,
  options: RunCommandOptions = {}
): Promise<void> {
  const document = await resolveTargetDocument(options.targetUri);
  if (!document) {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: no active Go file found.`);
    return;
  }

  if (document.languageId !== 'go' || path.extname(document.fileName) !== '.go') {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: active file is not a Go source file.`);
    return;
  }

  if (document.isUntitled) {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: save the file before running.`);
    return;
  }

  if (document.isDirty) {
    const saved = await document.save();
    if (!saved) {
      vscode.window.showErrorMessage(`${EXTENSION_NAME}: could not save file before running.`);
      return;
    }
  }

  if (!isMainPackageScript(document.getText())) {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: first valid code line must be "package main".`);
    return;
  }

  const sourceFilePath = document.fileName;
  const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
  const configuredBinary = (config.get<string>('goBinaryPath') ?? '').trim();
  const cleanupTemp = config.get<boolean>('cleanupTemporaryDirectory', true);
  const promptForArgsByDefault = config.get<boolean>(PROMPT_ARGS_SETTING, false);
  const runInNewWindowByDefault = config.get<boolean>(TERMINAL_NEW_WINDOW_SETTING, false);

  const shouldPromptForArgs = options.promptForArgs ?? promptForArgsByDefault;
  const terminalMode: TerminalMode = options.terminalMode ?? (runInNewWindowByDefault ? 'newWindow' : 'panel');
  const programArgs = shouldPromptForArgs ? await promptForProgramArgs() : [];
  if (!programArgs) {
    return;
  }

  const goBinaryPath = await resolveGoBinaryPath(configuredBinary, output);
  if (!goBinaryPath) {
    vscode.window.showErrorMessage(
      `${EXTENSION_NAME}: Go binary unavailable. Check "${CONFIG_NAMESPACE}.goBinaryPath" or your PATH.`
    );
    return;
  }

  const hasGoMod = await fileExists(path.join(path.dirname(sourceFilePath), 'go.mod'));
  const payload: RunPayload = {
    mode: hasGoMod ? 'project' : 'ephemeral',
    sourceFilePath,
    goBinaryPath,
    cleanupTemp,
    programArgs
  };

  const terminal = getOrCreateTerminal();
  terminal.show(false);
  if (terminalMode === 'newWindow') {
    await tryMoveTerminalIntoNewWindow();
  }

  try {
    const artifacts =
      payload.mode === 'project'
        ? await prepareProjectRunScript(payload)
        : await prepareEphemeralRunScript(payload);

    monitorExecution(artifacts, payload, output);
    terminal.sendText(`bash ${toSingleQuotedShellArg(artifacts.shellScriptPath)}`, true);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: failed to prepare execution. ${reason}`);
  }
}

async function askLlmCommand(output: vscode.OutputChannel): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: no active editor found.`);
    return;
  }

  const payload: LlmPromptPayload = {
    scriptText: activeEditor.document.getText(),
    lastRunError: executionState.getLastRunError(),
    sourceFilePath: activeEditor.document.fileName,
    capturedAtIso: new Date().toISOString()
  };

  const response = await llmBridge.askAboutScript(payload);
  output.appendLine(`[${EXTENSION_NAME}] Ask LLM invoked at ${payload.capturedAtIso}`);
  output.appendLine('--- Payload Summary ---');
  output.appendLine(`Source: ${payload.sourceFilePath}`);
  output.appendLine(`Script length: ${payload.scriptText.length}`);
  output.appendLine(`Has last run error: ${payload.lastRunError ? 'yes' : 'no'}`);
  if (payload.lastRunError) {
    output.appendLine(`Last error preview: ${truncateForPreview(payload.lastRunError, 400)}`);
  }
  output.appendLine('--- Bridge Response ---');
  output.appendLine(response);
  output.appendLine('-----------------------');
  output.show(true);

  vscode.window.showInformationMessage(
    `${EXTENSION_NAME}: LLM placeholder executed. See output channel "${OUTPUT_NAME}".`
  );
}

async function resolveTargetDocument(targetUri?: vscode.Uri): Promise<vscode.TextDocument | undefined> {
  if (targetUri) {
    try {
      return await vscode.workspace.openTextDocument(targetUri);
    } catch {
      return undefined;
    }
  }

  return vscode.window.activeTextEditor?.document;
}

async function promptForProgramArgs(): Promise<string[] | undefined> {
  const userInput = await vscode.window.showInputBox({
    title: 'RighToGo: Program Arguments',
    prompt: 'Optional arguments passed to the Go script',
    placeHolder: '--port 8080 --name \"John Doe\"',
    value: lastProgramArgsInput,
    ignoreFocusOut: true
  });

  if (userInput === undefined) {
    return undefined;
  }

  const parsed = parseProgramArguments(userInput);
  if (parsed.error) {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: invalid arguments. ${parsed.error}`);
    return undefined;
  }

  lastProgramArgsInput = userInput;
  return parsed.args;
}

async function updateRunCommandContext(): Promise<void> {
  const isRunnable = isRunnableActiveEditor(vscode.window.activeTextEditor);
  await vscode.commands.executeCommand('setContext', RUN_CONTEXT_KEY, isRunnable);
}

function isRunnableActiveEditor(editor: vscode.TextEditor | undefined): boolean {
  if (!editor) {
    return false;
  }

  const document = editor.document;
  if (document.languageId !== 'go') {
    return false;
  }

  if (document.isUntitled) {
    return false;
  }

  if (path.extname(document.fileName) !== '.go') {
    return false;
  }

  return isMainPackageScript(document.getText());
}

async function tryMoveTerminalIntoNewWindow(): Promise<void> {
  try {
    await vscode.commands.executeCommand(MOVE_TERMINAL_NEW_WINDOW_COMMAND);
  } catch {
    if (!warnedMoveToNewWindowUnavailable) {
      warnedMoveToNewWindowUnavailable = true;
      vscode.window.showWarningMessage(
        `${EXTENSION_NAME}: move terminal to new window is not available in this VSCode build. Using panel terminal.`
      );
    }
  }
}

async function verifyGoBinary(goBinaryPath: string, output: vscode.OutputChannel): Promise<boolean> {
  if (/\$\{[^}]+\}/.test(goBinaryPath)) {
    output.appendLine(`[${EXTENSION_NAME}] unresolved variable in Go binary path: ${goBinaryPath}`);
    return false;
  }

  if (path.isAbsolute(goBinaryPath) && !fsSync.existsSync(goBinaryPath)) {
    output.appendLine(`[${EXTENSION_NAME}] Go binary path does not exist: ${goBinaryPath}`);
    return false;
  }

  try {
    const result = await runProcess(goBinaryPath, ['version'], process.cwd(), 10_000);
    if (result.exitCode !== 0) {
      output.appendLine(
        `[${EXTENSION_NAME}] Failed running "${goBinaryPath} version": ${result.stderr || result.stdout}`
      );
      return false;
    }
    return true;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    output.appendLine(`[${EXTENSION_NAME}] Error validating Go binary: ${reason}`);
    return false;
  }
}

async function resolveGoBinaryPath(
  configuredBinaryPath: string,
  output: vscode.OutputChannel
): Promise<string | undefined> {
  const candidates = buildGoBinaryCandidates(configuredBinaryPath);
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (await verifyGoBinary(candidate, output)) {
      if (configuredBinaryPath.trim().length > 0 && candidate !== configuredBinaryPath.trim()) {
        output.appendLine(`[${EXTENSION_NAME}] using resolved Go binary path: ${candidate}`);
      }
      return candidate;
    }
  }

  return undefined;
}

function buildGoBinaryCandidates(configuredBinaryPath: string): string[] {
  const normalizedConfigured = configuredBinaryPath.trim();
  const candidates: string[] = [];

  if (normalizedConfigured.length > 0) {
    candidates.push(resolvePathTemplate(normalizedConfigured));
  }

  const defaultLocalGo = path.join(os.homedir(), '.go', 'bin', process.platform === 'win32' ? 'go.exe' : 'go');
  candidates.push(defaultLocalGo);
  candidates.push(process.platform === 'win32' ? 'go.exe' : 'go');

  return [...new Set(candidates)];
}

function resolvePathTemplate(value: string): string {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
  let resolved = value;

  resolved = resolved.replace(/\$\{userHome\}/g, os.homedir());
  resolved = resolved.replace(/\$\{workspaceFolder\}/g, workspaceFolder);
  resolved = resolved.replace(/\$\{env:([^}]+)\}/g, (_, variableName: string) => {
    return process.env[variableName] ?? '';
  });

  if (resolved === '~') {
    return os.homedir();
  }
  if (resolved.startsWith('~/')) {
    return path.join(os.homedir(), resolved.slice(2));
  }

  return resolved;
}

function getOrCreateTerminal(): vscode.Terminal {
  if (!quickRunTerminal || quickRunTerminal.exitStatus) {
    quickRunTerminal = vscode.window.createTerminal({
      name: TERMINAL_NAME
    });
  }
  return quickRunTerminal;
}

async function prepareProjectRunScript(payload: RunPayload): Promise<ScriptArtifacts> {
  const metadataDirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'rightogo-run-'));
  const statusFilePath = path.join(metadataDirPath, 'status.code');
  const logFilePath = path.join(metadataDirPath, 'run.log');
  const shellScriptPath = path.join(metadataDirPath, 'execute.sh');

  const sourceDir = path.dirname(payload.sourceFilePath);
  const sourceBaseName = path.basename(payload.sourceFilePath);
  const programArgsSegment = payload.programArgs.map((arg) => toSingleQuotedShellArg(arg)).join(' ');
  const shellScript = `#!/usr/bin/env bash
set -u
GO_BIN=${toSingleQuotedShellArg(payload.goBinaryPath)}
WORK_DIR=${toSingleQuotedShellArg(sourceDir)}
TARGET_FILE=${toSingleQuotedShellArg(sourceBaseName)}
LOG_FILE=${toSingleQuotedShellArg(logFilePath)}
STATUS_FILE=${toSingleQuotedShellArg(statusFilePath)}

run_core() {
  cd "$WORK_DIR" || return 1
  "$GO_BIN" run "$TARGET_FILE"${programArgsSegment ? ` ${programArgsSegment}` : ''}
}

run_core 2>&1 | tee "$LOG_FILE"
exit_code=\${PIPESTATUS[0]}
echo "$exit_code" > "$STATUS_FILE"
exit "$exit_code"
`;

  await fs.writeFile(shellScriptPath, shellScript, { mode: 0o700 });
  return { shellScriptPath, statusFilePath, logFilePath, metadataDirPath };
}

async function prepareEphemeralRunScript(payload: RunPayload): Promise<ScriptArtifacts> {
  const metadataDirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'rightogo-run-'));
  const statusFilePath = path.join(metadataDirPath, 'status.code');
  const logFilePath = path.join(metadataDirPath, 'run.log');
  const shellScriptPath = path.join(metadataDirPath, 'execute.sh');

  const tempRunDir = await fs.mkdtemp(path.join(os.tmpdir(), 'rightogo-temp-'));
  const sourceBaseName = path.basename(payload.sourceFilePath);
  const copiedTargetFile = path.join(tempRunDir, sourceBaseName);
  await fs.copyFile(payload.sourceFilePath, copiedTargetFile);

  const commandSequence = buildEphemeralCommandSequence(
    payload.goBinaryPath,
    sourceBaseName,
    'rightogo_temp_run',
    payload.programArgs
  );
  const commandLines = commandSequence
    .map((step) => `"${step.command}" ${step.args.map((arg) => toSingleQuotedShellArg(arg)).join(' ')} || return $?`)
    .join('\n  ');

  const cleanupFlag = payload.cleanupTemp ? '1' : '0';
  const shellScript = `#!/usr/bin/env bash
set -u
TEMP_RUN_DIR=${toSingleQuotedShellArg(tempRunDir)}
CLEANUP_ENABLED=${toSingleQuotedShellArg(cleanupFlag)}
LOG_FILE=${toSingleQuotedShellArg(logFilePath)}
STATUS_FILE=${toSingleQuotedShellArg(statusFilePath)}

cleanup() {
  if [[ "$CLEANUP_ENABLED" == "1" ]]; then
    rm -rf "$TEMP_RUN_DIR"
  fi
}
trap cleanup EXIT

run_core() {
  cd "$TEMP_RUN_DIR" || return 1
  ${commandLines}
}

run_core 2>&1 | tee "$LOG_FILE"
exit_code=\${PIPESTATUS[0]}
echo "$exit_code" > "$STATUS_FILE"
exit "$exit_code"
`;

  await fs.writeFile(shellScriptPath, shellScript, { mode: 0o700 });
  return { shellScriptPath, statusFilePath, logFilePath, metadataDirPath };
}

function monitorExecution(artifacts: ScriptArtifacts, payload: RunPayload, output: vscode.OutputChannel): void {
  const startedAt = Date.now();
  const pollEveryMs = 1_000;
  const maxWaitMs = 45 * 60 * 1_000;

  const poll = async (): Promise<void> => {
    if (Date.now() - startedAt > maxWaitMs) {
      executionState.set({
        timestampIso: new Date().toISOString(),
        mode: payload.mode,
        sourceFilePath: payload.sourceFilePath,
        exitCode: 124,
        errorOutput: 'Execution monitor timed out waiting for terminal completion.'
      });
      output.appendLine(`[${EXTENSION_NAME}] monitor timeout for ${payload.sourceFilePath}`);
      await cleanupArtifacts(artifacts);
      return;
    }

    if (!(await fileExists(artifacts.statusFilePath))) {
      setTimeout(() => {
        void poll();
      }, pollEveryMs);
      return;
    }

    const exitCodeRaw = await fs.readFile(artifacts.statusFilePath, 'utf8');
    const exitCode = Number.parseInt(exitCodeRaw.trim(), 10);
    const logOutput = (await safeReadFile(artifacts.logFilePath)) ?? '';

    if (Number.isNaN(exitCode)) {
      executionState.set({
        timestampIso: new Date().toISOString(),
        mode: payload.mode,
        sourceFilePath: payload.sourceFilePath,
        exitCode: 1,
        errorOutput: 'Could not parse terminal execution exit code.'
      });
      output.appendLine(`[${EXTENSION_NAME}] malformed exit code file: ${artifacts.statusFilePath}`);
      await cleanupArtifacts(artifacts);
      return;
    }

    if (exitCode === 0) {
      executionState.clear();
      output.appendLine(
        `[${EXTENSION_NAME}] run succeeded (${payload.mode}) for ${payload.sourceFilePath}`
      );
    } else {
      const errorOutput = extractRelevantError(logOutput);
      executionState.set({
        timestampIso: new Date().toISOString(),
        mode: payload.mode,
        sourceFilePath: payload.sourceFilePath,
        exitCode,
        errorOutput
      });
      output.appendLine(
        `[${EXTENSION_NAME}] run failed (${payload.mode}) for ${payload.sourceFilePath} with exit code ${exitCode}`
      );
      output.appendLine(`[${EXTENSION_NAME}] captured error preview: ${truncateForPreview(errorOutput, 600)}`);
    }

    await cleanupArtifacts(artifacts);
  };

  void poll();
}

async function cleanupArtifacts(artifacts: ScriptArtifacts): Promise<void> {
  await Promise.allSettled([
    fs.rm(artifacts.shellScriptPath, { force: true }),
    fs.rm(artifacts.statusFilePath, { force: true }),
    fs.rm(artifacts.logFilePath, { force: true }),
    fs.rm(artifacts.metadataDirPath, { recursive: true, force: true })
  ]);
}

function extractRelevantError(fullLog: string): string {
  const trimmed = fullLog.trim();
  if (trimmed.length === 0) {
    return 'Execution failed, but no terminal output was captured.';
  }

  const lines = trimmed.split(/\r?\n/);
  const tail = lines.slice(Math.max(0, lines.length - 40)).join('\n');
  return tail;
}

async function safeReadFile(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return undefined;
  }
}

function truncateForPreview(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
}

function toSingleQuotedShellArg(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}


async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

interface ProcessResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function runProcess(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      child.kill('SIGTERM');
      reject(new Error(`Process timed out after ${timeoutMs}ms: ${command} ${args.join(' ')}`));
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (exitCode) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      resolve({
        exitCode: exitCode ?? 1,
        stdout,
        stderr
      });
    });
  });
}

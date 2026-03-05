export interface CommandInvocation {
  command: string;
  args: string[];
}

export type CommandExecutor = (command: string, args: string[]) => Promise<void>;

export function buildEphemeralCommandSequence(
  goBinaryPath: string,
  targetFileName: string,
  moduleName = 'rightogo_temp_run',
  programArgs: string[] = []
): CommandInvocation[] {
  return [
    {
      command: goBinaryPath,
      args: ['mod', 'init', moduleName]
    },
    {
      command: goBinaryPath,
      args: ['mod', 'tidy']
    },
    {
      command: goBinaryPath,
      args: ['run', targetFileName, ...programArgs]
    }
  ];
}

export async function executeEphemeralCommandSequence(
  sequence: CommandInvocation[],
  executor: CommandExecutor
): Promise<void> {
  for (const step of sequence) {
    await executor(step.command, step.args);
  }
}

export async function runEphemeralWithoutGoMod(
  goBinaryPath: string,
  targetFileName: string,
  executor: CommandExecutor,
  moduleName = 'rightogo_temp_run',
  programArgs: string[] = []
): Promise<void> {
  const sequence = buildEphemeralCommandSequence(goBinaryPath, targetFileName, moduleName, programArgs);
  await executeEphemeralCommandSequence(sequence, executor);
}

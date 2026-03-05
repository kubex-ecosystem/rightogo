import * as path from 'node:path';
import { runTests } from '@vscode/test-electron';

async function main(): Promise<void> {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error('RighToGo test run failed:', reason);
    process.exit(1);
  }
}

void main();

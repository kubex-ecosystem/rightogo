import { expect } from 'chai';
import {
  runEphemeralWithoutGoMod,
  type CommandInvocation
} from '../../services/ephemeralRunner';

suite('ephemeralRunner', () => {
  test('Scenario B: when no go.mod, executes mod init, mod tidy, run in order', async () => {
    const calls: CommandInvocation[] = [];

    await runEphemeralWithoutGoMod('/home/user/.go/bin/go', 'script.go', async (command, args) => {
      calls.push({ command, args });
    });

    expect(calls).to.deep.equal([
      { command: '/home/user/.go/bin/go', args: ['mod', 'init', 'rightogo_temp_run'] },
      { command: '/home/user/.go/bin/go', args: ['mod', 'tidy'] },
      { command: '/home/user/.go/bin/go', args: ['run', 'script.go'] }
    ]);
  });

  test('Scenario B: supports forwarding program arguments to go run', async () => {
    const calls: CommandInvocation[] = [];

    await runEphemeralWithoutGoMod(
      '/home/user/.go/bin/go',
      'script.go',
      async (command, args) => {
        calls.push({ command, args });
      },
      'rightogo_temp_run',
      ['--port', '8080', '--name', 'John Doe']
    );

    expect(calls[2]).to.deep.equal({
      command: '/home/user/.go/bin/go',
      args: ['run', 'script.go', '--port', '8080', '--name', 'John Doe']
    });
  });
});

import { expect } from 'chai';
import { parseProgramArguments } from '../../services/programArgs';

suite('programArgs', () => {
  test('parses plain args separated by spaces', () => {
    const parsed = parseProgramArguments('--port 8080 --mode dev');
    expect(parsed.error).to.equal(undefined);
    expect(parsed.args).to.deep.equal(['--port', '8080', '--mode', 'dev']);
  });

  test('parses quoted args', () => {
    const parsed = parseProgramArguments('--name "John Doe" --city \'New York\'');
    expect(parsed.error).to.equal(undefined);
    expect(parsed.args).to.deep.equal(['--name', 'John Doe', '--city', 'New York']);
  });

  test('returns error for unclosed quote', () => {
    const parsed = parseProgramArguments('--name "John Doe');
    expect(parsed.error).to.be.a('string');
    expect(parsed.args).to.deep.equal([]);
  });
});

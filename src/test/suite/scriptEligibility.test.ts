import { expect } from 'chai';
import { isMainPackageScript } from '../../services/scriptEligibility';

suite('scriptEligibility', () => {
  test('Scenario A: identifies package main script', () => {
    const file = `
      // quick test
      package main

      import "fmt"
      func main() { fmt.Println("ok") }
    `;

    expect(isMainPackageScript(file)).to.equal(true);
  });

  test('Scenario A: ignores library package files', () => {
    const file = `
      /* util package */
      package helpers

      func Sum(a, b int) int { return a + b }
    `;

    expect(isMainPackageScript(file)).to.equal(false);
  });
});

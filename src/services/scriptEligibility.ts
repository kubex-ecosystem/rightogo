export function isMainPackageScript(fileText: string): boolean {
  const firstCodeLine = extractFirstCodeLine(fileText);
  return /^package\s+main\b/.test(firstCodeLine);
}

export function extractFirstCodeLine(fileText: string): string {
  const lines = fileText.split(/\r?\n/);
  let inBlockComment = false;

  for (const rawLine of lines) {
    let line = rawLine;

    while (line.length > 0) {
      if (inBlockComment) {
        const blockEnd = line.indexOf('*/');
        if (blockEnd === -1) {
          line = '';
          break;
        }
        line = line.slice(blockEnd + 2);
        inBlockComment = false;
        continue;
      }

      const trimmedStart = line.trimStart();
      if (trimmedStart.length === 0) {
        line = '';
        break;
      }

      if (trimmedStart.startsWith('//')) {
        line = '';
        break;
      }

      if (trimmedStart.startsWith('/*')) {
        const commentStartAt = line.indexOf('/*');
        const afterStart = line.slice(commentStartAt + 2);
        const blockEnd = afterStart.indexOf('*/');
        if (blockEnd === -1) {
          inBlockComment = true;
          line = '';
          break;
        }
        line = afterStart.slice(blockEnd + 2);
        continue;
      }

      return trimmedStart;
    }
  }

  return '';
}

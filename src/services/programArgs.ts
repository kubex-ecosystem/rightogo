export interface ParsedArgsResult {
  args: string[];
  error?: string;
}

export function parseProgramArguments(rawInput: string): ParsedArgsResult {
  if (rawInput.trim().length === 0) {
    return { args: [] };
  }

  const args: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escaping = false;

  for (const char of rawInput) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === '\\' && !inSingle) {
      escaping = true;
      continue;
    }

    if (char === '\'' && !inDouble) {
      inSingle = !inSingle;
      continue;
    }

    if (char === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }

    if (/\s/.test(char) && !inSingle && !inDouble) {
      if (current.length > 0) {
        args.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (escaping) {
    current += '\\';
  }

  if (inSingle || inDouble) {
    return { args: [], error: 'unclosed quoted string detected.' };
  }

  if (current.length > 0) {
    args.push(current);
  }

  return { args };
}

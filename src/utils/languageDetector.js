const extensionMap = {
  py: { language: 'python', displayName: 'Python' },
  js: { language: 'javascript', displayName: 'JavaScript' },
  jsx: { language: 'javascript', displayName: 'JavaScript' },
  ts: { language: 'typescript', displayName: 'TypeScript' },
  tsx: { language: 'typescript', displayName: 'TypeScript' },
  java: { language: 'java', displayName: 'Java' },
  cpp: { language: 'cpp', displayName: 'C++' },
  cc: { language: 'cpp', displayName: 'C++' },
  cxx: { language: 'cpp', displayName: 'C++' },
  h: { language: 'cpp', displayName: 'C++' },
  hpp: { language: 'cpp', displayName: 'C++' },
  c: { language: 'c', displayName: 'C' },
  go: { language: 'go', displayName: 'Go' },
  rs: { language: 'rust', displayName: 'Rust' },
  rb: { language: 'ruby', displayName: 'Ruby' },
  php: { language: 'php', displayName: 'PHP' },
  swift: { language: 'swift', displayName: 'Swift' },
  kt: { language: 'kotlin', displayName: 'Kotlin' },
  kts: { language: 'kotlin', displayName: 'Kotlin' },
  cs: { language: 'csharp', displayName: 'C#' }
};

export function detectLanguage(filename) {
  if (!filename || typeof filename !== 'string') {
    return { language: 'text', displayName: 'Unknown' };
  }

  // Extract extension from filename
  const lastDotIndex = filename.lastIndexOf('.');

  // No extension found
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return { language: 'text', displayName: 'Unknown' };
  }

  // Get extension without the dot and convert to lowercase
  const extension = filename.slice(lastDotIndex + 1).toLowerCase();

  // Look up the extension in the map
  const result = extensionMap[extension];

  return result || { language: 'text', displayName: 'Unknown' };
}

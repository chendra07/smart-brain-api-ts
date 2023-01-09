export function extensionExtractor(fileName: string) {
  return fileName.match(/\.[0-9a-z]+$/i);
}

export function matchExtension(targetFile: string, matches: string[]): boolean {
  //match target with specified extension

  if (!targetFile.match(`\\b${matches.join("|")}\\b`)) {
    return false;
  }

  return true;
}

export function extensionExtractor(fileName: string) {
  return fileName.match(/\.[0-9a-z]+$/i);
}

export function matchExtension(targetFile: string, matches: string[]): boolean {
  //match target with specified extension

  const result = targetFile.match(`\\b${matches.join("|")}\\b`);

  if (result?.length === null) {
    return false;
  }

  return true;
}

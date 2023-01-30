export function getExtensionName(fileName: string) {
  return fileName.match(/\.[0-9a-z]+$/i);
}

export function isMatchExtension(targetFile: string, matches: string[]) {
  //match target with specified extension

  if (!targetFile.match(`\\b${matches.join("|")}\\b`)) {
    return false;
  }

  return true;
}

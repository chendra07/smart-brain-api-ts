export function isParsedPositive(target: string) {
  const parsed = parseInt(target);
  if (Number.isNaN(parsed) || parsed < 0) {
    return false;
  }

  return true;
}

export function isStringOfNumber(target: string) {
  //only accept string like this: "1,2,3,4"
  if (!target.match(/^[0-9,]+$/)) {
    return false;
  }

  return true;
}

export function passwordValidator(password: string): boolean {
  let valid = true;

  const regexCfgList = [
    "(?=.*[0-9])", //1 number
    "(?=.*[!@#$%^&*_])", //1 special characters
    "(?=.*[a-z])", //1 lowercase
    "(?=.*[A-Z])", //1 uppercase
  ];

  const combinedRegex = regexCfgList.join("");

  if (!password.match(combinedRegex)) {
    valid = false;
  }

  return valid;
}

import { fromBuffer } from "file-type";
import { isMatchExtension } from "./extension";

export async function base64ImgCheck(image64: string) {
  const buffered = Buffer.from(image64, "base64"); //turn base64 to buffer
  const result = await fromBuffer(buffered); //check file type
  const maxByte = 4000000; //4,000,000 bytes === 4 MB

  if (
    result &&
    isMatchExtension(result.ext, ["png", "jpg", "jpeg"]) &&
    buffered.byteLength <= maxByte
  ) {
    return true;
  }

  return false;
}

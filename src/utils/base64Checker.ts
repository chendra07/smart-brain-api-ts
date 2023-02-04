import { fromBuffer } from "file-type";
import { isMatchExtension } from "./extension";

export async function isBase64ImageValid(
  image64: string,
  byteMaxSize: number,
  acceptedMIME: string[]
) {
  const bufferedImage = Buffer.from(image64, "base64"); //turn base64 to buffer
  const fileType = await fromBuffer(bufferedImage); //check file type

  if (
    fileType &&
    isMatchExtension(fileType.mime, acceptedMIME) &&
    bufferedImage.byteLength <= byteMaxSize
  ) {
    return true;
  }

  return false;
}

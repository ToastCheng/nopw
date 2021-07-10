const bufferDecode = (value: string) => {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

// ArrayBuffer to URLBase64
const bufferEncode = (value: ArrayBuffer) => {
  return btoa(
    new Uint8Array(value)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
};

export { bufferDecode, bufferEncode };
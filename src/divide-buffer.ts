export function divideBuffer(chunk: Buffer, length: number) {
  return [chunk.subarray(0, length), chunk.subarray(length, chunk.length)];
}

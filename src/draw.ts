export function* bits(data: Iterable<number>) {
  for (const b of data) {
    for (let i = 7; i >= 0; i--) {
      yield !!(b & (1 << i));
    }
  }
}

export function packBits(booleans: Iterable<boolean>): Uint8Array {
  const bytes: number[] = [];
  let currentByte = 0;
  let bitCount = 0;

  for (const bit of booleans) {
    currentByte = (currentByte << 1) | (bit ? 1 : 0);
    bitCount++;

    if (bitCount === 8) {
      bytes.push(currentByte);
      currentByte = 0;
      bitCount = 0;
    }
  }

  // If there are remaining bits, add the final byte
  if (bitCount > 0) {
    currentByte <<= 8 - bitCount;
    bytes.push(currentByte);
  }

  return new Uint8Array(bytes);
}

export function draw(data: Uint8Array, width: number) {
  let i = 0;
  for (const bit of bits(data)) {
    process.stdout.write(bit ? "#" : ".");
    i++;
    if (i % width === 0) {
      process.stdout.write("\n");
    }
  }
  process.stdout.write("\n");
}

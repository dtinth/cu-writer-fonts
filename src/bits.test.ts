import { expect, test } from "bun:test";
import { bits, packBits } from "./draw";

test("bits function", () => {
  const testData = new Uint8Array([0b10101010, 0b11110000, 0b00001111]);
  const expectedBits = [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
  ];

  const result = Array.from(bits(testData));
  expect(result).toEqual(expectedBits);
});

test("packBits function", () => {
  const testBits = [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
  ];
  const expectedData = new Uint8Array([0b10101010, 0b11110000, 0b00001111]);

  const result = packBits(testBits);
  expect(result).toEqual(expectedData);
});

test("bits and packBits are inverse operations", () => {
  const originalData = new Uint8Array([0xa5, 0x3c, 0xf0, 0x0f]);

  const unpackedBits = Array.from(bits(originalData));
  const repackedData = packBits(unpackedBits);

  expect(repackedData).toEqual(originalData);
});

test("packBits handles non-byte-aligned input", () => {
  const testBits = [true, false, true, true, false];
  const expectedData = new Uint8Array([0b10110000]);

  const result = packBits(testBits);
  expect(result).toEqual(expectedData);
});

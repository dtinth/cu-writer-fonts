import { readFileSync, writeFileSync } from "fs";
import { bits, draw, packBits } from "./draw";
import type { Glyph } from "./types";

async function process(fileName: string, glyphSize: number, width: number) {
  const data = readFileSync(`input/${fileName}`);
  console.log(fileName, data.length);
  const glyphs: Record<string, Glyph> = {};
  let offset = 0;
  for (let i = 0; ; i++) {
    if (offset >= data.length) break;
    const height = (glyphSize * 8) / width;
    let bitmap = data.subarray(offset, offset + glyphSize);
    let shift = 0;
    if (fileName.endsWith(".PRN")) {
      bitmap = Buffer.from(preprocessPrn(bitmap));
    }
    if (fileName.endsWith(".P24") && glyphSize === 54) {
      bitmap = Buffer.from(preprocessP24(bitmap));
      shift = 32;
    }
    if (fileName.endsWith(".P24") && glyphSize === 36) {
      bitmap = Buffer.from(preprocessP24S(bitmap));
      shift = 32;
    }
    if (Bun.env.DEBUG_DRAW) draw(bitmap, width);
    offset += glyphSize;
    glyphs[`#${i + shift}`] = {
      width,
      height,
      data: bitmap.toString("base64"),
    };
  }
  writeFileSync(`output/${fileName}.json`, JSON.stringify(glyphs, null, 2));
}

/*
.each_slice(8).to_a.transpose.map(&:join).join.chars.each_slice(22).to_a.map(&:join)
*/
const chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const transpose = <T>(arr: T[][]): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr[0].length; i++) {
    result.push(arr.map((row) => row[i]));
  }
  return result;
};

const preprocessPrn = (buff: Uint8Array) => {
  const bitmap = Array.from(bits(buff));
  return packBits(chunk(transpose(chunk(bitmap, 8)).flat(), 22).flat());
};
const preprocessP24 = (buff: Uint8Array) => {
  const bitmap = Array.from(bits(buff));
  return packBits(chunk(transpose(chunk(bitmap, 24)).flat(), 18).flat());
};
const preprocessP24S = (buff: Uint8Array) => {
  const bitmap = Array.from(bits(buff));
  return packBits(chunk(transpose(chunk(bitmap, 16)).flat(), 18).flat());
};

for (const prnFilename of [
  "NORMAL.PRN",
  "NORMAL2.PRN",
  "NORMAL3.PRN",
  "NORMAL4.PRN",
  "NORMALS.PRN",
  "NORMALS2.PRN",
  "NORMALS3.PRN",
  "NORMALS4.PRN",
  "ITALIC.PRN",
  "ITALIC2.PRN",
  "ITALIC3.PRN",
  "ITALIC4.PRN",
  "ITALICS.PRN",
]) {
  await process(prnFilename, 44, 22);
}

for (const fon of [
  "NORMAL.FON",
  "NORMAL2.FON",
  "NORMAL3.FON",
  "NORMAL4.FON",
  "ITALIC.FON",
  "ITALIC2.FON",
  "ITALIC3.FON",
  "ITALIC4.FON",
]) {
  await process(fon, 20, 8);
}

for (const f of [
  "NORMAL.P24",
  "NORMAL2.P24",
  "NORMAL3.P24",
  "NORMAL4.P24",
  "ITALIC.P24",
  "ITALIC2.P24",
  "ITALIC3.P24",
  "ITALIC4.P24",
]) {
  await process(f, 54, 18);
}

for (const f of [
  "NORMALS.P24",
  "NORMALS2.P24",
  "NORMALS3.P24",
  "NORMALS4.P24",
  "ITALICS.P24",
  "ITALICS2.P24",
  "ITALICS3.P24",
  "ITALICS4.P24",
]) {
  await process(f, 36, 18);
}

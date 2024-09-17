import { readFileSync, writeFileSync } from "fs";
import { draw } from "./draw";
import type { Glyph } from "./types";

async function process(fileName: string) {
  const data = readFileSync(`input/${fileName}`);

  let offset = 0;
  const readU8 = () => data.readUInt8(offset++);
  const peekU8 = () => data.readUInt8(offset);
  const readAsciiNumber = () => {
    let out: number[] = [];
    for (;;) {
      const char = peekU8();
      if (char < 0x30 || char > 0x39) {
        break;
      }
      out.push(readU8());
    }
    return +String.fromCharCode(...out);
  };
  const readChar = () => String.fromCharCode(readU8());

  const glyphs: Record<string, Glyph> = {};
  let set = "";
  for (let i = 0; i < 3200; i++) {
    const begin = offset;
    if (begin >= data.length) break;
    if (readU8() !== 0x1b) throw new Error("Invalid header");
    if (readU8() !== 0x2a) throw new Error("Invalid header");
    if (readU8() !== 0x63) throw new Error("Invalid header");
    const code = readAsciiNumber();
    const sth1 = readChar();
    if (sth1 === "F") continue;
    if (sth1 === "D") {
      set = `${code}`;
    }
    if (readU8() !== 0x1b) throw new Error("Invalid header");
    readU8();
    readU8();
    const size = readAsciiNumber();
    const sth2 = readChar();
    console.log([
      offset.toString(16),
      offset,
      data.length,
      code,
      sth1,
      size,
      sth2,
    ]);
    const payload = data.subarray(offset, offset + size);
    offset += size;
    if (sth1 === "E" && sth2 === "W") {
      const height = payload[13];
      const width = Math.round(((size - 16) * 8) / height);
      console.log(payload.subarray(0, 16));
      const key = `${set}#${code}`;
      console.log(`${fileName} ${key} ${width}x${height}`);
      if (Bun.env.DEBUG_DRAW) draw(payload.subarray(16), width);
      if (glyphs[key]) throw new Error(`Duplicate glyph ${key}`);
      glyphs[key] = {
        header: payload.subarray(0, 16).toString("base64"),
        width,
        height,
        data: payload.subarray(16).toString("base64"),
      };
    }
  }
  writeFileSync(`output/${fileName}.json`, JSON.stringify(glyphs, null, 2));
}

await process("CU_HP_12.FNT");
await process("CU_HP_10.FNT");

export interface GlyphsJson {
  [fileName: string]: Record<string, GlyphInfo>;
}

export interface GlyphInfo {
  /** The `x` coordinate of the top-left corner of the glyph bitmap in `glyphs.png`. If the bitmap is all white, this value is `undefined`. */
  x?: number;

  /** The `y` coordinate of the top-left corner of the glyph bitmap in `glyphs.png`. If the bitmap is all white, this value is `undefined`. */
  y?: number;

  /** The width of the glyph bitmap. */
  width: number;

  /** The height of the glyph bitmap. */
  height: number;

  /** The base64-encoded header that comes from the original font file. */
  header?: string;
}

export = GlyphsJson;

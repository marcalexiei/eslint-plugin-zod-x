/**
 * Zod schema factories whose parsed output is already immutable, so wrapping
 * them in `readonly` has no effect on the inferred type (and no runtime
 * effect: freezing a primitive is a no-op).
 *
 * Covers primitives/scalars, number sub-types, and the top-level string
 * formats (they all parse to `string`). Container factories (`object`,
 * `array`, `record`, `map`, `set`, `tuple`, …) are intentionally absent —
 * `readonly` is meaningful there.
 */
export const ZOD_IMMUTABLE_SCHEMA_TYPES = [
  // primitives / scalars
  'bigint',
  'boolean',
  'date',
  'enum',
  'literal',
  'nan',
  'nativeEnum',
  'null',
  'number',
  'string',
  'stringbool',
  'symbol',
  'templateLiteral',
  'undefined',
  'void',

  // number sub-types
  'float32',
  'float64',
  'int',
  'int32',
  'int64',
  'uint32',
  'uint64',

  // top-level string formats (all parse to `string`);
  // `iso` covers member factories such as `z.iso.date()`
  'base64',
  'base64url',
  'cidrv4',
  'cidrv6',
  'cuid',
  'cuid2',
  'e164',
  'email',
  'emoji',
  'guid',
  'hash',
  'hex',
  'hostname',
  'httpUrl',
  'ipv4',
  'ipv6',
  'iso',
  'jwt',
  'ksuid',
  'nanoid',
  'ulid',
  'url',
  'uuid',
  'uuidv4',
  'uuidv6',
  'uuidv7',
  'xid',
];

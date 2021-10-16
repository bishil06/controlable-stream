import { Readable } from 'stream'
import { ControlableStream } from 'controlable-stream'

Readable.from('abcdefghijk').pipe(new ControlableStream(1, 1)).pipe(process.stdout)
// a.. b.. c.. d.. ..... k
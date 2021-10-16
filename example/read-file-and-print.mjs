import { ControlableStream } from "controlable-stream";
import { createReadStream } from "fs";

const cstream = new ControlableStream(2, 1)
cstream.setOnAddHistory((speed) => console.log(` ${speed}byte/sec`))

createReadStream('./example/test.txt').pipe(cstream).pipe(process.stdout)

// 2byte/sec
// ab 2byte/sec
// cd 2byte/sec
// ef 2byte/sec
// gh 2byte/sec
// ij 2byte/sec
// kl 2byte/sec
// mn 2byte/sec
// op
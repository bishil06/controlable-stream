import { Readable } from 'stream';
import { ControlableStream } from '../src/controlable-stream';

jest.setTimeout(8000);
describe('controlable stream', () => {
  test('definded', () => {
    expect(ControlableStream).toBeDefined();
  });

  test('create instance', () => {
    expect(new ControlableStream()).toBeInstanceOf(ControlableStream);
  });

  test('accuracy', async () => {
    const buf = Buffer.from('abcdefghij');

    const cstream = new ControlableStream();
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
  });

  test('limited accuracy byte 10 send 1', async () => {
    const buf = Buffer.from('abcdefghij');

    const cstream = new ControlableStream(10, 1);
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
  });

  test('limited accuracy byte 10 send 3', async () => {
    const buf = Buffer.from('abcdefghij');

    const cstream = new ControlableStream(10, 3);
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
  });

  test('limited accuracy byte 2 send 1', async () => {
    const buf = Buffer.from('abcdefghij');

    const cstream = new ControlableStream(2, 1);
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
  });

  test('limited accuracy byte 5 send 2', async () => {
    const buf = Buffer.from('abcdefghij');

    const cstream = new ControlableStream(5, 2);
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
  });

  test('limited accuracy byte 2 send 2', async () => {
    const buf = Buffer.from('abcdefghij');

    const cstream = new ControlableStream(2, 2);
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
  });

  test('limited accuracy byte 2 send 2 and log speed', async () => {
    const buf = Buffer.from('abcdefghij');

    let speedLog: number[] = [];
    const bytePerSec = 2;
    const cstream = new ControlableStream(bytePerSec, 2);
    cstream.setOnAddHistory((speed) => {
      speedLog.push(speed);
    });
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
    speedLog.forEach((log) => {
      expect(log <= bytePerSec).toBeTruthy();
    });
  });

  test('limited accuracy byte 5 send 5 and log speed', async () => {
    const buf = Buffer.from('abcdefghij');

    let speedLog: number[] = [];
    const bytePerSec = 5;
    const cstream = new ControlableStream(bytePerSec, 5);
    cstream.setOnAddHistory((speed) => {
      speedLog.push(speed);
    });
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
    speedLog.forEach((log) => {
      expect(log <= bytePerSec).toBeTruthy();
    });
  });

  test('limited accuracy byte 2 send 2 and log speed', async () => {
    const buf = Buffer.from('abcdefghij');

    let speedLog: number[] = [];
    const bytePerSec = 2;
    const cstream = new ControlableStream(bytePerSec, 2, 0);
    cstream.setOnAddHistory((speed) => {
      speedLog.push(speed);
    });
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
    speedLog.forEach((log) => {
      expect(log <= bytePerSec).toBeTruthy();
    });
  });

  test('limited accuracy byte 5 send 5 and log speed', async () => {
    const buf = Buffer.from('abcdefghij');

    let speedLog: number[] = [];
    const bytePerSec = 5;
    const cstream = new ControlableStream(bytePerSec, 5, 0);
    cstream.setOnAddHistory((speed) => {
      speedLog.push(speed);
    });
    const rstream = Readable.from(buf);

    const result = [];

    rstream.pipe(cstream);

    for await (const chunk of cstream) {
      result.push(chunk);
    }

    expect(buf.equals(Buffer.concat(result))).toBeTruthy();
    speedLog.forEach((log) => {
      expect(log <= bytePerSec).toBeTruthy();
    });
  });
});

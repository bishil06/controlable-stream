import { once } from 'events';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { delay } from './delay';
import { divideBuffer } from './divide-buffer';
import { ReservationManager } from './reservation-manater';
import { SpeedMeter, OnSpeedChange, onAddHistory } from './speed-meter';

export class ControlableStream extends Transform {
  private reservationManager = new ReservationManager();
  private onSpeedChange: OnSpeedChange | null = null;
  private speedMeter = new SpeedMeter();

  constructor(
    private bytePerSec: number = Infinity,
    private numOfSendPerSec: number = 10,
    private limitStrict: 0 | 1 | 2 = 0,
    private options?: TransformOptions
  ) {
    super(options);
    this.changeNumOfSendPerSecAvailable();
  }

  private changeNumOfSendPerSecAvailable() {
    if (this.numOfSendPerSec >= 1000) {
      this.numOfSendPerSec = 999;
    }

    if (this.bytePerSec < this.numOfSendPerSec) {
      this.numOfSendPerSec = this.bytePerSec;
    }

    if (this.numOfSendPerSec <= 0) {
      this.numOfSendPerSec = 1;
    }
  }

  public setOnSpeedChange(fn: OnSpeedChange | null) {
    this.speedMeter.setOnSpeedChange(fn);
  }

  public setOnAddHistory(fn: onAddHistory | null) {
    this.speedMeter.setOnAddHistory(fn);
  }

  public setBytePerSec(bytePerSec: number) {
    this.bytePerSec = bytePerSec;
    this.changeNumOfSendPerSecAvailable();
  }

  public setNumOfSendPerSec(numOfSendPerSec: number) {
    this.numOfSendPerSec = numOfSendPerSec;
    this.changeNumOfSendPerSecAvailable();
  }

  public setLimitStrict(limitStrict: 0 | 1 | 2) {
    this.limitStrict = limitStrict;
  }

  _transform: Transform['_transform'] = async (chunk, enc, cb) => {
    if (chunk instanceof Buffer) {
      await this.process(chunk, cb);
    } else {
      throw new Error('chunk is not Buffer');
    }
  };

  _flush: Transform['_flush'] = async (cb) => {
    if (this.reservationManager.isReserved()) {
      await once(this.reservationManager, 'timeout');
    }
    cb();
  };

  private async process(chunk: Buffer, cb: TransformCallback): Promise<void> {
    if (this.reservationManager.isReserved()) {
      const temp = this.reservationManager.cancel();
      chunk = Buffer.concat([temp, chunk]);
    }

    for await (const byte of this.getSendByteFromChunk(chunk)) {
      this.sendByte(byte);
      if (this.bytePerSec !== Infinity) {
        if (this.limitStrict === 0) {
          await delay(this.calcTimeToSpend(byte.length));
        } else if (this.limitStrict === 1) {
          const gap = this.bytePerSec - this.speedMeter.getLastSpeed();

          let delayMS = this.calcTimeToSpend(byte.length);
          delayMS -= this.calcTimeToSpend(gap);
          if (delayMS !== 0) await delay(delayMS);
        } else if (this.limitStrict === 2) {
          const gap = this.bytePerSec - this.speedMeter.getLastSpeed();

          let delayMS = this.calcTimeToSpend(byte.length);
          delayMS -= this.calcTimeToSpend(gap);

          if (delayMS > 1) {
            await delay(delayMS);
          }
        }
      }
    }

    cb();
  }

  private *getSendByteFromChunk(chunk: Buffer): Generator<Buffer, void, void> {
    if (chunk.length < this.calcByteForSend()) {
      yield chunk;
      return;
    }

    while (chunk.length >= this.calcByteForSend()) {
      const [sendByte, rest] = divideBuffer(chunk, this.calcByteForSend());
      yield sendByte;
      chunk = rest;
    }

    if (chunk.length > 0) {
      this.reserveRestByte(chunk);
    }
  }

  private reserveRestByte(byte: Buffer): void {
    this.reservationManager.reserve(
      this.calcTimeToSpend(byte.length),
      byte,
      (byte: Buffer) => this.sendByte.bind(this)(byte)
    );
  }

  public calcByteForSend(): number {
    return Math.floor(this.bytePerSec / this.numOfSendPerSec);
  }

  public calcTimeToSpend(length: number): number {
    return Math.ceil((length * 1000) / this.bytePerSec);
  }

  private sendByte(byte: Buffer) {
    this.speedMeter.addHistory(byte.length, Date.now());
    this.push(byte);
  }

  public getSpeed() {
    return this.speedMeter.getLastSpeed();
  }

  public getTotalByte() {
    return this.speedMeter.getTotalByte();
  }
}

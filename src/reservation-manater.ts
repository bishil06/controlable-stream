import { EventEmitter } from 'stream';

interface Reserve {
  timeoutId: NodeJS.Timeout;
  byte: Buffer;
  fn: (byte: Buffer) => unknown;
}

export class ReservationManager extends EventEmitter {
  private reservation: Reserve | null = null;

  reserve(ms: number, byte: Buffer, fn: (byte: Buffer) => unknown) {
    if (this.reservation !== null) throw new Error('already reserve');

    this.reservation = {
      timeoutId: setTimeout(() => {
        fn(byte);
        this.emit('timeout');
      }, ms),
      byte,
      fn,
    };
  }

  cancel() {
    if (this.reservation === null) throw new Error('not reserve');
    clearTimeout(this.reservation.timeoutId);

    const result = this.reservation.byte;

    this.reservation = null;
    return result;
  }

  isReserved() {
    return this.reservation !== null;
  }
}

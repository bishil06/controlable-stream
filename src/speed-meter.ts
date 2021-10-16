type byteHistory = { length: number; time: number };

export type OnSpeedChange = (speed: number, historys: byteHistory[]) => unknown;
export type onAddHistory = (speed: number, historys: byteHistory[]) => unknown;

export class SpeedMeter {
  private totalByte = 0;
  private lastSpeed = 0;
  private historys: byteHistory[] = [];
  private onSpeedChange: OnSpeedChange | null = null;
  private onAddHistory: onAddHistory | null = null;

  setOnSpeedChange(fn: OnSpeedChange | null) {
    this.onSpeedChange = fn;
  }

  setOnAddHistory(fn: onAddHistory | null) {
    this.onAddHistory = fn;
  }

  addHistory(length: number, time: number) {
    this.totalByte += length;

    this.updateHistory(time);
    this.historys.push({ length, time });
    const newSpeed = this.historys.reduce((acc, v) => acc + v.length, 0);

    if (this.lastSpeed !== newSpeed) {
      this.lastSpeed = newSpeed;
      if (this.onSpeedChange) this.onSpeedChange(newSpeed, this.historys);
    }

    if (this.onAddHistory) this.onAddHistory(newSpeed, this.historys);
  }

  updateHistory(time: number) {
    const i = this.historys.findIndex((h) => time - h.time <= 1000);
    this.historys = i > -1 ? this.historys.slice(i) : [];
  }

  getLastSpeed() {
    return this.lastSpeed;
  }

  getTotalByte() {
    return this.totalByte;
  }
}

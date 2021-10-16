import { SpeedMeter } from '../src/speed-meter';

describe('speed meter', () => {
  test('definded', () => {
    expect(SpeedMeter).toBeDefined();
  });

  test('create instance', () => {
    expect(new SpeedMeter()).toBeInstanceOf(SpeedMeter);
  });

  test('add 2 history', () => {
    const sm = new SpeedMeter();
    sm.addHistory(1000, 1);
    sm.addHistory(1000, 2);

    expect(sm.getLastSpeed()).toBe(2000);
  });

  test('add 4 history', () => {
    const sm = new SpeedMeter();
    sm.addHistory(1000, 1);
    sm.addHistory(1000, 2);

    sm.addHistory(1000, 1000);
    sm.addHistory(1000, 1004);

    expect(sm.getLastSpeed()).toBe(2000);
  });
});

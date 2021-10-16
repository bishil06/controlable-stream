import { setTimeout } from 'timers/promises';
import { ReservationManager } from '../src/reservation-manater';

describe('reservation manager', () => {
  test('definded', () => {
    expect(ReservationManager).toBeDefined();
  });

  test('create instance', () => {
    expect(new ReservationManager()).toBeInstanceOf(ReservationManager);
  });

  test('reserve', async () => {
    const testFn = jest.fn(() => 1234);
    const byte = Buffer.from('abc');

    const reservationManager = new ReservationManager();

    reservationManager.reserve(1000, byte, testFn);

    await setTimeout(1500).then(() => {
      expect(testFn).toBeCalledTimes(1);
    });
  });

  test('reserve and cancel', async () => {
    const testFn = jest.fn(() => 1234);
    const byte = Buffer.from('abc');

    const reservationManager = new ReservationManager();

    reservationManager.reserve(1000, byte, testFn);
    const cancelByte = reservationManager.cancel();
    expect(cancelByte.equals(Buffer.from('abc'))).toBeTruthy();

    await setTimeout(1500).then(() => {
      expect(testFn).toBeCalledTimes(0);
    });
  });

  test('cancel 2', async () => {
    const testFn = jest.fn(() => 1234);

    const reservationManager = new ReservationManager();
    const byte = Buffer.from('abc');
    const byte2 = Buffer.from('abcde');

    reservationManager.reserve(1000, byte, testFn);
    const cancelByte = reservationManager.cancel();
    expect(cancelByte.equals(Buffer.from('abc'))).toBeTruthy();

    reservationManager.reserve(1000, byte2, testFn);
    const cancelByte2 = reservationManager.cancel();
    expect(cancelByte2.equals(Buffer.from('abcde'))).toBeTruthy();

    await setTimeout(2000).then(() => {
      expect(testFn).toBeCalledTimes(0);
    });
  });
});

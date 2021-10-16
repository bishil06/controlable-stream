import { divideBuffer } from '../src/divide-buffer';

describe('divide buffer', () => {
  test('function', () => {
    expect(divideBuffer).toBeDefined();
  });

  test('divide 2', () => {
    const buf = Buffer.from('abcde');
    const [a, b] = divideBuffer(buf, 2);

    expect(a.equals(Buffer.from('ab'))).toBeTruthy();
    expect(b.equals(Buffer.from('cde'))).toBeTruthy();
  });

  test('divide 0', () => {
    const buf = Buffer.from('abcde');
    const [a, b] = divideBuffer(buf, 0);

    expect(a.equals(Buffer.from(''))).toBeTruthy();
    expect(b.equals(Buffer.from('abcde'))).toBeTruthy();
  });

  test('divide 10', () => {
    const buf = Buffer.from('abcde');
    const [a, b] = divideBuffer(buf, 10);

    expect(a.equals(Buffer.from('abcde'))).toBeTruthy();
    expect(b.equals(Buffer.from(''))).toBeTruthy();
  });
});

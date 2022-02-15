import { calcIntrinsicValuePerShare, presentValue,IntrincValueData } from '../index';

test('Intrinsic value calc', () => {
  const data = new IntrincValueData(0.5, 15, 10, 8, 20);
  data.GrowthDecline = 2;
  const res = calcIntrinsicValuePerShare(data);

  expect(res.terminalValueDiscounted).toBe(16.749700681600686);
});

test('AAPL 2022 Q1 - EPS', () => {
  /*Compared with the value get on GURUFOCUS
  EPS: 6.040
  Growth: 14.7
  DiscountRate: 9
  Final PE: 20 for apple could be acceptable
  */
  const data = new IntrincValueData(6.040, 14.7, 10, 9, 20);
  // data.GrowthDecline = 2;
  data.GrowthDecline = 5;
  const res = calcIntrinsicValuePerShare(data);

  expect(res.terminalValueDiscounted).toBeCloseTo(155.448, 2);
});

test('AAPL 2022 Q1 - FCF', () => {
  /*Compared with the value get on GURUFOCUS
  EPS: 6.109
  Growth: 13.9
  DiscountRate: 10
  Final PFCF: 25 for apple could be acceptable
  */
  const data = new IntrincValueData(6.109, 13.9, 10, 10, 25);
  // data.GrowthDecline = 2;
  data.GrowthDecline = 5;
  const res = calcIntrinsicValuePerShare(data);

  expect(res.terminalValueDiscounted).toBeCloseTo(169.358, 2);
});
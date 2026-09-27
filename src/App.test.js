import {
  applyInfoRevealPenalty,
  calculatePointsWithSkill,
  calculateRoundPoints,
  shouldUnlockSkill
} from './App';

test('unlocks the skill after 5 correct answers', () => {
  expect(shouldUnlockSkill(4)).toBe(false);
  expect(shouldUnlockSkill(5)).toBe(true);
});

test('bonus skill grants a 20% points boost and stacks in 20% increases', () => {
  expect(calculatePointsWithSkill(75, 'bonus', 1)).toBe(90);
  expect(calculatePointsWithSkill(25, 'bonus', 2)).toBe(35);
  expect(calculatePointsWithSkill(100, 'heal')).toBe(100);
});

test('year and score share one 25-point reveal penalty while platforms remain separate', () => {
  expect(applyInfoRevealPenalty(80, 25)).toBe(55);
  expect(applyInfoRevealPenalty(15, 15)).toBe(0);
  expect(calculateRoundPoints(100, 25)).toBe(75);
  expect(calculateRoundPoints(100, 40)).toBe(60);
});

import { applyInfoRevealPenalty, calculatePointsWithSkill, shouldUnlockSkill } from './App';

test('unlocks the skill after 5 correct answers', () => {
  expect(shouldUnlockSkill(4)).toBe(false);
  expect(shouldUnlockSkill(5)).toBe(true);
});

test('bonus skill grants a 20% points boost and stacks in 20% increases', () => {
  expect(calculatePointsWithSkill(75, 'bonus', 1)).toBe(90);
  expect(calculatePointsWithSkill(25, 'bonus', 2)).toBe(35);
  expect(calculatePointsWithSkill(100, 'heal')).toBe(100);
});

test('revealing a card costs 20 points and never drops below zero', () => {
  expect(applyInfoRevealPenalty(80)).toBe(60);
  expect(applyInfoRevealPenalty(15)).toBe(0);
});

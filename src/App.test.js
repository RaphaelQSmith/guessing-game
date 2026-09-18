import { calculatePointsWithSkill, shouldUnlockSkill } from './App';

test('unlocks the skill after 5 correct answers', () => {
  expect(shouldUnlockSkill(4)).toBe(false);
  expect(shouldUnlockSkill(5)).toBe(true);
});

test('bonus skill grants a 20% points boost', () => {
  expect(calculatePointsWithSkill(75, 'bonus')).toBe(90);
  expect(calculatePointsWithSkill(25, 'bonus')).toBe(30);
  expect(calculatePointsWithSkill(100, 'heal')).toBe(100);
});

export const words = [
  'apple', 'banana', 'car', 'elephant', 'house', 'laptop', 'sun', 'tree'
];

export function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

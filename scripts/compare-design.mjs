// Diagnostic image comparison only; this script does not modify app assets.
import sharp from 'sharp';
import path from 'node:path';
const references = '/Users/gaiaghezzi/.codex/generated_images/01a1d584-d68b-7980-8eb5-c1f9993cf5e6';
const pairs = [
  ['departure', 'exec-76df0913-382a-4453-ac48-a07bc2512106.png'],
  ['encounter', 'exec-130a1b2b-4732-4d96-9602-63fe482f88c2.png'],
  ['journal', 'exec-db2c71f1-83df-4cfd-8fb2-24bdf48f05cf.png'],
];
for (const [name, reference] of pairs) {
  const src = path.join(references, reference);
  const actual = `work/qa/desktop-${name}.jpg`;
  const left = await sharp(src).resize(744, 529, { fit: 'fill' }).png().toBuffer();
  const right = await sharp(actual).resize(744, 529, { fit: 'fill' }).png().toBuffer();
  await sharp({ create: { width: 1488, height: 529, channels: 3, background: '#070c12' } }).composite([{ input: left, left: 0, top: 0 }, { input: right, left: 744, top: 0 }]).png().toFile(`work/qa/compare-${name}.png`);
  const box = name === 'departure' ? { left: 45, top: 100, width: 700, height: 440 } : name === 'encounter' ? { left: 900, top: 140, width: 550, height: 720 } : { left: 810, top: 275, width: 620, height: 650 };
  const regionLeft = await sharp(src).extract(box).png().toBuffer();
  const regionRight = await sharp(actual).extract(box).png().toBuffer();
  await sharp({ create: { width: box.width * 2, height: box.height, channels: 3, background: '#070c12' } }).composite([{ input: regionLeft, left: 0, top: 0 }, { input: regionRight, left: box.width, top: 0 }]).png().toFile(`work/qa/focus-${name}.png`);
}
console.log('Compared each source (left) with the implementation (right).');

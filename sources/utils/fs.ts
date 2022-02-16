import path from 'path';

const root = path.resolve(__dirname, '../../');

export function rootRelative(file: string) {
  const relative = path.relative(root, file);
  return relative;
}

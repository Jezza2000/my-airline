//route validation

export const AIRPORTS = {
  NZNE: 'Dairy Flat',
  YSSY: 'Sydney Kingsford Smith',
  NZRO: 'Rotorua',
  NZGB: 'Great Barrier Island',
  NZCI: 'Chatham Islands — Tuuta',
  NZTL: 'Lake Tekapo',
};

export const ROUTES = [
  { orig: 'NZNE', dest: 'YSSY' },
  { orig: 'YSSY', dest: 'NZNE' },
  { orig: 'NZNE', dest: 'NZRO' },
  { orig: 'NZRO', dest: 'NZNE' },
  { orig: 'NZNE', dest: 'NZGB' },
  { orig: 'NZGB', dest: 'NZNE' },
  { orig: 'NZNE', dest: 'NZCI' },
  { orig: 'NZCI', dest: 'NZNE' },
  { orig: 'NZNE', dest: 'NZTL' },
  { orig: 'NZTL', dest: 'NZNE' },
];

export function isValidRoute(orig, dest) {
  return ROUTES.some(r => r.orig === orig && r.dest === dest);
}
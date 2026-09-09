export function generateIpsQr(userId: string) {
  const K = 'PR';
  const V = '01';
  const C = '1';
  const R = '160530010241053156';
  const N = 'Lazar';
  const I = 'RSD600,00';
  const SF = '289';
  const S = 'Pretplata Pricedrop';
  const RO = userId;

  return `K:${K}|V:${V}|C:${C}|R:${R}|N:${N}|I:${I}|SF:${SF}|S:${S}|RO:${RO}`;
}

// Reads the DTCG token file and resolves aliases, so the Foundations pages always show what the build produces.
import tokens from '../../../../packages/tokens/src/tokens.json';

type Node = { $value?: unknown; $type?: string; [k: string]: unknown };
const root = tokens as unknown as Record<string, Node>;
const get = (path: string): Node | undefined => path.split('.').reduce<Node | undefined>((o, k) => (o ? (o[k] as Node) : undefined), root as unknown as Node);

export function resolveColour(value: string): string {
  const m = value.match(/^\{(.+)\}$/);
  if (!m) return value;
  return resolveColour(String(get(m[1])?.$value));
}
export const aliasOf = (value: string): string | null => value.match(/^\{(.+)\}$/)?.[1] ?? null;

export interface Swatch { name: string; cssVar: string; value: string; hex: string; alias: string | null }

/** All leaf tokens of a group, in file order. */
export function leaves(group: string): Array<{ key: string; node: Node }> {
  const g = get(group) as Record<string, Node> | undefined;
  if (!g) return [];
  return Object.entries(g).filter(([k, v]) => !k.startsWith('$') && v && typeof v === 'object' && '$value' in v).map(([key, node]) => ({ key, node }));
}
export function swatches(group: string, cssPrefix: string): Swatch[] {
  return leaves(group).map(({ key, node }) => {
    const value = String(node.$value);
    return { name: `${group.replace(/^colour\./, '')}/${key}`, cssVar: `--ds-${cssPrefix}-${key}`, value, hex: resolveColour(value), alias: aliasOf(value) };
  });
}
export const colourGroups = ['surface', 'border', 'text', 'action', 'status', 'rail'] as const;
export const primitiveGroups = ['neutral', 'accent', 'rail', 'positive', 'warning', 'negative', 'info'] as const;

const lin = (hex: string): number => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string): number => { const [x, y] = [lin(a), lin(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const DARK = resolveColour(String(get('colour.text.primary')?.$value));
const LIGHT = resolveColour(String(get('primitive.neutral.50')?.$value));

/** Dark or light ink, whichever has more contrast on the swatch colour (computed from the real token values). */
export function inkOn(hex: string): string {
  if (hex.replace('#', '').length < 6) return 'var(--ds-colour-text-primary)';
  return ratio(hex, DARK) >= ratio(hex, LIGHT) ? 'var(--ds-colour-text-primary)' : 'var(--ds-primitive-neutral-50)';
}

export const typeValue = (key: string) => get(`type.${key}`)?.$value as string | number;
export const spacingKeys = () => leaves('spacing').map(({ key, node }) => ({ key, px: Number(node.$value) }));
export const radiusKeys = () => leaves('radius').map(({ key, node }) => ({ key, value: node.$value as string | number }));
export const strokeKeys = () => leaves('stroke').map(({ key, node }) => ({ key, px: Number(node.$value) }));
export const elevationKeys = () => leaves('elevation').map(({ key }) => key);
export const stateKeys = (group: 'overlay' | 'opacity') => leaves(`state.${group}`).map(({ key, node }) => ({ key, pct: Number(node.$value) }));

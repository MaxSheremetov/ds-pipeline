// Tokens build: DTCG JSON (src/tokens.json) -> CSS variables (dist/tokens.css).
// Pure npm, no host or network dependency.
import StyleDictionary from 'style-dictionary';

// Numbers carry no unit in the DTCG source (they mirror Figma FLOAT variables).
// Lengths get px here, including font sizes, line heights and tracking (all px in Figma).
StyleDictionary.registerTransform({
  name: 'ds/length-px',
  type: 'value',
  filter: (t) => {
    const p = t.path;
    if (typeof t.$value !== 'number' && typeof t.value !== 'number') return false;
    return p[0] === 'spacing' || p[0] === 'container' || p[0] === 'radius' || p[0] === 'stroke' ||
      (p[0] === 'type' && /^(fs|line|track)-/.test(p[1]) && p[1] !== 'track-none') || (p[0] === 'type' && p[1] === 'track-none');
  },
  transform: (t) => `${t.$value ?? t.value}px`,
});
StyleDictionary.registerTransform({
  name: 'ds/percent',
  type: 'value',
  filter: (t) => t.path[0] === 'state',
  transform: (t) => `${t.$value ?? t.value}%`,
});
StyleDictionary.registerTransform({
  name: 'ds/empty-shadow',
  type: 'value',
  filter: (t) => (t.$type ?? t.type) === 'shadow' && Array.isArray(t.original?.$value) && t.original.$value.length === 0,
  transform: () => 'none',
});

const sd = new StyleDictionary({
  source: ['src/tokens.json', 'src/components.json'],
  log: { verbosity: 'default' },
  platforms: {
    css: {
      transforms: [...StyleDictionary.hooks.transformGroups.css, 'ds/length-px', 'ds/percent', 'ds/empty-shadow'],
      prefix: 'ds',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true, selector: ':root' },
      }],
    },
  },
});
await sd.buildAllPlatforms();

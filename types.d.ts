// Matchers added by vitest-axe in packages/ui/vitest.setup.ts
import 'vitest';
declare module 'vitest' {
  interface Assertion<T = any> { toHaveNoViolations(): T }
  interface AsymmetricMatchersContaining { toHaveNoViolations(): void }
}

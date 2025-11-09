// Minimal global declarations to satisfy TypeScript in this workspace
// These are intentionally permissive to avoid blocking edits when node_modules
// or @types/* packages are not installed. If you install proper types, remove
// or narrow these declarations.

declare module 'react' {
  // very small subset used by our components during type-checking
  export function useState<T>(initial: T | (() => T)): [T, (v: T) => void];
  export function useRef<T>(initial?: T | null): { current: T | null };
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  export const Fragment: any;
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare module 'lucide-react' {
  // export common icons as any to avoid type errors when @types are missing
  export const Send: any;
  export const Trophy: any;
  export const BookOpen: any;
  export const CreditCard: any;
  export const TrendingUp: any;
  export const Target: any;
  export const Brain: any;
  const _default: any;
  export default _default;
}

// Provide a very small JSX.IntrinsicElements so TSX files don't error when
// full React types aren't installed in the environment.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // allow any HTML tag with any props
      [elemName: string]: any;
    }
  }
}

export {};

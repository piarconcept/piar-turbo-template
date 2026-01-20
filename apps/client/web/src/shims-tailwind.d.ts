/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'tailwindcss' {
  // Minimal shim for editor/TS-server when tailwind types aren't resolved
  export type Config = any;
  const _default: any;
  export default _default;
}

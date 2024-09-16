declare module 'fs-extra/esm' {
  function readJSONSync(path: string): any
  function writeJSONSync(path: string, data: any): void
  function ensureDirSync(path: string): void
  export { readJSONSync, writeJSONSync, ensureDirSync }
}

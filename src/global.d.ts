declare module 'fs-extra/esm' {
  function readJSONSync(path: string): any
  function writeJSONSync(path: string, data: any): void
  function ensureDirSync(path: string): void
  export { ensureDirSync, readJSONSync, writeJSONSync }
}

declare module '@sentool/fetch-event-source' {
  export function fetchEventSource(url: string, options: any): void
}

# phio

## 0.2.2

### Patch Changes

- 467c4ba: Enh: Validate auth before tailing instance logs
- 4e8ddb5: Fix: auth token now stored correctly after refresh

## 0.2.1

### Patch Changes

- Fix: Link now uses package.json

## 0.2.0

### Minor Changes

- Introduced deploy command

### Patch Changes

- Command refactoring

## 0.1.2

### Patch Changes

- Enh: add --verbose flag to dev mode

## 0.1.1

### Patch Changes

- Fix: include and exclude defaults

## 0.1.0

### Minor Changes

- afc6e91: Added `link` command to link to a specific instance
- fff79df: pockethost.io now runs `bun install` when uploading a `bun.lockb`
- 9fc57d6: Added whoami command
- 9fc57d6: Added list command
- afc6e91: Added --include and --exclude options to dev watch mode

### Patch Changes

- afc6e91: Fix: log tailer will now restart on disconnect
- fff79df: Enh: watcher now looks for package.json and bun.lockb
- fff79df: Fix: watcher was incorrectly applying --include and --exclude
- fff79df: Enh: watcher now queues successive deployments that happen in rapid succession

## 0.0.2

### Patch Changes

- Forgot tsx dep

## 0.0.1

### Patch Changes

- a5bf2f3: Initial version

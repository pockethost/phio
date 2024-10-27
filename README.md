# phio: the pockethost.io CLI

**Auth**

```bash
bunx phio login
bunx phio whoami
```

**List instances**

```bash
bunx phio list
```

**Watch and push local changes instantly**

```bash
bunx phio dev [instance]
```

**Deploy to remote**

```bash
bunx phio deploy [instance]
```

**Tail logs**

```bash
bunx phio logs [instance]
```

## Configuration

Use `pockethost` in your `package.json` to save your instance name so you don't need to keep typing it:

```json
// package.json
{
  "pockethost": {
    "instanceId": "all-your-base"
  }
}
```

-or-

Use `pockethost.json` to save your instance name so you don't need to keep typing it.

```json
{
    "instanceId": "all-your-base'
}
```

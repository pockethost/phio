# phio: the pockethost.io CLI

**Auth**

```bash
bunx phio login
bunx phio logout
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
    "instanceName": "all-your-base"
  }
}
```

-or-

Use `pockethost.json` to save your instance name so you don't need to keep typing it.

```json
{
  "instanceName": "all-your-base"
}
```

## Environment Variables

The following environment variables can be used to override any saved configuration:

- `PHIO_USERNAME` - Override saved username
- `PHIO_PASSWORD` - Override saved password
- `PHIO_INSTANCE_NAME` - Override saved instance name

Environment variables take precedence over configuration in package.json or pockethost.json.

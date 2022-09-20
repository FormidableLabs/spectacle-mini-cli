spectacle-mini-cli
==================

A no frills, no build, no dependency CLI for creating Spectacle decks from Markdown source files.

## Usage

```sh
$ npx FormidableLabs/spectacle-mini-cli --help
Usage: spectacle-mini-cli [options]

Options:
  --slides, -s    Path to Markdown slides file    [string]
  --help, -h      Show help                       [boolean]
  --version, -v   Show version number             [boolean]

Examples:
  spectacle-mini-cli --slides ./path/to/slides.md
```

## Example

```sh
$ npx FormidableLabs/spectacle-mini-cli --slides ./path/to/slides.md
Spectacle deck available at http://localhost:3000
```

## More frills we could add

- [ ] `--host` option
- [ ] `--port` option
- [ ] publish to npm

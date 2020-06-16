## Navim

Navigates files on the terminal with the minimal amount of keystrokes.

## Usage

1. Install it with `npm i -g navim`.

2. Type `navim` on the terminal.

## How it works?

Navim lists all the files on the current directory with a `[key]` on its side:

```
$
/Users/v/navim
[a] .git
[b] node_modules
[c] package-lock.json
[d] package.json
[e] navim.js
[f] README.md
```

Then, to enter a directory or open a file on VIM, you just need to type the
corresponding key. Other commands include:

- `space`: enters the parent directory.

- `.`: goes back to previous directory.

- `/command<cr>`: executes a shell command.

- `<esc>`: quits.

That's all...

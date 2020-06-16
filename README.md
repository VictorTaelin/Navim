## Navim

Navigates files on the terminal with the minimal amount of keystrokes.

## Usage

1. Install it with `npm i -g navim`.

2. Type `navim` on the terminal.

It will list the files on the current directory with a `[key]` on its side:

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

Then you can type the following commands:

- `[key]`: enters a directory or opens a file on VIM.

- `space`: enters the parent directory.

- `.`: goes back to previous directory.

- `/command<cr>`: executes a shell command.

- `/exit<cr>` quits.

- `<esc>`: quits.

That's all...

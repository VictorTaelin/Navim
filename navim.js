#!/usr/bin/env node
process.stdin.setRawMode(true);

const fs = require("fs");
const child_process = require('child_process');
const editor = process.env.EDITOR || "vim";

var Files = {};
var Command = "";
var Back = [];

// Hardcoded because lazy
function key_of(index, total) {
  var keys = "abcdefghijklmnopqrstuvwxyz";
  var size = keys.length;
  if (total < size) {
    return keys[index % size];
  } else if (total < 676) {
    return keys[Math.floor(index / size) % size]
         + keys[index % size];
  } else {
    return keys[Math.floor(index / size / size) % size]
         + keys[Math.floor(index / size) % size]
         + keys[index % size];
  }
};

var get_files = () => fs.readdirSync(".");

function clear() {
  process.stdout.write('\033c')
};

function render() {
  clear();
  if (Files[Command]) {
    var file = Files[Command];
    Command = "";
    if (fs.lstatSync("./"+file).isDirectory()) {
      Back.push(process.cwd());
      process.chdir("./"+file);
    } else {
      process.stdin.pause();
      var child = child_process.spawn(editor, [file], {stdio: "inherit"});
      child.on("exit", function (e, code) {
        process.stdin.resume();
        render();
      });
      return;
    };
  } else if (Command[0] !== "/" && Command.slice(-1) === " ") {
    Command = "";
    process.chdir("./..");
  } else if (Command.slice(-1) === "☮") {
    process.exit();
  }
  var files = get_files();
  var rows = process.stdout.rows - 3;
  var lines = [];
  var sizes = [];
  for (var i = 0; i < rows; ++i) {
    lines.push([]);
    sizes.push([]);
  };
  Files = {};
  for (var i = 0; i < files.length; ++i) {
    var key = key_of(i, files.length);
    Files[key] = files[i];
    var file_name = fs.lstatSync("./"+files[i]).isDirectory()
                  ? "\033[4m" + files[i] + "\033[0m"
                  : files[i];
    lines[i % rows].push("["+key+"] "+file_name+" ");
    sizes[i % rows].push(key.length + files[i].length + 4);
  };
  var row_size = [];
  for (var i = 0; i < lines.length; ++i) {
    for (var j = 0; j < lines[i].length; ++j) {
      row_size[j] = Math.max(row_size[j]||0, sizes[i][j]);
    };
  };
  console.log("λ " + Command);
  console.log("\x1b[1m" + process.cwd() + "\x1b[0m");
  for (var i = 0; i < lines.length; ++i) {
    var line = "";
    for (var j = 0; j < lines[i].length; ++j) {
      var cell = lines[i][j];
      for (var k = 0; k < Math.max(row_size[j] - sizes[i][j], 0); ++k) {
        cell += " ";
      }
      line += cell;
    };
    console.log(line.slice(0, process.stdout.columns));
  };
};

function on_data(data) {
  var str = "" + data;
  clear();
  if (str === "\x1b" || str === "\x03") {
    process.exit();
  } else if (str === "\b" || str === "\x7f") {
    Command = Command.slice(0, -1);
  } else if (str === "\r") {
    if (Command[0] === "/") {
      child_process.exec(Command.slice(1), (err, strout, stderr) => {
        Command = "";
        render();
      });
    }
  } else if (str === "." && Command[0] !== "/") {
    var back = Back.pop();
    if (back) {
      process.chdir(back);
    };
  } else {
    Command += str;
  };
  render();
}
process.stdin.on("data", on_data);

render();

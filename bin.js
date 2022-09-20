#!/usr/bin/env node

"use strict";

/**
 * Simple Spectacle MD deck CLI
 */
const fs = require("fs").promises;
const path = require("path");
const http = require("http");
const url = require("url");

const pkg = require("./package.json");

const HOST = "localhost";
const PORT = 3000;
const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;

const USAGE = `
Usage: ${pkg.name} [options]

Options:
  --slides, -s    Path to Markdown slides file    [string]
  --help, -h      Show help                       [boolean]
  --version, -v   Show version number             [boolean]

Examples:
  ${pkg.name} --slides ./path/to/slides.md
`.trim();

// ============================================================================
// Helpers
// ============================================================================
const log = (...args) => console.log(...args); // eslint-disable-line no-console
const error = (...args) => console.error(...args); // eslint-disable-line no-console

const getServer = ({ index, slides }) => http.createServer((req, res) => {
  const urlPath = url.parse(req.url, true).pathname;

  // Routes
  if (urlPath === "/") {
    // Deck
    res.writeHead(HTTP_OK);
    res.end(index);
  } else if (urlPath === "/slides.json") {
    // Slides data
    res.setHeader("Content-Type", "application/json");
    res.writeHead(HTTP_OK);
    res.end(JSON.stringify({ slides }));
  } else {
    // 404 everything else
    res.writeHead(HTTP_NOT_FOUND);
    res.end("Not Found");
  }
});

// ============================================================================
// Actions
// ============================================================================
const help = async () => { log(USAGE); };
const version = async () => { log(pkg.version); };
const start = async ({ slidesPath }) => {
  if (!slidesPath) {
    throw new Error("Must provide --slides path!");
  }

  const slides = (await fs.readFile(path.resolve(slidesPath))).toString();
  const index = (await fs.readFile(path.resolve(__dirname, "index.html"))).toString();

  const server = getServer({ index, slides });
  server.listen(PORT, HOST, () => {
    log(`Spectacle deck available at http://${HOST}:${PORT}`);
  });
};

// ============================================================================
// Configuration
// ============================================================================
// Get action or help / version name
const getAction = (args) => {
  // Return actions in priority order.
  if (args.includes("--help") || args.includes("-h")) { return help; }
  if (args.includes("--version") || args.includes("-v")) { return version; }

  // Default.
  return start;
};

// Get options for actions.
const getOptions = (args) => ({
  slidesPath: args.find((_, i) => ["--slides", "-s"].includes(args[i - 1])) || null
});

// ============================================================================
// Script
// ============================================================================
const cli = async ({ args = [] } = {}) => {
  const opts = getOptions(args);
  const action = getAction(args);

  await action(opts);
};

if (require.main === module) {
  cli({
    args: process.argv.slice(2) // eslint-disable-line no-magic-numbers
  }).catch((err) => {
    error(err);
    process.exit(1); // eslint-disable-line no-process-exit
  });
}

/**
 * Simple CLI
 */
const fs = require("fs").promises;
const path = require("path");
const http = require("http");
const url = require("url");

const HOST = "localhost";
const PORT = 3000;

const getServer = ({ index, slides }) => http.createServer((req, res) => {
  const urlPath = url.parse(req.url, true).pathname;

  // Routes
  if (urlPath === "/") {
    // Deck
    res.writeHead(200);
    res.end(index);
  } else if (urlPath === "/slides.json") {
    // Slides data
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.write(JSON.stringify({ slides }, null, 2));
    res.end();
  } else {
    // 404 everything else
    res.writeHead(404);
    res.end("Not Found");
  }
})

const main = async ({ slidesArg }) => {
  if (!slidesArg) {
    throw new Error("Must provide slides!")
  }

  const slides = (await fs.readFile(path.resolve(slidesArg))).toString();
  const index = (await fs.readFile(path.resolve(__dirname, "index.html"))).toString();

  const server = getServer({ index, slides });
  server.listen(PORT, HOST, () => {
    console.log(`Spectacle deck available at http://${HOST}:${PORT}`);
  });
};

if (require.main === module) {
  main({
    slidesArg: process.argv[2] || null
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

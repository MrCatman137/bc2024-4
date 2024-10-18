const http = require("http");
const path = require("path");
const fs = require("fs");
const { program } = require("commander");

program
  .requiredOption("-h, --host <host>", "server host")
  .requiredOption("-p, --port <port>", "server port")
  .requiredOption("-c, --cache <path>", "cache directory path");

program.parse(process.argv);

const { host, port, cache } = program.opts();

const server = http.createServer(async (req, res) => {
  const code = req.url.slice(1);
  const imagePath = path.join(cache, `${code}.jpg`);

  switch (req.method) {
    case "GET":
      try {
        const image = await fs.promises.readFile(imagePath);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(image);
      } catch (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
      break;
  }
});

server.listen(port, host, () => {
  console.log(`Server http://${host}:${port}/`);
});

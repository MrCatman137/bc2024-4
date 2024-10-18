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
    case "PUT":
      try {
        const data = await new Promise((resolve, reject) => {
          const chunks = [];
          req.on("data", (chunk) => {
            chunks.push(chunk);
          });
          req.on("end", () => {
            resolve(Buffer.concat(chunks));
          });
          req.on("error", (error) => {
            console.error("Error receiving data:", error);
            reject(error);
          });
        });

        await fs.promises.writeFile(imagePath, data);
        res.writeHead(201, { "Content-Type": "text/plain" });
        res.end("Created");
      } catch (error) {
        console.error("Error in PUT handler:", error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
      }
      break;
  }
});

server.listen(port, host, () => {
  console.log(`Server http://${host}:${port}/`);
});

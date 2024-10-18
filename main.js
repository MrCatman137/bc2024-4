const http = require("http");
const path = require("path");
const { program } = require("commander");

program
  .requiredOption("-h, --host <host>", "server host")
  .requiredOption("-p, --port <port>", "server port")
  .requiredOption("-c, --cache <path>", "cache directory path");

program.parse(process.argv);

const { host, port, cache } = program.opts();

const server = http.createServer((req, res) => {});

server.listen(port, host, () => {
  console.log(`Server http://${host}:${port}/`);
});

const staticRecources = require('node-static');
const http = require('http');

let file = new(staticRecources.Server)(__dirname);
const server = http.createServer((req, res) => {
  file.serve(req, res);
});
server.listen(9898);
console.log('server listening on port 9898');
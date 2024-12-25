// Create web server and listen for requests
// 1. Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var port = 8080;
var comments = [];
var mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".json": "application/json"
};

// 2. Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), uri);
    if (req.method === "POST") {
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            comments.push(JSON.parse(body));
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write("Comment added successfully");
            res.end();
        });
    } else if (req.method === "GET") {
        if (uri === "/comments") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(comments));
            res.end();
        } else {
            fs.exists(filename, function (exists) {
                if (!exists) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.write("404 Not Found\n");
                    res.end();
                    return;
                }
                if (fs.statSync(filename).isDirectory()) filename += '/index.html';
                fs.readFile(filename, "binary", function (err, file) {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.write(err + "\n");
                        res.end();
                        return;
                    }
                    var ext = path.extname(filename);
                    res.writeHead(200, { "Content-Type": mimeTypes[ext] });
                    res.write(file, "binary");
                    res.end();
                });
            });
        }
    }
});

// 3. Listen on port 8080, IP defaults to 127.0


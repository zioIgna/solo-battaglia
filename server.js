const express = require('express');
const app = express();
const http = require("http");
const bodyParser = require('body-parser');
const debug = require("debug")("node-angular");

const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.Server(app);

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
};

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const io = require("socket.io").listen(server);

server.on("error", onError);
server.on("listening", onListening);
server.listen(port, function () {
    console.log('listening on port ' + port);
}
);

let loggedPlayers = 0;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

io.on('connection', function(socket){
    console.log("USER CONNECTED...");
    loggedPlayers++;
    console.log('Sono loggati ' + loggedPlayers + ' giocatori');
    socket.broadcast.emit('new connection', loggedPlayers);
    socket.on('disconnect', function () {
        loggedPlayers--;
        console.log('user disconnected');
        console.log('Sono loggati ' + loggedPlayers + ' giocatori');
    });

});
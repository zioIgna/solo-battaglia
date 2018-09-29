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
let availableZero = true;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

io.on('connection', function (socket) {
    console.log("USER CONNECTED...");
    loggedPlayers++;
    console.log('Sono loggati ' + loggedPlayers + ' giocatori');
    // io.emit('new connection', {loggedPlayers: loggedPlayers});
    io.emit('new connection', { loggedPlayers: loggedPlayers, av0: availableZero });
    availableZero = !availableZero;

    socket.on('disconnect', function () {
        loggedPlayers--;
        console.log('user disconnected');
        console.log('Sono loggati ' + loggedPlayers + ' giocatori');
        io.emit('user disconnected', loggedPlayers);
    });

    // funz per capire se la prossima nuova connectionId deve essere 0 o 1:
    socket.on('checkAvailability', function (info) {
        info === 0 ? availableZero = false : availableZero = true;
    });

    socket.on('new ship', function (ship) {
        socket.broadcast.emit('new ship', ship);
    });

    socket.on('hit', function (ship) {
        socket.broadcast.emit('hit', ship);
    })

    socket.on('miss', function (ship) {
        socket.broadcast.emit('miss', ship);
    })

    socket.on('endGame', function () {
        io.emit('endGame');
    })

    socket.on('switch player', function () {
        socket.broadcast.emit('switch player');
    });
});
import { cochilo } from ".";
import { createServer } from "net";
import { default as Koa } from "koa";
import { default as Router } from "koa-router";
import { createServer as _createServer } from "http";
import { gateway, server as _server } from "./config";

var app = new Koa();

var router = new Router();

app.use(router.routes());

app.use(router.allowedMethods());

const server = _createServer(app.callback());

const zzz = new cochilo({ app, router });

const dev = createServer(socket => {
    socket.on("data", source => {
        console.log("DATA INN");
        socket.write(JSON.stringify(zzz.transpiler(source)));
    });
});

dev.listen(_server.port);

server.on("listening", () => {
    console.info("Server is listening on port: %d", gateway.port);
});

server.listen(gateway.port);

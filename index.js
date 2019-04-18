import { transformSync } from "@babel/core";
import { gateway, server, transpile } from "./config";

const vm = require("vm");
var cote = require("cote");
const util = require("util");
const nano = require("nano")("http://couchdb:5984");

var uuid4 = require("uuid4");

const userResponder = new cote.Responder({ name: "User Responder" });

const userRequester = new cote.Requester({ name: "User Requester" });

const database = nano.use("ecommerce");

export class cochilo {
    constructor({ router }) {
        this.router = router;
        this.sandbox = {
            require,
            console,
            userResponder,
            exports: {}
        };
    }

    transpiler(code) {
        var result = transformSync(code, transpile);

        const script = new vm.Script(result.code);

        const context = vm.createContext(this.sandbox);

        script.runInContext(context);

        var id = uuid4();

        var mod = this.sandbox.exports.default;

        for (let fn in mod.functions) {
            let mt = new mod.functions[fn]();

            userResponder.on(id, req => mt.handler(req, { database }));

            let route = mod.functions[fn].manifest.router.GET;

            console.log(route);

            var r = this.router.routes();

            let stack = r.router.stack;

            for (var i in stack) {
                if (stack[i]["path"] == route) {
                    stack.splice(i, 1);
                    break;
                }
            }

            this.router.get(route, async (ctx, next) => {
                ctx.body = await userRequester.send({ type: id, query: ctx.query, body: ctx.body });
                next();
            });
        }

        return {};
    }
}

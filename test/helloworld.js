// import { tasks, ecommerce, mail } from "cochilo";

class helloworld {
    static manifest = {
        router: {
            GET: "/helloworld"
        }
    };

    async handler(ctx, { database }) {
        database.insert({});
        return ctx;
    }
}

export default {
    name: "Hello world",
    functions: { helloworld }
};

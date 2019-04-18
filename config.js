module.exports = {
    server: {
        port: 8080
    },
    gateway: {
        port: 80
    },
    redis: {
        port: 3333
    },
    transpile: {
        presets: ["@babel/env", "@babel/react"],
        plugins: [
            ["@babel/plugin-proposal-class-properties"],
            ["@babel/plugin-syntax-dynamic-import"],
            [
                "@babel/plugin-transform-runtime",
                {
                    regenerator: true
                }
            ]
        ]
    }
};

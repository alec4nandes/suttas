const path = require("path");

module.exports = {
    entry: "./public/pre-bundle.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./public"),
    },
};

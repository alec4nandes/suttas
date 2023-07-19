const path = require("path");

module.exports = {
    entry: "./public/admin/pre-bundle.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./public/admin"),
    },
};

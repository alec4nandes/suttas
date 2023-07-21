const { db } = require("./db/database.js"),
    { collection, getDocs } = require("firebase/firestore");

module.exports = async function () {
    async function getAllSuttas() {
        const querySnapshot = await getDocs(collection(db, "suttas")),
            allSuttas = {};
        querySnapshot.forEach(
            (d) => (allSuttas[d.id] = getAllLines(d.data().text).flat(Infinity))
        );
        return allSuttas;
    }

    function getAllLines(lines) {
        return Object.entries(lines).map(([key, value]) =>
            typeof value === "string" ? value : getAllLines(value)
        );
    }

    return {
        all_suttas: await getAllSuttas(),
    };
};

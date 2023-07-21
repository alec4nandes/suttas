const { db } = require("./db/database.js"),
    { collection, getDocs } = require("firebase/firestore");

module.exports = async function () {
    async function getAllSuttas() {
        const querySnapshot = await getDocs(collection(db, "suttas")),
            allSuttas = {};
        querySnapshot.forEach((d) => {
            const { notes, text } = d.data();
            allSuttas[d.id] = { notes, text: getAllLines(text) };
        });
        return allSuttas;
    }

    function getAllLines(lines, result = []) {
        Object.entries(lines).forEach(([key, value], i, a) => {
            if (typeof value === "string") {
                result.push([key, value]);
            } else {
                getAllLines(value, result);
                const isLast = i === a.length - 1;
                isLast && result.push(["", "<br/>"]);
            }
        });
        return result;
    }

    return {
        all_suttas: await getAllSuttas(),
    };
};

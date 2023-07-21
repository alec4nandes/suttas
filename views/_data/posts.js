const { db } = require("./db/database.js"),
    { collection, getDocs } = require("firebase/firestore");

module.exports = async function () {
    async function getAllPosts() {
        const querySnapshot = await getDocs(collection(db, "posts")),
            allPosts = [];
        querySnapshot.forEach((d) => allPosts.push({ ...d.data(), id: d.id }));
        return allPosts;
    }

    return {
        all_posts: await getAllPosts(),
    };
};

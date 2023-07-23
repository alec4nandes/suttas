const { db } = require("./db/database.js"),
    { collection, getDocs } = require("firebase/firestore");

module.exports = async function () {
    async function getAllPosts() {
        const querySnapshot = await getDocs(collection(db, "posts")),
            allPosts = [];
        querySnapshot.forEach((d) => allPosts.push({ ...d.data(), id: d.id }));
        allPosts.sort((a, b) => b.date.seconds - a.date.seconds);
        return allPosts;
    }

    const all_posts = await getAllPosts();
    return {
        all_posts,
        tags: sortPostsByTag(all_posts),
    };
};

function sortPostsByTag(posts) {
    return Object.entries(
        posts.reduce((acc, post) => {
            const { tags } = post;
            tags.forEach((tag) => acc[tag]?.push(post) || (acc[tag] = [post]));
            return acc;
        }, {})
    ).sort((a, b) => a[0].localeCompare(b[0]));
}

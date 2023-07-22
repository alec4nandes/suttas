import { useEffect, useState } from "react";
import { db } from "../scripts/database";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function BlogForm({ suttaId, getAllSuttaIds }) {
    const [dbPost, setDbPost] = useState({});

    useEffect(() => {
        getPost();

        async function getPost() {
            const docRef = doc(db, "posts", suttaId),
                d = await getDoc(docRef);
            setDbPost(d ? { ...d.data(), id: d.id } : {});
        }
    }, [suttaId]);

    async function handlePostToBlog(e) {
        e.preventDefault();
        const {
                title,
                subtitle,
                image_url,
                image_caption,
                content,
                tags,
                date,
            } = e.target,
            getValue = (field) => field.value.trim(),
            getTags = (tags) =>
                tags.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            getDate = (date) => new Date(date.value),
            data = {
                title: getValue(title),
                subtitle: getValue(subtitle),
                image_url: getValue(image_url),
                image_caption: getValue(image_caption),
                content: getValue(content),
                tags: getTags(tags),
                date: getDate(date),
            };
        try {
            const docRef = doc(db, "posts", suttaId);
            await setDoc(docRef, data);
            await getAllSuttaIds();
            alert("Post saved!");
        } catch (err) {
            const { code, message } = err;
            console.error(`${code}: ${message}`);
            alert("Could not save post! Check console.");
        }
    }

    function parseDate(ms) {
        const date = new Date(ms),
            pad = (num) => ("" + num).padStart(2, "0"),
            mm = pad(date.getMonth() + 1),
            dd = pad(date.getDate()),
            yyyy = date.getFullYear(),
            hh = pad(date.getHours()),
            mi = pad(date.getMinutes()),
            parsed = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
        return parsed;
    }

    return (
        <details id="blog-form">
            <summary>Write Post</summary>
            <form
                onSubmit={handlePostToBlog}
                key={`post-${dbPost.id || suttaId}`}
            >
                <label htmlFor="title">title:</label>
                <input
                    name="title"
                    id="title"
                    type="text"
                    defaultValue={dbPost.title}
                    required
                />
                <label htmlFor="subtitle">subtitle:</label>
                <input
                    name="subtitle"
                    id="subtitle"
                    type="text"
                    defaultValue={dbPost.subtitle}
                />
                <label htmlFor="image-url">image url:</label>
                <input
                    name="image_url"
                    id="image-url"
                    type="text"
                    defaultValue={dbPost.image_url}
                />
                <label htmlFor="image-caption">image caption:</label>
                <input
                    name="image_caption"
                    id="image-caption"
                    type="text"
                    defaultValue={dbPost.image_caption}
                />
                <label htmlFor="content">content:</label>
                <textarea
                    name="content"
                    id="content"
                    type="text"
                    defaultValue={dbPost.content}
                    required
                ></textarea>
                <label htmlFor="tags">tags:</label>
                <input
                    name="tags"
                    id="tags"
                    type="text"
                    defaultValue={dbPost.tags?.join(", ")}
                />
                <label htmlFor="date">date:</label>
                <input
                    name="date"
                    id="date"
                    type="datetime-local"
                    defaultValue={parseDate(
                        dbPost.date
                            ? dbPost.date.seconds * 1000
                            : new Date().getTime()
                    )}
                />
                <button type="submit">post</button>
            </form>
        </details>
    );
}

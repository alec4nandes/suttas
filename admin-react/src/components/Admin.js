import "../css/admin.css";
import { useCallback, useEffect, useState } from "react";
import { db } from "../scripts/database.js";
import { addCopyListener, addHighlightListener } from "../scripts/listen.js";
import getSuttaData from "../scripts/fetch.js";
import StickyNav from "./StickyNav/StickyNav";
import BlogForm from "./BlogForm";
import Hierarchy from "./Hierarchy";
import Lines from "./Lines";
import EditSaveDelete from "./EditSaveDelete/EditSaveDelete";
import { getDocs, collection } from "firebase/firestore";

export default function Admin() {
    const [allSuttaIds, setAllSuttaIds] = useState([]),
        [suttaId, setSuttaId] = useState(""),
        [allNotes, setAllNotes] = useState([]),
        [note, setNote] = useState({}),
        [lines, setLines] = useState({});

    /* CALLBACKS */

    const getAllSuttaIds = useCallback(async function () {
        const suttaDbIds = await helper("suttas"),
            postsDbIds = await helper("posts"),
            allIds = [...new Set([...suttaDbIds, ...postsDbIds])].sort();
        setAllSuttaIds(allIds);

        async function helper(coll) {
            const querySnapshot = await getDocs(collection(db, coll)),
                all = [];
            querySnapshot.forEach(({ id }) => all.push(id));
            return all;
        }
    }, []);

    const scrollToHighlight = useCallback(function () {
        document
            .querySelector(".highlight")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, []);

    /* USE EFFECTS */

    useEffect(() => {
        addHighlightListener({ setAllNotes, setNote });
        addCopyListener();
    }, []);

    useEffect(() => {
        getAllSuttaIds();
    }, [getAllSuttaIds]);

    useEffect(() => {
        scrollToHighlight();
    }, [note, scrollToHighlight]);

    useEffect(() => {
        suttaId &&
            getSuttaData({
                suttaId,
                setNote,
                setLines,
                setAllNotes,
            });
    }, [suttaId]);

    return (
        <>
            <StickyNav
                {...{
                    suttaId,
                    setSuttaId,
                    allSuttaIds,
                    allNotes,
                    setAllNotes,
                    note,
                    setNote,
                    scrollToHighlight,
                }}
            />
            <EditSaveDelete
                {...{
                    suttaId,
                    lines,
                    allNotes,
                    getAllSuttaIds,
                    setAllSuttaIds,
                    setAllNotes,
                    setNote,
                }}
            />
            <main>
                {suttaId && lines ? (
                    <>
                        <br />
                        <BlogForm
                            {...{
                                suttaId,
                                getAllSuttaIds,
                            }}
                        />
                        <hr />
                        <Hierarchy {...{ suttaId }} />
                        <Lines {...{ lines, note }} />
                    </>
                ) : (
                    <></>
                )}
            </main>
        </>
    );
}

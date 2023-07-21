import { useEffect, useRef, useState } from "react";
import { auth } from "../../scripts/database.js";
import FindForm from "./FindForm";
import NavigationButtons from "./NavigationButtons";
import SuttaButtons from "./SuttaButtons";
import EditNoteButtons from "./EditNoteButtons";
import { signOut } from "firebase/auth";

export default function StickyNav({
    suttaId,
    setSuttaId,
    allSuttaIds,
    allNotes,
    setAllNotes,
    note,
    setNote,
    scrollToHighlight,
}) {
    const [isEditing, setIsEditing] = useState(false),
        [deletingIndex, setDeletingIndex] = useState(null);

    const selectRef = useRef(),
        inputRef = useRef();

    function setFormValues(suttaId) {
        selectRef.current.value = suttaId;
        inputRef.current.value = suttaId;
    }

    useEffect(() => {
        if (isEditing) {
            scrollToHighlight();
            setTimeout(() => {
                const edit = prompt("Edit note:", note.note || "");
                if (edit !== null) {
                    note.note = edit;
                }
                setIsEditing(false);
            }, 500);
        }
    }, [isEditing, note, scrollToHighlight]);

    useEffect(() => {
        if (deletingIndex !== null) {
            scrollToHighlight();
            setTimeout(() => {
                const proceed = window.confirm("Delete note?");
                if (proceed) {
                    setNote({});
                    setAllNotes((allNotes) =>
                        allNotes.toSpliced(deletingIndex, 1)
                    );
                }
                setDeletingIndex(null);
            }, 500);
        }
    }, [deletingIndex, note, scrollToHighlight, setAllNotes, setNote]);

    async function isEnglishTranslation(suttaId) {
        const endpoint = `https://suttacentral.net/api/bilarasuttas/${suttaId}/en`,
            data = await (await fetch(endpoint)).json();
        return !!data.translation_text;
    }

    function handleSignOut() {
        signOut(auth)
            .then()
            .catch((error) => {
                const { code, message } = error;
                console.error(code);
                alert(message);
            });
    }

    return (
        <div id="sticky-nav">
            <FindForm
                {...{
                    suttaId,
                    setSuttaId,
                    isEnglishTranslation,
                    setFormValues,
                    selectRef,
                    inputRef,
                }}
            />
            <div>
                <div>
                    <NavigationButtons
                        {...{
                            suttaId,
                            setSuttaId,
                            setFormValues,
                            isEnglishTranslation,
                        }}
                    />
                    <button id="sign-out" onClick={handleSignOut}>
                        sign out
                    </button>
                </div>
                <SuttaButtons
                    {...{
                        allSuttaIds,
                        setSuttaId,
                        setFormValues,
                    }}
                />
                <EditNoteButtons
                    {...{
                        allNotes,
                        setNote,
                        setIsEditing,
                        setDeletingIndex,
                        scrollToHighlight,
                    }}
                />
            </div>
        </div>
    );
}

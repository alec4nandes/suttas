import { db } from "../../scripts/database.js";
import { doc, setDoc } from "firebase/firestore";

export default function SaveButton({
    suttaId,
    lines,
    allNotes,
    getAllSuttaIds,
}) {
    async function handleSave() {
        const proceed = window.confirm("Save changes?");
        if (proceed) {
            try {
                await setDoc(doc(db, "suttas", suttaId), {
                    text: lines,
                    notes: allNotes,
                });
                await getAllSuttaIds();
                alert("Changes saved!");
            } catch (err) {
                console.error(err);
                alert("Could not save!");
            }
        }
    }

    return (
        <button id="save" onClick={handleSave}>
            save
        </button>
    );
}

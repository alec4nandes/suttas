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
                alert("Notes saved!");
            } catch (err) {
                const { code, message } = err;
                console.error(`${code}: ${message}`);
                alert("Could not save notes!");
            }
        }
    }

    return (
        <button id="save" onClick={handleSave}>
            save
            <br />
            notes
        </button>
    );
}

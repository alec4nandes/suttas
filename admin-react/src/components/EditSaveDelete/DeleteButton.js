import { db } from "../../scripts/database.js";
import { deleteDoc, doc } from "firebase/firestore";

export default function DeleteButton({ suttaId, setAllSuttaIds }) {
    async function handleDelete() {
        const proceed = window.confirm("Delete record from database?");
        if (proceed) {
            try {
                const docRef = doc(db, "suttas", suttaId);
                await deleteDoc(docRef);
                setAllSuttaIds((ids) => ids.toSpliced(ids.indexOf(suttaId), 1));
                alert("Record deleted!");
            } catch (err) {
                const { code, message } = err;
                console.error(code + ": " + message);
                alert("Could not delete! Check console.");
            }
        }
    }

    return (
        <button id="delete" onClick={handleDelete}>
            delete
        </button>
    );
}

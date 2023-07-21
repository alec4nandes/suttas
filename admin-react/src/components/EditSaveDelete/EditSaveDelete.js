import SaveButton from "./SaveButton";
import DeleteButton from "./DeleteButton";

export default function EditSaveDelete({
    suttaId,
    lines,
    allNotes,
    getAllSuttaIds,
    setAllSuttaIds,
}) {
    return (
        <>
            <button id="cite">cite</button>
            <SaveButton {...{ suttaId, lines, allNotes, getAllSuttaIds }} />
            <DeleteButton {...{ suttaId, setAllSuttaIds }} />
        </>
    );
}
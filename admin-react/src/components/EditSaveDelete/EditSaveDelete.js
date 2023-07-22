import SaveButton from "./SaveButton";
import DeleteButton from "./DeleteButton";

export default function EditSaveDelete({
    suttaId,
    lines,
    allNotes,
    getAllSuttaIds,
    setAllSuttaIds,
    setAllNotes,
    setNote,
    hierarchy,
}) {
    return (
        <>
            <button id="cite">cite</button>
            <SaveButton
                {...{ suttaId, lines, allNotes, getAllSuttaIds, hierarchy }}
            />
            <DeleteButton
                {...{ suttaId, setAllSuttaIds, setAllNotes, setNote }}
            />
        </>
    );
}

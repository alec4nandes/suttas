export default function EditNoteButtons({
    allNotes,
    setNote,
    setIsEditing,
    setDeletingIndex,
    scrollToHighlight,
}) {
    return (
        <table id="note-buttons">
            <tbody>
                <tr>
                    {allNotes.map((note, i) => (
                        <EditNoteButtonCell {...{ key: `edit-${i}`, i }} />
                    ))}
                </tr>
            </tbody>
        </table>
    );

    function EditNoteButtonCell({ i }) {
        return (
            <td data-index={i}>
                <button
                    className="note-button"
                    onClick={() => {
                        scrollToHighlight();
                        setNote(allNotes[i]);
                        allNotes[i].note &&
                            setTimeout(() => alert(allNotes[i].note), 500);
                    }}
                >
                    {i + 1}
                </button>
                <button
                    className="edit-note-button"
                    onClick={() => {
                        setNote(allNotes[i]);
                        setIsEditing(true);
                    }}
                >
                    ✎
                </button>
                <button
                    className="delete-note-button"
                    onClick={() => {
                        setNote(allNotes[i]);
                        setDeletingIndex(i);
                    }}
                >
                    ✕
                </button>
            </td>
        );
    }
}

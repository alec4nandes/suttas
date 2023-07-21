export default function SuttaButtons({
    allSuttaIds,
    setSuttaId,
    setFormValues,
}) {
    return (
        <div id="sutta-buttons">
            {allSuttaIds.map((id) => (
                <button
                    key={`db-sutta-${id}`}
                    onClick={() => {
                        setFormValues(id);
                        setSuttaId(id);
                    }}
                >
                    {id}
                </button>
            ))}
        </div>
    );
}

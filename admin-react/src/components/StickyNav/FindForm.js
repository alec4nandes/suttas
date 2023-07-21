import { everySuttaId } from "../../scripts/crawled";

export default function FindForm({
    suttaId,
    setSuttaId,
    isEnglishTranslation,
    setFormValues,
    selectRef,
    inputRef,
}) {
    async function handleFindSutta(e) {
        e.preventDefault();
        const id = e.target.typed.value.trim() || e.target.sutta.value.trim();
        if (await isEnglishTranslation(id)) {
            setFormValues(id);
            setSuttaId(id);
        } else {
            alert("No English translation yet. Try another sutta ID.");
            const value = suttaId || everySuttaId[0];
            setFormValues(value);
        }
    }

    return (
        <form onSubmit={handleFindSutta}>
            <select
                ref={selectRef}
                name="sutta"
                defaultValue={suttaId}
                onChange={(e) => (inputRef.current.value = e.target.value)}
            >
                {everySuttaId.map((id) => (
                    <option key={`option ${id}`} value={id}>
                        {id}
                    </option>
                ))}
            </select>
            <label>
                <input
                    ref={inputRef}
                    name="typed"
                    type="text"
                    defaultValue={suttaId}
                />
            </label>
            <button type="submit">find</button>
        </form>
    );
}

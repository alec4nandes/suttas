import { displaySuttaHTML } from "./display.js";

const text = [],
    notes = [],
    testNotes = [
        {
            starts_at: "1.1.2",
            ends_at: "1.1.5",
            text: "Buddha was traveling along the road between Rājagaha and Nāḷandā together with a large Saṅgha of five hundred mendicants.\n1.1.3\tThe wanderer Suppiya was also traveling along the same road, together with his pupil, the brahmin student Brahmadatta.\n1.1.4\tMeanwhile, Suppiya criticized the Buddha, the teaching, and the Saṅgha in many ways,\n1.1.5\tbut his pupil Brahmadatta praised them",
        },
        {
            starts_at: "1.1.1",
            ends_at: "1.1.1",
            text: "I have hea",
        },
    ];

function getNoteButtonsHTML() {
    return notes.length
        ? `
            <br/>
            <table id="note-buttons">
                <tr>
                    ${notes.map((note, i) => getCellHTML(i)).join("")}
                </tr>
            </table>
        `
        : "";
}

function getCellHTML(i) {
    return `
        <td data-index="${i}">
            ${getNumberedNoteButton(i)}
            <button class="edit-note-button">
                ✎
            </button>
            <button class="delete-note-button">
                ✕
            </button>
        </td>
    `;
}

function getNumberedNoteButton(i) {
    return `<button class="note-button">${i + 1}</button>`;
}

function addNoteButtonsHandlers() {
    const noteButtons = document.querySelectorAll("button.note-button"),
        editButtons = document.querySelectorAll("button.edit-note-button"),
        deleteButtons = document.querySelectorAll("button.delete-note-button");
    if (noteButtons.length) {
        noteButtons.forEach(handleGetNote);
        editButtons.forEach(handleEditNote);
        deleteButtons.forEach(handleDeleteNote);
    }
}

function handleGetNote(button) {
    button.onclick = async () => {
        const { index, note } = getNoteData(button);
        await displaySuttaHTML(null, null, index);
        showHighlight();
        note && setTimeout(() => alert(note), 500);
    };
}

function handleEditNote(button) {
    button.onclick = async () => {
        const { index, noteData, note } = getNoteData(button);
        await displaySuttaHTML(null, null, index);
        showHighlight();
        setTimeout(async () => {
            noteData.note = prompt(`Edit note:`, note || "") ?? note;
        }, 500);
    };
}

function handleDeleteNote(button) {
    button.onclick = async () => {
        const { index } = getNoteData(button);
        await displaySuttaHTML(null, null, index);
        showHighlight();
        setTimeout(async () => {
            if (confirm(`Delete note?`)) {
                notes.splice(index, 1);
                await displaySuttaHTML();
            }
        }, 500);
    };
}

function showHighlight() {
    document.querySelector(".highlight").scrollIntoView({ block: "center" });
}

function getNoteData(button) {
    console.log(notes, +button.textContent - 1);
    const index = button.parentNode.dataset.index || +button.textContent - 1,
        noteData = notes[index],
        { note } = noteData;
    return { index, noteData, note };
}

export {
    text,
    notes,
    getNoteButtonsHTML,
    addNoteButtonsHandlers,
    getNumberedNoteButton,
};

import { getLines } from "./fetch.js";
import { getSuttaHierarchyHTML } from "./hierarchy.js";
import {
    text,
    notes,
    getNoteButtonsHTML,
    addNoteButtonsHandlers,
    getNumberedNoteButton,
} from "./notes.js";
import { highlightLine } from "./highlight.js";
import { db } from "./database.js";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

async function handleDisplaySutta(e) {
    e.preventDefault();
    notes.length = 0;
    const typed = e.target.typed.value.trim(),
        suttaId = e.target.sutta.value,
        value = typed || suttaId;
    await displaySuttaHTML(value);
}

async function displaySuttaHTML(suttaId, lines, noteIndex) {
    const typedInput = document.querySelector(`input[name="typed"]`),
        suttaSelect = document.querySelector(`select[name="sutta"]`),
        stickyNotes = document.querySelector("#sticky-notes");
    suttaId = suttaId || typedInput.value || suttaSelect.value;
    lines = lines || (await getLines(suttaId));
    // assign to global variable
    text.length = 0;
    text.push([lines].filter(Boolean));
    const note = notes[noteIndex],
        displayElem = document.querySelector("main"),
        html =
            "<br/>" +
            (await getSuttaHierarchyHTML(suttaId)) +
            getNoteButtonsHTML() +
            getLinesHTML(lines, note);
    displayElem.innerHTML = html;
    stickyNotes.innerHTML = notes
        .map((note, i) => getNumberedNoteButton(i))
        .join("");
    addNoteButtonsHandlers();
    await getDbSuttaButtons();
    typedInput.value = suttaId;
    suttaSelect.value = suttaId;
}

async function getDbSuttaButtons() {
    const querySnapshot = await getDocs(collection(db, "suttas")),
        allIds = [];
    querySnapshot.forEach((doc) => allIds.push(doc.id));
    const html = allIds
        .map((suttaId) => `<button class="sutta-button">${suttaId}</button>`)
        .join("");
    document.querySelector("#sutta-buttons").innerHTML = html;
    addDbSuttaButtonHandlers();
}

function addDbSuttaButtonHandlers() {
    const suttaButtons = document.querySelectorAll(".sutta-button");
    suttaButtons.forEach((button) => (button.onclick = handleSuttaButton));
}

async function handleSuttaButton(e) {
    const suttaId = e.target.textContent,
        docRef = doc(db, "suttas", suttaId),
        { text: dbText, notes: dbNotes } = (await getDoc(docRef)).data();
    text.length = 0;
    notes.length = 0;
    text.push(dbText);
    notes.push(...dbNotes);
    await displaySuttaHTML(suttaId, dbText);
}

function getLinesHTML(lines, note) {
    const result = `
        <table id="lines">
            ${getRowsRecursiveHTML(lines, note)}
        </table>
    `;
    return result;
}

function getRowsRecursiveHTML(lines, note) {
    if (!lines) {
        return getWarningHTML();
    }
    return Object.entries(lines)
        .map(([key, value], i, a) => {
            const nums = key.split(":")[1],
                isString = typeof value === "string",
                isTitle = isString && nums.split(".")[0] === "0",
                isLine = isString && !isTitle,
                isLast = i === a.length - 1;
            return isTitle
                ? getLineHTML({ key, value, note, isTitle: true })
                : isLine
                ? getLineHTML({ key, value, note })
                : getRowsRecursiveHTML(value, note) +
                  (isLast ? getSpacerHTML() : "");
        })
        .join("");
}

function getWarningHTML() {
    return `
        <tr>
            <td class="warning">
                No translation from Bhikkhu Sujato.
            </td>
        </tr>
    `;
}

// this is important for regex recognition
const regexSuffix = "_";

function getLineHTML({ key, value, note, isTitle }) {
    return `
        <tr data-line-num="${key}">
            <td class="line-number">
                <small>
                    ${key}<span class="hidden-regex">${regexSuffix}</span>
                </small>
            </td>
            <td class="${isTitle ? "title " : ""}line">
                ${highlightLine({ lineNumber: key, line: value, note })}
            </td>
        </tr>
    `;
}

function getSpacerHTML() {
    return `
        <tr class="spacer">
            <td class="line-number"></td>
            <td>
                <br/>
            </td>
        </tr>
    `;
}

export { handleDisplaySutta, displaySuttaHTML, getDbSuttaButtons, regexSuffix };

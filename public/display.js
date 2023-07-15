import { getLines } from "./fetch.js";
import { getSuttaHierarchyHTML } from "./hierarchy.js";
import { notes, getNoteButtonsHTML, addNoteButtonsHandlers } from "./notes.js";
import { highlightText } from "./highlight.js";

async function handleDisplaySutta(e) {
    e.preventDefault();
    notes.length = 0;
    const suttaId = e.target.sutta.value;
    await displaySuttaHTML(suttaId);
}

async function displaySuttaHTML(suttaId, lines, noteIndex) {
    suttaId = suttaId || document.querySelector(`select[name="sutta"]`).value;
    lines = lines || (await getLines(suttaId));
    const note = notes[noteIndex],
        displayElem = document.querySelector("main"),
        html =
            "<br/>" +
            (await getSuttaHierarchyHTML(suttaId)) +
            getNoteButtonsHTML() +
            getLinesHTML(lines, note);
    displayElem.innerHTML = html;
    addNoteButtonsHandlers();
}

function getLinesHTML(lines, note) {
    return `<table class="lines">${getRowsRecursiveHTML(lines, note)}</table>`;
}

let lastKey;

function getRowsRecursiveHTML(lines, note) {
    if (!lines) {
        return getWarningHTML();
    }
    return Object.entries(lines)
        .map(([key, value], i, a) => {
            const isLine = typeof value === "string",
                nums = key.split(":")[1],
                isTitle = isLine && nums.split(".")[0] === "0",
                isLast = i === a.length - 1;
            isLine && (lastKey = key);
            return isLine
                ? isTitle
                    ? getTitleHTML(value)
                    : getLineHTML({ key, value, note })
                : getRowsRecursiveHTML(value, note) +
                      (isLast ? getSpacerHTML(lastKey) : "");
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

function getTitleHTML(value) {
    return `
        <tr>
            <td class="title" colspan="2">${value}</td>
        </tr>
    `;
}

function getLineHTML({ key, value, note }) {
    return `
        <tr data-line-num="${key}">
            <td class="line-number">
                <small>${key}</small>
            </td>
            <td>
                ${highlightText(key, value, note)}
            </td>
        </tr>
    `;
}

function getSpacerHTML(lastKey) {
    return `
        <tr data-line-num="${lastKey}">
            <td class="spacer" colspan="2">
                ☸
            </td>
        </tr>
    `;
}

export { handleDisplaySutta, displaySuttaHTML };

import { getLines } from "./fetch.js";
import { getSuttaHierarchyHTML } from "./hierarchy.js";
import { notes, getNoteButtonsHTML, addNoteButtonsHandlers } from "./notes.js";
import { highlightText } from "./highlight.js";

async function handleDisplaySutta(e) {
    e.preventDefault();
    notes.length = 0;
    const typed = e.target.typed.value.trim(),
        suttaId = e.target.sutta.value,
        value = typed || suttaId;
    e.target.typed.value = value;
    e.target.sutta.value = value;
    await displaySuttaHTML(value);
}

async function displaySuttaHTML(suttaId, lines, noteIndex) {
    suttaId =
        suttaId ||
        document.querySelector(`input[name="typed"]`).value ||
        document.querySelector(`select[name="sutta"]`).value;
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

let pastTitle = false,
    lastKey = "";

function getLinesHTML(lines, note) {
    const result = `
        <table class="lines">
            ${getRowsRecursiveHTML(lines, note)}
        </table>
    `;
    pastTitle = false;
    lastKey = "";
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
            isLine && (pastTitle = true);
            isLine && pastTitle && (lastKey = key);
            return isTitle
                ? getTitleHTML(value)
                : isLine
                ? getLineHTML({ key, value, note })
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

// the _ is important for regex recognition
function getLineHTML({ key, value, note }) {
    return `
        <tr data-line-num="${key}">
            <td class="line-number">
                <small>
                    ${key}<span class="hidden-regex">_</span>
                </small>
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

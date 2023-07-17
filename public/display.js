import { getLines } from "./fetch.js";
import { getSuttaHierarchyHTML } from "./hierarchy.js";
import { notes, getNoteButtonsHTML, addNoteButtonsHandlers } from "./notes.js";
import { highlightLine } from "./highlight.js";

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

// the _ is important for regex recognition
function getLineHTML({ key, value, note, isTitle }) {
    return `
        <tr data-line-num="${key}">
            <td class="line-number">
                <small>
                    ${key}<span class="hidden-regex">_</span>
                </small>
            </td>
            <td class="${isTitle ? "title " : ""}line">
                ${highlightLine({ lineNumber: key, line: value, note })}
            </td>
        </tr>
    `;
}

const spacerChar = "☸";

function getSpacerHTML() {
    return `
        <tr data-line-num="x">
            <td class="spacer" colspan="2">
                ${spacerChar}
            </td>
        </tr>
    `;
}

export { handleDisplaySutta, displaySuttaHTML, spacerChar };

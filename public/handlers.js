import {
    displaySuttaHTML,
    handleDisplaySutta,
    regexSuffix,
} from "./display.js";
import { everySuttaId } from "./crawled.js";
import { getRandomSutta } from "./fetch.js";
import { handleCite } from "./cite.js";
import { notes } from "./notes.js";

function addHandlers() {
    const formElem = document.querySelector("form"),
        selectElem = formElem.querySelector(`select[name="sutta"]`),
        previousButton = document.querySelector("button#previous"),
        nextButton = document.querySelector("button#next"),
        randomButton = document.querySelector("button#random");
    formElem.onsubmit = handleDisplaySutta;
    selectElem.innerHTML = everySuttaId
        .map((id) => `<option value="${id}">${id}</option>`)
        .join("");
    selectElem.onchange = () =>
        (document.querySelector(`input[name="typed"]`).value = "");
    previousButton.onclick = handlePreviousSutta;
    nextButton.onclick = handleNextSutta;
    randomButton.onclick = getRandomSutta;
    document.addEventListener("selectionchange", () => {
        // use this approach for mobile highlighting, because
        // the selection object gets stale when passed
        // into the citeButton event listener on mobile
        const citeButton = document.querySelector("button#cite"),
            selection = window.getSelection(),
            { anchorNode, anchorOffset, focusNode, focusOffset } = selection,
            text = selection.toString();
        citeButton.onclick = () =>
            handleCite({
                anchorNode,
                anchorOffset,
                focusNode,
                focusOffset,
                text,
            });
    });
    document.addEventListener("copy", (event) => {
        const highlightedText = window.getSelection().toString();
        event.clipboardData.setData(
            "text/plain",
            removeLineNumsFromHighlightedText(highlightedText, true)
        );
        event.preventDefault();
    });
}

async function handlePreviousSutta() {
    navigationHelper(true);
}

async function handleNextSutta() {
    navigationHelper(false);
}

async function navigationHelper(isPrevious) {
    const selectElem = document.querySelector(`select[name="sutta"]`),
        currentSutta = selectElem.value,
        index = everySuttaId.indexOf(currentSutta),
        previousSutta = everySuttaId[index + (isPrevious ? -1 : 1)];
    if (previousSutta) {
        await displaySuttaHTML(previousSutta);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    } else {
        alert(`No ${isPrevious ? "previous" : "next"} sutta!`);
    }
}

function removeLineNumsFromHighlightedText(text, trimLines) {
    const getIndex = (line) => {
            const index = line.indexOf(regexSuffix);
            return index >= 0 ? index + regexSuffix.length : 0;
        },
        result = text
            .split("\n")
            .map((line) => line.slice(getIndex(line)))
            .map((line) => (trimLines ? line.trim() : line))
            .join("\n");
    return result;
}

export { addHandlers, removeLineNumsFromHighlightedText };

import { handleDisplaySutta } from "./display.js";
import { everySuttaId } from "./crawled.js";
import { getRandomSutta } from "./fetch.js";
import { handleCite } from "./cite.js";

function addHandlers() {
    const formElem = document.querySelector("form"),
        selectElem = formElem.querySelector(`select[name="sutta"]`),
        randomButton = document.querySelector("button#random");
    formElem.onsubmit = handleDisplaySutta;
    selectElem.innerHTML = everySuttaId
        .map((id) => `<option value="${id}">${id}</option>`)
        .join("");
    randomButton.onclick = () => getRandomSutta(selectElem);
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
        event.clipboardData.setData(
            "text/plain",
            removeLineNumbersAndSpacers(window.getSelection().toString())
        );
        event.preventDefault();
    });
}

function removeLineNumbersAndSpacers(text) {
    // trail line numbers with a hidden _ to help regex
    const lineNumRegex = /.?[A-Za-z]*([0-9]+[.]?)+:?([0-9]+[.]?)*_/g;
    return (
        text
            .replace(lineNumRegex, "\n")
            .replace(/[☸\t]/g, "")
            // .replace(/\n\n\n/g, "\n\n")
            .trim()
    );
}

export { addHandlers, removeLineNumbersAndSpacers };

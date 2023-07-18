import { handleDisplaySutta, regexSuffix } from "./display.js";
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
    selectElem.onchange = () =>
        (document.querySelector(`input[name="typed"]`).value = "");
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
    const getIndex = (line) => line.indexOf(regexSuffix) + 1,
        result = text
            .split("\n")
            .map((line) => line.slice(getIndex(line)).trim())
            .join("\n");
    return result;
}

export { addHandlers, removeLineNumbersAndSpacers };

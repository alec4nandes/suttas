import handleCite, { removeLineNumsFromHighlightedText } from "./cite.js";

function addHighlightListener({ setAllNotes, setNote }) {
    document.addEventListener("selectionchange", () => {
        // use this approach for mobile highlighting, because
        // the selection object gets stale when passed
        // into the citeButton event listener on mobile
        const citeButton = document.querySelector("button#cite");
        if (citeButton) {
            const selection = window.getSelection(),
                { anchorNode, anchorOffset, focusNode, focusOffset } =
                    selection,
                text = selection.toString();
            citeButton.onclick = () =>
                handleCite({
                    anchorNode,
                    anchorOffset,
                    focusNode,
                    focusOffset,
                    text,
                    setAllNotes,
                    setNote,
                });
        }
    });
}

function addCopyListener() {
    document.addEventListener("copy", (event) => {
        const highlightedText = window.getSelection().toString();
        event.clipboardData.setData(
            "text/plain",
            removeLineNumsFromHighlightedText(highlightedText, true)
        );
        event.preventDefault();
    });
}

export { addHighlightListener, addCopyListener };

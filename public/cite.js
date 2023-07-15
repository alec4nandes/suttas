import { displaySuttaHTML } from "./display.js";
import { notes } from "./notes.js";

function handleCite({
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    text,
}) {
    const getLineNum = (node) =>
            node && (node.dataset?.lineNum || getLineNum(node.parentNode)),
        anchorNum = getLineNum(anchorNode),
        focusNum = getLineNum(focusNode);
    if (anchorNum && focusNum) {
        const [starts_at, ends_at] = [anchorNum, focusNum].sort(() =>
                selectionIsBackwards() ? -1 : 1
            ),
            note = prompt("Note:"),
            result = { starts_at, ends_at, text, note };
        notes.push(result);
        displaySuttaHTML(null, null, notes.length - 1);
        return result;
    } else {
        alert("Could not cite. Outside text selected.");
    }

    function selectionIsBackwards() {
        const range = document.createRange();
        range.setStart(anchorNode, anchorOffset);
        range.setEnd(focusNode, focusOffset);
        const isBackwards = range.collapsed;
        range.detach();
        return isBackwards;
    }
}

export { handleCite };

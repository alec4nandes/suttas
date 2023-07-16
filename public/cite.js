import { notes } from "./notes.js";
import { displaySuttaHTML } from "./display.js";
import { removeLineNumbersAndSpacers } from "./handlers.js";

async function handleCite({
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
            note = prompt("Note:");
        let lines = getLinesFromText(text);
        const combinedOffset = anchorOffset + lines[0].length;
        text = text.indexOf("\n")
            ? anchorNode.nodeValue.slice(0, anchorOffset) +
              `<span class="highlight">${anchorNode.nodeValue
                  .slice(anchorOffset, combinedOffset)
                  .trim()}</span>` +
              anchorNode.nodeValue.slice(combinedOffset) +
              text.slice(anchorNode.nodeValue.length)
            : text;
        lines = getLinesFromText(text);
        const result = { starts_at, ends_at, note, lines, text };
        notes.push(result);
        await displaySuttaHTML(null, null, notes.length - 1);
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

function getLinesFromText(text) {
    return removeLineNumbersAndSpacers(text)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export { handleCite };

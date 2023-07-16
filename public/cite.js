import { notes } from "./notes.js";
import { displaySuttaHTML } from "./display.js";
import { lineNumRegex, removeLineNumbersAndSpacers } from "./handlers.js";

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
        const note = prompt("Note:"),
            [starts_at, ends_at] = [anchorNum, focusNum].sort(() =>
                selectionIsBackwards() ? -1 : 1
            ),
            startsWithNewLine = !text.indexOf("\n"),
            startsWithLineNumber = !text.search(lineNumRegex),
            lines = startsWithNewLine
                ? getLinesFromText(text)
                : startsWithLineNumber
                ? highlightEntireFirstLine(text)
                : preformatLines({ text, anchorOffset, anchorNode }),
            result = { note, starts_at, ends_at, lines };
        console.log(result);
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

function highlightEntireFirstLine(text) {
    const lines = getLinesFromText(text);
    lines[0] = wrapHighlight(lines[0]);
    return lines;
}

function preformatLines({ text, anchorOffset, anchorNode }) {
    const lines = getLinesFromText(text),
        firstLine = lines[0],
        combinedOffset = anchorOffset + firstLine.length,
        { nodeValue } = anchorNode,
        startText = nodeValue.slice(0, anchorOffset),
        highlightedText = nodeValue.trim().slice(anchorOffset, combinedOffset),
        endText = nodeValue.slice(combinedOffset),
        // line break is lost if at end of nodeValue,
        // due to text.slice(nodeValue.length)
        addBreak = combinedOffset === nodeValue.trim().length,
        newText =
            startText +
            wrapHighlight(highlightedText) +
            endText +
            (addBreak ? "\n" : "") +
            text.slice(nodeValue.length);
    return getLinesFromText(newText);
}

function wrapHighlight(text) {
    return `<span class="highlight">${text}</span>`;
}

export { handleCite, wrapHighlight };

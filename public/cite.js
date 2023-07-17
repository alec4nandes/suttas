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
    const lines = getLinesFromText(text),
        noLines = !lines[0],
        onlyLineNumHighlighted = (node) =>
            node &&
            (node.classList?.contains("line-number")
                ? node
                : onlyLineNumHighlighted(node.parentNode)),
        onlyLineNumAnchor = onlyLineNumHighlighted(anchorNode),
        onlyLineNumFocus = onlyLineNumHighlighted(focusNode),
        onlyLineNum =
            (onlyLineNumAnchor || onlyLineNumFocus) &&
            onlyLineNumAnchor === onlyLineNumFocus;
    if (noLines || onlyLineNum) {
        return;
    }
    const isBackwards = selectionIsBackwards(),
        sorter = () => (isBackwards ? -1 : 1);
    [anchorNode, focusNode] = [anchorNode, focusNode].sort(sorter);
    [anchorOffset, focusOffset] = [anchorOffset, focusOffset].sort(sorter);
    const getLineNumberNode = (node) =>
            node &&
            (node.dataset?.lineNum ? node : getLineNumberNode(node.parentNode)),
        anchorLineNumNode = getLineNumberNode(anchorNode),
        focusLineNumNode = getLineNumberNode(focusNode);
    if (anchorLineNumNode && focusLineNumNode) {
        const note = prompt("Note:"),
            getRow = (node) => node.nextElementSibling.previousElementSibling,
            rowIsSpacer = (row) => row.getAttribute("data-line-num") === "x";
        let firstRow = getRow(anchorLineNumNode),
            lastRow = getRow(focusLineNumNode);
        while (rowIsSpacer(firstRow)) {
            firstRow = firstRow.nextElementSibling;
        }
        while (rowIsSpacer(lastRow)) {
            lastRow = lastRow.previousElementSibling;
        }
        const getLineNum = (row) => row.getAttribute("data-line-num"),
            starts_at = getLineNum(firstRow),
            ends_at = getLineNum(lastRow),
            getNode = (row) => row.children[1].childNodes[0],
            realAnchorNode = getNode(firstRow),
            realFocusNode = getNode(lastRow),
            anchorText = realAnchorNode.nodeValue,
            focusText = realFocusNode.nodeValue,
            offset = anchorNode === realAnchorNode ? anchorOffset : 0,
            first_line = formatFirstLine(anchorText, offset, lines),
            last_line = formatLastLine(focusText, lines),
            result = {
                note,
                starts_at,
                ends_at,
                first_line,
                last_line,
            };
        notes.push(result);
        await displaySuttaHTML(null, null, notes.length - 1);
        console.log(result);
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

function formatFirstLine(line, offset, lines) {
    line = offset ? line : line.trim();
    const firstLine = lines[0],
        combinedOffset = offset + firstLine.length,
        start = line.slice(0, offset),
        highlightedText = line.slice(offset, combinedOffset),
        end = line.slice(combinedOffset),
        result = start + wrapHighlight(highlightedText) + end;
    return result.trim();
}

function formatLastLine(line, lines) {
    const lastLine = lines.at(-1);
    return line.replace(lastLine, wrapHighlight(lastLine)).trim();
}

function wrapHighlight(text) {
    return `<span class="highlight">${text}</span>`;
}

export { handleCite, wrapHighlight };

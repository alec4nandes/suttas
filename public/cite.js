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
        getNodeWithClass = (node, className) =>
            node &&
            (node.classList?.contains(className)
                ? node
                : getNodeWithClass(node.parentNode, className)),
        lineNumAnchor = getNodeWithClass(anchorNode, "line-number"),
        lineNumFocus = getNodeWithClass(focusNode, "line-number"),
        onlyLineNum =
            (lineNumAnchor || lineNumFocus) && lineNumAnchor === lineNumFocus;
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
            rowIsSpacer = (row) => row.dataset.lineNum === "x",
            startsWithNewLine = !text.indexOf("\n");
        let firstRow = anchorLineNumNode,
            lastRow = focusLineNumNode;
        startsWithNewLine && (firstRow = firstRow.nextElementSibling);
        while (rowIsSpacer(firstRow)) {
            firstRow = firstRow.nextElementSibling;
        }
        while (rowIsSpacer(lastRow)) {
            lastRow = lastRow.previousElementSibling;
        }
        const getLineNum = (row) => row.getAttribute("data-line-num"),
            starts_at = getLineNum(firstRow),
            ends_at = getLineNum(lastRow),
            getCell = (row) => row.children[1],
            anchorCell = getCell(firstRow),
            focusCell = getCell(lastRow),
            getNodeValueHelper = (node) =>
                node.childNodes?.length
                    ? [...node.childNodes].map((node) => getNodeValue(node))
                    : [node.nodeValue],
            getNodeValue = (node) =>
                getNodeValueHelper(node).flat(Infinity).join(""),
            anchorText = getNodeValue(anchorCell),
            focusText = getNodeValue(focusCell),
            offset =
                !startsWithNewLine && getNodeWithClass(anchorNode, "line")
                    ? anchorOffset
                    : 0,
            highlightNode = getNodeWithClass(anchorNode, "highlight"),
            first_line = formatFirstLine({
                line: anchorText,
                offset,
                lines,
                highlightNode,
            }),
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
        console.log(result, text);
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

function formatFirstLine({ line, offset, lines, highlightNode }) {
    line = offset ? line : line.trim();
    if (highlightNode) {
        for (const node of highlightNode.parentNode.childNodes) {
            if (node === highlightNode) {
                break;
            }
            offset += node.nodeValue.length;
        }
    }
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

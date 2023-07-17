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
            startsWithNewLine = !text.indexOf("\n"),
            rowIsSpacer = (row) => row.dataset.lineNum === "x";
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
            getNodeValue = (node) =>
                getAllChildNodes(node)
                    .map((node) => node.nodeValue)
                    .join(""),
            anchorText = getNodeValue(anchorCell),
            focusText = getNodeValue(focusCell),
            calculateOffset =
                !startsWithNewLine && getNodeWithClass(anchorNode, "line"),
            offset = calculateOffset ? anchorOffset : 0,
            first_line = formatFirstLine({
                line: anchorText,
                anchorNode,
                offset,
                calculateOffset,
                lines,
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

function getNodeWithClass(node, className) {
    return (
        node &&
        (node.classList?.contains(className)
            ? node
            : getNodeWithClass(node.parentNode, className))
    );
}

function getAllChildNodes(node) {
    return getAllChildNodesHelper(node).flat(Infinity);
}

function getAllChildNodesHelper(node) {
    return node.childNodes?.length
        ? [...node.childNodes].map((node) => getAllChildNodes(node))
        : [node];
}

function formatFirstLine({ line, anchorNode, offset, calculateOffset, lines }) {
    offset += calculateOffset
        ? getCalculatedOffset(getNodeWithClass(anchorNode, "line"), anchorNode)
        : 0;
    line = offset ? line : line.trim();
    const firstLine = lines[0],
        combinedOffset = offset + firstLine.length,
        start = line.slice(0, offset),
        highlightedText = line.slice(offset, combinedOffset),
        end = line.slice(combinedOffset),
        result = start + wrapHighlight(highlightedText) + end;
    return result.trim();
}

function getCalculatedOffset(node, targetNode) {
    const children = getAllChildNodes(node);
    let offset = 0;
    for (const child of children) {
        if (child === targetNode) {
            break;
        }
        offset += child.nodeValue.length;
    }
    return offset;
}

function wrapHighlight(text) {
    return `<span class="highlight">${text}</span>`;
}

function formatLastLine(line, lines) {
    const lastLine = lines.at(-1);
    return line.replace(lastLine, wrapHighlight(lastLine)).trim();
}

export { handleCite, wrapHighlight };

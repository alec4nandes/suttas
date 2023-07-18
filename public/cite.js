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
    // see if any sutta text is actually selected
    const lines = getLinesFromText(text),
        noLines = !lines[0],
        showWarning = () => alert("Could not cite. No valid text selected.");
    if (noLines) {
        showWarning();
        return;
    }
    // recursively travel up the parent nodes to make sure
    // both the anchor and focus nodes reside in the lines table
    const isLinesTableChild = (node) =>
            node &&
            (node.id === "lines" ? node : isLinesTableChild(node.parentNode)),
        entireSelectionIsInTable =
            isLinesTableChild(anchorNode) && isLinesTableChild(focusNode);
    if (entireSelectionIsInTable) {
        const getLineNumberRow = (node) =>
            node &&
            (node.dataset?.lineNum || node.classList?.contains("spacer")
                ? node
                : getLineNumberRow(node.parentNode));
        let anchorRow = getLineNumberRow(anchorNode),
            focusRow = getLineNumberRow(focusNode);
        // sort the nodes based on the the dragging direction of the highlight
        const isBackwards = selectionIsBackwards(),
            sorter = () => (isBackwards ? -1 : 1);
        [anchorRow, focusRow] = [anchorRow, focusRow].sort(sorter);
        [anchorNode, focusNode] = [anchorNode, focusNode].sort(sorter);
        [anchorOffset, focusOffset] = [anchorOffset, focusOffset].sort(sorter);
        // ask user for custom note
        const note = prompt("Note:"),
            startsWithNewLine = !text.indexOf("\n"),
            endsWithTab = text.charAt(text.length - 1) === "\t",
            getLineNum = (row) => row.dataset?.lineNum,
            rowIsSpacer = (row) => !getLineNum(row);
        // determine first and last line numbers to cite
        let firstRow = anchorRow,
            lastRow = focusRow;
        // move the first row forward if it's a spacer row
        // or if the highlighted text starts with the final
        // newline character from the previous line
        startsWithNewLine && (firstRow = firstRow.nextElementSibling);
        while (rowIsSpacer(firstRow)) {
            firstRow = firstRow.nextElementSibling;
        }
        // move the last row backward if it's a spacer row,
        // or if the highlighted text ends with the first \t
        // of the next line
        endsWithTab && (lastRow = lastRow.previousElementSibling);
        while (rowIsSpacer(lastRow)) {
            lastRow = lastRow.previousElementSibling;
        }
        // get the line numbers for where the citation starts and ends
        const starts_at = getLineNum(firstRow),
            ends_at = getLineNum(lastRow),
            // wrap the highlighted sections of the first
            // and last lines in the annotation
            isSingleLine = starts_at === ends_at,
            { first_line, last_line } = getFirstAndLastLines({
                firstRow,
                lastRow,
                startsWithNewLine,
                isSingleLine,
            });
        // prepare data
        let result = {
            note,
            starts_at,
            first_line,
        };
        // add last line info if not a single-line citation
        if (last_line) {
            result = { ...result, ends_at, last_line };
        }
        // add note to global notes object
        notes.push(result);
        // update UI to show newly added note
        const lastNoteIndex = notes.length - 1;
        await displaySuttaHTML(null, null, lastNoteIndex);
        console.log(result);
    } else {
        showWarning();
    }

    // ENCLOSED FUNCTIONS FOR handleCite

    function getLinesFromText(text) {
        return removeLineNumbersAndSpacers(text)
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
    }

    function selectionIsBackwards() {
        const range = document.createRange();
        range.setStart(anchorNode, anchorOffset);
        range.setEnd(focusNode, focusOffset);
        const isBackwards = range.collapsed;
        range.detach();
        return isBackwards;
    }

    function getFirstAndLastLines({
        firstRow,
        lastRow,
        startsWithNewLine,
        isSingleLine,
    }) {
        // get the table cell that has the line of sutta text
        const getCell = (row) => row.children[1],
            anchorCell = getCell(firstRow),
            getFullLine = (node) =>
                getAllChildNodes(node)
                    .map((node) => node.nodeValue)
                    .join(""),
            anchorLine = getFullLine(anchorCell),
            // only get an offset if the highlighted text
            // does NOT begin with a newline character
            // from the end of the previous row
            offset = startsWithNewLine
                ? 0
                : anchorOffset + getCalculatedOffset(anchorCell),
            first_line = formatFirstLine({
                line: anchorLine,
                offset,
                lines,
            });
        let last_line;
        if (!isSingleLine) {
            const focusCell = getCell(lastRow),
                focusLine = getFullLine(focusCell);
            last_line = formatLastLine({ line: focusLine, lines });
        }
        return { first_line, last_line };

        // ENCLOSED FUNCTIONS FOR getFirstAndLastLines

        function getAllChildNodes(node) {
            return getAllChildNodesHelper(node).flat(Infinity);
        }

        function getAllChildNodesHelper(node) {
            return node.childNodes?.length
                ? [...node.childNodes].map(getAllChildNodesHelper)
                : [node];
        }

        function getCalculatedOffset(node) {
            // add up all the other nodes' lengths that come before the
            // anchor node in table cell that has the line of sutta text
            const children = getAllChildNodes(node);
            let offset = 0;
            for (const child of children) {
                if (child === anchorNode) {
                    break;
                }
                offset += child.nodeValue.length;
            }
            return offset;
        }

        function formatFirstLine({ line, offset, lines }) {
            // if no offset, then no need for bookend white space
            line = offset ? line : line.trim();
            const firstLine = lines[0],
                combinedOffset = offset + firstLine.length,
                start = line.slice(0, offset),
                highlightedText = line.slice(offset, combinedOffset),
                end = line.slice(combinedOffset),
                result = start + wrapHighlight(highlightedText) + end;
            return result.trim();
        }

        function formatLastLine({ line, lines }) {
            const lastLine = lines.at(-1);
            return line.replace(lastLine, wrapHighlight(lastLine)).trim();
        }
    }
}

function wrapHighlight(text) {
    return `<span class="highlight">${text}</span>`;
}

export { handleCite, wrapHighlight };

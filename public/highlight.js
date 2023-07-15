import { removeLineNumbersAndSpacers } from "./handlers.js";

/*
    The text value of a note object contains a string
    with embedded line numbers copied from the lines table.
    If the text includes lineNumber, highlight the entire line.
*/
function highlightText(lineNumber, line, note) {
    if (note) {
        const { starts_at, ends_at, text } = note,
            hasLine =
                [starts_at, ends_at].includes(lineNumber) ||
                text.includes(lineNumber);
        if (hasLine) {
            const isFirstLine = lineNumber === starts_at,
                isLastLine = lineNumber === ends_at;
            if (isFirstLine || isLastLine) {
                const splitLines = removeLineNumbersAndSpacers(text)
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    firstLine = splitLines[0],
                    lastLine = splitLines.at(-1);
                // first or last line highlights
                return getHighlightHTML(
                    line,
                    isFirstLine ? firstLine : lastLine
                );
            }
            // middle line, full highlight
            return getHighlightHTML(line, line);
        }
    }
    return line;
}

function getHighlightHTML(line, text) {
    const replaced = `<span class="highlight">${text}</span>`;
    return line.replace(text, replaced);
}

export { highlightText };

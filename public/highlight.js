/*
    The text value of a note object contains a string
    with embedded line numbers copied from the lines table.
    If the text includes lineNumber, highlight the entire line.
*/

let highlighting = false;

function highlightText(lineNumber, line, note) {
    if (note) {
        const { starts_at, ends_at, lines, text } = note,
            startsWithNewLine = !text.indexOf("\n"),
            isFirstLine = lineNumber === starts_at,
            isLastLine = lineNumber === ends_at,
            isSpacer = line.includes("☸");
        isFirstLine && (highlighting = true);
        if (highlighting && !isSpacer) {
            isLastLine && (highlighting = false);
            if ((isFirstLine && !startsWithNewLine) || starts_at === ends_at) {
                // first line is already formatted
                return lines[0];
            }
            if (isLastLine) {
                const lastLine = lines.at(-1);
                return getHighlightHTML(line, lastLine);
            }
            if (!isFirstLine) {
                // middle line, full highlight
                return getHighlightHTML(line, line);
            }
        }
    }
    return line;
}

function getHighlightHTML(line, text) {
    const replaced = `<span class="highlight">${text}</span>`;
    return line.replace(text, replaced);
}

export { highlightText, getHighlightHTML };

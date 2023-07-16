import { wrapHighlight } from "./cite.js";

let highlighting = false;

function highlightText(lineNumber, line, note) {
    if (note) {
        const { starts_at, ends_at, lines } = note,
            isFirstLine = lineNumber === starts_at,
            isLastLine = lineNumber === ends_at,
            isSingleLine = starts_at === ends_at;
        isFirstLine && (highlighting = true);
        if (highlighting) {
            (isSingleLine || isLastLine) && (highlighting = false);
            const isSpacer = line.includes("☸");
            if (!isSpacer) {
                if (isSingleLine || isFirstLine) {
                    // first line is already formatted
                    const firstLine = lines[0];
                    return firstLine;
                }
                if (isLastLine) {
                    const lastLine = lines.at(-1);
                    return getHighlightHTML(line, lastLine);
                }
                // middle line, full highlight
                return getHighlightHTML(line, line);
            }
        }
    }
    return line;
}

function getHighlightHTML(line, text) {
    return line.replace(text, wrapHighlight(text));
}

export { highlightText };

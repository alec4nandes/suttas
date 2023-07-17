import { spacerChar } from "./display.js";
import { wrapHighlight } from "./cite.js";

let highlighting = false;

function highlightLine({ lineNumber, line, note }) {
    if (note) {
        const { starts_at, ends_at, first_line, last_line } = note,
            isFirstLine = lineNumber === starts_at,
            isLastLine = lineNumber === ends_at,
            isSingleLine = starts_at === ends_at;
        isFirstLine && (highlighting = true);
        if (highlighting) {
            const isSpacer = line.includes(spacerChar);
            if (!isSpacer) {
                isLastLine && (highlighting = false);
                return isSingleLine || isFirstLine
                    ? first_line
                    : isLastLine
                    ? last_line
                    : wrapHighlight(line);
            }
        }
    }
    return line;
}

export { highlightLine };

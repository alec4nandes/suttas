import React from "react";
import { regexSuffix, wrapHighlight } from "../scripts/cite.js";

export default function Lines({ lines, note }) {
    let highlighting = false;

    function RowsRecursiveHTML({ lines }) {
        return Object.entries(lines).map(([lineNumber, line], i, a) => {
            const isString = typeof line === "string",
                isTitle =
                    isString &&
                    (lineNumber.includes(".0") || lineNumber.includes(":0")),
                isLine = isString && !isTitle,
                isLast = i === a.length - 1;
            return isTitle || isLine ? (
                <LineHTML {...{ key: lineNumber, lineNumber, line, isTitle }} />
            ) : (
                <React.Fragment key={`nested-${lineNumber}`}>
                    <RowsRecursiveHTML {...{ lines: line }} />
                    {isLast && <SpacerHTML />}
                </React.Fragment>
            );
        });
    }

    function LineHTML({ lineNumber, line, isTitle }) {
        let result;

        function HighlightLine({ note }) {
            if (note) {
                const { starts_at, ends_at, first_line, last_line } = note,
                    isFirstLine = lineNumber === starts_at,
                    isLastLine = lineNumber === ends_at,
                    isSingleLine = !last_line;
                isFirstLine && (highlighting = true);
                if (highlighting) {
                    (isLastLine || isSingleLine) && (highlighting = false);
                    const html = isFirstLine
                        ? first_line
                        : isLastLine
                        ? last_line
                        : wrapHighlight(line);
                    result = <PreformattedLine line={html} />;
                }
            }
            return result || <PreformattedLine {...{ line }} />;

            function PreformattedLine({ line }) {
                return <div dangerouslySetInnerHTML={{ __html: line }}></div>;
            }
        }

        return (
            <tr data-line-num={lineNumber}>
                <td className="line-number">
                    <small>
                        {lineNumber}
                        <span className="hidden-regex">{regexSuffix}</span>
                    </small>
                </td>
                <td className={(isTitle ? "title " : "") + "line"}>
                    <HighlightLine {...{ note }} />
                </td>
            </tr>
        );
    }

    function SpacerHTML() {
        return (
            <tr className="spacer">
                <td className="line-number"></td>
                <td>
                    <br />
                </td>
            </tr>
        );
    }

    return (
        <table id="lines">
            <tbody>
                <RowsRecursiveHTML {...{ lines }} />
            </tbody>
        </table>
    );
}

export { regexSuffix };

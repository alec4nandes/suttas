const notes = JSON.parse(
        document.querySelector("#notes-json").textContent.trim() || "{}"
    ),
    textTable = document.querySelector("table#text"),
    noteButtons = document
        .querySelector("#note-buttons")
        .querySelectorAll("button");

console.log(notes);

noteButtons.forEach((button, i) => {
    button.onclick = () => getLinesHTML(notes[i]);
});

function getLinesHTML(note) {
    const { first_line, starts_at, last_line, ends_at } = note,
        allLines = getAllLines();
    let highlighting = false;
    textTable.innerHTML = allLines.map(getRowHTML).join("");
    const firstHighlight = document.querySelector(".highlight");
    firstHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
    note.note && setTimeout(() => alert(note.note), 800);

    function getRowHTML(pair) {
        const [lineNum, line] = pair,
            isFirstLine = lineNum === starts_at,
            isLastLine = lineNum === ends_at,
            isSingleLine = starts_at === ends_at,
            isTitle = lineNum.includes(".0") || lineNum.includes(":0");
        isFirstLine && (highlighting = true);
        const result = `
            <tr>
                <td class="line-number">${lineNum}</td>
                <td class="line${isTitle ? " title" : ""}">
                    ${
                        isFirstLine
                            ? first_line
                            : isLastLine
                            ? last_line
                            : highlighting
                            ? `<span class="highlight">${line}</span>`
                            : line
                    }
                </td>
            </tr>
        `;
        (isLastLine || isSingleLine) && (highlighting = false);
        return result;
    }
}

function getAllLines() {
    return [...textTable.querySelectorAll("tr")].map((row) => {
        const lineNum = row.querySelector(".line-number").textContent,
            line = row.querySelector(".line").textContent;
        return [lineNum, line.trim() ? line : "<br/>"];
    });
}

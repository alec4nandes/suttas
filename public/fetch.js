import { everySuttaId } from "./crawled.js";
import { displaySuttaHTML } from "./display.js";
import { notes } from "./notes.js";

async function getLines(suttaId) {
    try {
        const endpoint = `https://suttacentral.net/api/bilarasuttas/${suttaId}/sujato`,
            data = await (await fetch(endpoint)).json(),
            { translation_text } = data,
            lines = Object.entries(translation_text)
                .filter(([num, line]) => line.trim() && line !== "\n")
                .reduce((acc, [num, line]) => {
                    const [prefix] = num.split(":"),
                        // get section number from prefix
                        section = prefix.match(/([0-9]+\.?)+/).at(-1);
                    acc[section]
                        ? (acc[section][num] = line)
                        : (acc[section] = { [num]: line });
                    return acc;
                }, {});
        Object.entries(lines).forEach(
            ([key, value]) => (lines[key] = organizeLines(value))
        );
        return lines;
    } catch (err) {
        // this usually occurs because there is not
        // a translation by Bhikkhu Sujato
        console.warn(err);
        return null;
    }
}

// this function organizes all lines by line
// number, breaking apart the sections (i.e. 1.2.6)
// and nesting the objects:
// {1: {2: {6: {[lineNum]: line}}, ...other 1.2s}}
function organizeLines(value) {
    const result = {};
    Object.entries(value).forEach(([key, val]) => {
        const nums = key.split(":")[1].split(".");
        result[nums[0]] = result[nums[0]] || {};
        let holder = result[nums[0]],
            isLast = nums.length === 1;
        if (isLast) {
            holder[key] = val;
        } else {
            for (let i = 1; i < nums.length; i++) {
                holder[nums[i]] = holder[nums[i]] || {};
                holder = holder[nums[i]];
                isLast = i === nums.length - 1;
                if (isLast) {
                    holder[key] = val;
                }
            }
        }
    });
    return result;
}

async function getRandomSutta() {
    notes.length = 0;
    let lines, id;
    while (!lines) {
        id = getRandomId();
        lines = await getLines(id);
    }
    await displaySuttaHTML(id, lines);
}

function getRandomId() {
    return everySuttaId[~~(Math.random() * everySuttaId.length)];
}

export { getLines, getRandomSutta };

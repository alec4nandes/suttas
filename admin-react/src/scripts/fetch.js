import { db } from "./database.js";
import { doc, getDoc } from "firebase/firestore";

export default async function getSuttaData({
    suttaId,
    setNote,
    setLines,
    setAllNotes,
}) {
    window.scrollTo(0, 0);
    setNote();
    const existing = await getSuttaFromDb();
    if (existing) {
        setLines(existing.text);
        setAllNotes(existing.notes);
    } else {
        const sc = await getSuttaLinesFromSC();
        setLines(sc);
        setAllNotes([]);
    }

    return;

    async function getSuttaFromDb() {
        const docRef = doc(db, "suttas", suttaId);
        return (await getDoc(docRef)).data();
    }

    async function getSuttaLinesFromSC() {
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
        // discard the prefix top key, since we just want
        // the section and line numbers (prefix same for all)
        const result = Object.values(lines)[0];
        return result;
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
}

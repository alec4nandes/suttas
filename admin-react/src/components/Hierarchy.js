import { useEffect, useState } from "react";
import { crawled } from "../scripts/crawled.js";

export default function Hierarchy({ suttaId }) {
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        getLevels();

        async function getLevels() {
            const hier = getSuttaHierarchy(),
                result = await Promise.all(hier.map(getLevelData));
            setLevels(result);
        }

        function getSuttaHierarchy() {
            const hier = getSuttaHierarchyRecursive();
            // the first level is better explained by the second,
            // so remove it
            hier.shift();
            return hier;
        }

        function getSuttaHierarchyRecursive(obj = crawled, result = []) {
            for (const [key, value] of Object.entries(obj)) {
                if (key === suttaId) {
                    result.push(key);
                    break;
                } else if (value) {
                    result.push(key);
                    getSuttaHierarchyRecursive(value, result);
                    if (result.includes(suttaId)) {
                        break;
                    } else {
                        // remove key
                        result.pop();
                    }
                }
            }
            return result;
        }
    }, [suttaId]);

    async function getLevelData(level) {
        const endpoint = `https://suttacentral.net/api/menu/${level}`,
            data = await (await fetch(endpoint)).json();
        return data[0];
    }

    function LevelHTML({ data }) {
        const { translated_name, root_name, child_range, acronym, blurb } =
                data,
            acro = acronym || child_range,
            summary = (
                <>
                    {root_name}
                    {translated_name ? ": " : ""}
                    {translated_name || ""}
                    {acro && <small> ({acro})</small>}
                </>
            );
        return blurb ? (
            <details>
                <summary>{summary}</summary>
                <p>{blurb}</p>
            </details>
        ) : (
            <>{summary}</>
        );
    }

    return (
        <ul id="hierarchy">
            {levels.filter(Boolean).map((data) => (
                <li key={`level-${data.translated_name}`}>
                    <LevelHTML {...{ data }} />
                </li>
            ))}
        </ul>
    );
}

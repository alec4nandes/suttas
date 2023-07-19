import { crawled } from "./crawled.js";

async function getSuttaHierarchyHTML(suttaId) {
    const hier = getSuttaHierarchy(suttaId);
    return `
        <ul id="hierarchy">
            ${(await Promise.all(hier.map(getLevelData)))
                .filter(Boolean)
                .map((data) => `<li>${getLevelHTML(data)}</li>`)
                .join("")}
        </ul>
    `;
}

function getSuttaHierarchy(suttaId) {
    const hier = getSuttaHierarchyRecursive(suttaId);
    // the first level is better explained by the second,
    // so remove it
    hier.shift();
    return hier;
}

function getSuttaHierarchyRecursive(suttaId, obj = crawled, result = []) {
    for (const [key, value] of Object.entries(obj)) {
        if (key === suttaId) {
            result.push(key);
            break;
        } else if (value) {
            result.push(key);
            getSuttaHierarchyRecursive(suttaId, value, result);
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

async function getLevelData(level) {
    const endpoint = `https://suttacentral.net/api/menu/${level}`,
        data = await (await fetch(endpoint)).json();
    return data[0];
}

function getLevelHTML(data) {
    const { translated_name, root_name, child_range, acronym, blurb } = data,
        acro = acronym || child_range,
        summary = `
            ${root_name}${translated_name ? ":" : ""}
            ${translated_name || ""}
            ${acro ? `<small>(${acro})</small>` : ""}
        `;
    return blurb
        ? `
            <details>
                <summary>${summary}</summary>
                <p>${blurb}</p>
            </details>
        `
        : summary;
}

export { getSuttaHierarchyHTML };

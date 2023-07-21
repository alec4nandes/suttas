import { everySuttaId } from "../../scripts/crawled";

export default function NavigationButtons({
    suttaId,
    setSuttaId,
    setFormValues,
    isSujatoTranslation,
}) {
    async function handlePrevious() {
        navigationHelper(true);
    }

    async function handleNext() {
        navigationHelper(false);
    }

    async function navigationHelper(isPrevious) {
        const index = everySuttaId.indexOf(suttaId),
            neighbor = everySuttaId[index + (isPrevious ? -1 : 1)];
        if (neighbor) {
            setFormValues(neighbor);
            setSuttaId(neighbor);
        } else {
            alert(`No ${isPrevious ? "previous" : "next"} sutta!`);
        }
    }

    async function handleRandom() {
        const getRandomId = () =>
            everySuttaId[~~(Math.random() * everySuttaId.length)];
        let randomId = getRandomId();
        while (!(await isSujatoTranslation(randomId))) {
            randomId = getRandomId();
        }
        setFormValues(randomId);
        setSuttaId(randomId);
    }
    return (
        <>
            <button id="previous" onClick={handlePrevious}>
                previous
            </button>
            <button id="next" onClick={handleNext}>
                next
            </button>
            <button id="random" onClick={handleRandom}>
                get random
            </button>
        </>
    );
}

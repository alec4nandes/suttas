import { everySuttaId } from "../../scripts/crawled";

export default function NavigationButtons({
    suttaId,
    setSuttaId,
    setFormValues,
    isEnglishTranslation,
}) {
    async function handlePrevious() {
        navigationHelper(true);
    }

    async function handleNext() {
        navigationHelper(false);
    }

    async function navigationHelper(isPrevious) {
        let index = everySuttaId.indexOf(suttaId),
            getNeighbor = () => {
                index = index + (isPrevious ? -1 : 1);
                return everySuttaId[index];
            },
            neighbor = getNeighbor();
        while (neighbor && !(await isEnglishTranslation(neighbor))) {
            neighbor = getNeighbor();
        }
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
        while (!(await isEnglishTranslation(randomId))) {
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

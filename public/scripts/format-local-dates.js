document.querySelectorAll(".date").forEach((elem) => {
    const seconds = +elem.textContent,
        ms = seconds * 1000,
        date = new Date(ms),
        formatted = formatDate(date);
    elem.textContent = formatted;
});

function formatDate(date) {
    return date
        .toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
        .replace("AM", "am")
        .replace("PM", "pm");
}

const navElem = document.querySelector("nav"),
    navHeight = getComputedStyle(navElem).getPropertyValue("height"),
    toggleButton = navElem.querySelector("#toggle-sutta"),
    readSutta = toggleButton.textContent.trim();

toggleButton.onclick = (e) => {
    const { dataset } = e.target,
        { status } = dataset,
        isHidden = status === "hidden";
    document.querySelector("#sutta").style.top = isHidden
        ? 0
        : `calc(-100% + ${navHeight})`;
    dataset.status = isHidden ? "showing" : "hidden";
    const readBlog = "read blog post";
    e.target.textContent = e.target.textContent.replace(
        isHidden ? readSutta : readBlog,
        isHidden ? readBlog : readSutta
    );
};

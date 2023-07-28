document.querySelector("#toggle-sutta").onclick = (e) => {
    const { dataset } = e.target,
        { status } = dataset,
        isHidden = status === "hidden";
    document.querySelector("#sutta").style.top = isHidden
        ? 0
        : // match px with --nav-height var
          // in ../css/sutta.scss
          "calc(-100% + 85px)";
    dataset.status = isHidden ? "showing" : "hidden";
    const readSutta = "read",
        readBlog = "read blog post for";
    e.target.textContent = e.target.textContent.replace(
        isHidden ? readSutta : readBlog,
        isHidden ? readBlog : readSutta
    );
};

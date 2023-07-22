document.querySelector("#toggle-sutta").onclick = (e) => {
    const { dataset } = e.target,
        { status } = dataset,
        isHidden = status === "hidden";
    document.querySelector("#sutta").style.top = isHidden
        ? 0
        : // match px with --nav-height var
          // in ../css/sutta.scss
          "calc(-100% + 60px)";
    dataset.status = isHidden ? "showing" : "hidden";
    e.target.textContent = e.target.textContent.replace(
        isHidden ? "sutta" : "blog post for sutta",
        isHidden ? "blog post for sutta" : "sutta"
    );
};

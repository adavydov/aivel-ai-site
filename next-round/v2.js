(() => {
  const init = () => {
    const page = document.querySelector(".v2-page");
    if (!page || page.dataset.ready) return;
    page.dataset.ready = "true";
    const buttons = [...page.querySelectorAll("[data-lang]")];
    const setLanguage = (lang) => {
      page.dataset.language = lang;
      document.documentElement.lang = lang;
      page.querySelectorAll("[data-ru][data-en]").forEach((node) => { node.textContent = node.dataset[lang]; });
      buttons.forEach((button) => {
        const active = button.dataset.lang === lang;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };
    buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
    page.querySelectorAll("#lock-page-footer").forEach((button) => button.addEventListener("click", () => window.location.reload()));
    const links = [...page.querySelectorAll(".v2-nav a")];
    const sections = [...page.querySelectorAll(".v2-chapter[id]")];
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) links.forEach((link) => link.classList.toggle("is-active", link.hash === `#${visible.target.id}`));
      }, { rootMargin: "-25% 0px -55%", threshold: [0, .25, .5] });
      sections.forEach((section) => observer.observe(section));
    }
    setLanguage("ru");
  };
  window.addEventListener("aivel:unlocked", (event) => event.detail?.version === "v2" && init());
})();

const links = document.querySelectorAll("[data-page]");
const pages = document.getElementById("pages");
const nav = document.querySelector(".nav-container");
const menuToggle = document.querySelector(".menu-toggle");
const logo = document.querySelector(".logo");

function goToPage(index) {
    const pageIndex = Number(index);

    if (Number.isNaN(pageIndex)) {
        return;
    }

    pages.style.transform = `translateX(-${pageIndex * 100}%)`;

    document.querySelectorAll(".nav-container a").forEach(link => {
        link.classList.toggle("active", Number(link.dataset.page) === pageIndex);
    });

    document.querySelectorAll(".page").forEach((page, currentIndex) => {
        page.classList.toggle("active", currentIndex === pageIndex);
    });

    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
}

links.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        goToPage(link.dataset.page);
        history.replaceState(null, "", link.getAttribute("href"));
    });
});

logo?.addEventListener("click", event => {
    event.preventDefault();
    goToPage(0);
    history.replaceState(null, "", "#home");
});

menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

const pageByHash = {
    "#home": 0,
    "#about": 1,
    "#projects": 2,
    "#services": 3,
    "#contact": 4
};

window.addEventListener("load", () => {
    const initialPage = pageByHash[window.location.hash] ?? 0;
    goToPage(initialPage);
});

// Light/dark theme toggle with local persistence.
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleIcon = themeToggle?.querySelector("i");
const savedTheme = localStorage.getItem("portfolio-theme");
const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);
    document.body.classList.toggle("dark-theme", !isLight);

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(!isLight));
        themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }

    if (themeToggleIcon) {
        themeToggleIcon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
}

applyTheme(savedTheme ?? (prefersLight ? "light" : "dark"));

themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
});

// Prevents broken images on project cards when a GIF is missing.
document.querySelectorAll(".project-media img").forEach(image => {
    const markAsMissing = () => image.classList.add("is-missing");

    image.addEventListener("error", markAsMissing);

    if (image.complete && image.naturalWidth === 0) {
        markAsMissing();
    }
});

// Enlarged hover preview without being clipped by the internal scrolling container.
const projectCards = document.querySelectorAll(".project-card");
const canUseHoverPreview = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
let projectPreview = null;

function createProjectPreview() {
    const preview = document.createElement("div");
    preview.className = "project-hover-preview";
    preview.setAttribute("aria-hidden", "true");
    preview.innerHTML = `
        <div class="preview-media">
            <img src="" alt="">
        </div>
        <div class="preview-body">
            <h3></h3>
            <p></p>
        </div>
    `;
    document.body.appendChild(preview);
    return preview;
}

function positionProjectPreview(event) {
    if (!projectPreview) return;

    const margin = 18;
    const previewRect = projectPreview.getBoundingClientRect();
    let left = event.clientX + 24;
    let top = event.clientY - 40;

    if (left + previewRect.width + margin > window.innerWidth) {
        left = event.clientX - previewRect.width - 24;
    }

    if (top + previewRect.height + margin > window.innerHeight) {
        top = window.innerHeight - previewRect.height - margin;
    }

    if (top < margin) top = margin;
    if (left < margin) left = margin;

    projectPreview.style.left = `${left}px`;
    projectPreview.style.top = `${top}px`;
}

if (canUseHoverPreview) {
    projectPreview = createProjectPreview();
    const previewImage = projectPreview.querySelector("img");
    const previewTitle = projectPreview.querySelector("h3");
    const previewDescription = projectPreview.querySelector("p");

    previewImage.addEventListener("load", () => {
        previewImage.style.display = "block";
    });

    previewImage.addEventListener("error", () => {
        previewImage.style.display = "none";
    });

    projectCards.forEach(card => {
        card.addEventListener("mouseenter", event => {
            const cardImage = card.querySelector("img");

            const tags = [...card.querySelectorAll(".tag-list span")]
                .map(tag => tag.textContent.trim())
                .filter(Boolean)
                .join(" • ");

            previewTitle.textContent = card.querySelector("h3")?.textContent.trim() || "Project";
            previewDescription.textContent = tags;

            previewImage.style.display = "block";
            previewImage.src = cardImage?.getAttribute("src") || cardImage?.src || "";
            previewImage.alt = `Enlarged preview of ${previewTitle.textContent}`;

            positionProjectPreview(event);
            projectPreview.classList.add("show");
        });

        card.addEventListener("mousemove", positionProjectPreview);

        card.addEventListener("mouseleave", () => {
            projectPreview.classList.remove("show");
        });

        card.addEventListener("focus", event => {
            const rect = card.getBoundingClientRect();
            const fakeEvent = {
                clientX: rect.right,
                clientY: rect.top + rect.height / 2
            };

            const tags = [...card.querySelectorAll(".tag-list span")]
                .map(tag => tag.textContent.trim())
                .filter(Boolean)
                .join(" • ");

            previewTitle.textContent = card.querySelector("h3")?.textContent.trim() || "Project";
            previewDescription.textContent = tags;
            previewImage.style.display = "block";
            const cardImage = card.querySelector("img");
            previewImage.src = cardImage?.getAttribute("src") || cardImage?.src || "";
            previewImage.alt = `Enlarged preview of ${previewTitle.textContent}`;
            positionProjectPreview(fakeEvent);
            projectPreview.classList.add("show");
        });

        card.addEventListener("blur", () => {
            projectPreview.classList.remove("show");
        });
    });
}


document.querySelector(".project-grid")?.addEventListener("scroll", () => {
    projectPreview?.classList.remove("show");
});

window.addEventListener("resize", () => {
    projectPreview?.classList.remove("show");
});

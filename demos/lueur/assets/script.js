// demos/lueur/assets/script.js

/* ===================================================
   ✦ Lueur — remplit la page à partir de config.js
   Tu n'as pas besoin de modifier ce fichier.
   =================================================== */

(function () {
    const C = window.CONFIG || {};
    const $ = (id) => document.getElementById(id);
    const moinsDAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Thème : celui de config.js, ou ?theme=… dans l'adresse (pratique pour essayer)
    const themeAdresse = new URLSearchParams(location.search).get("theme");
    document.documentElement.dataset.theme = themeAdresse || C.theme || "rose";

    /* ---------- Profil ---------- */
    if (C.nom) {
        $("nom").textContent = C.nom;
        document.title = `${C.nom} · liens`;
    }
    $("bio").textContent = C.bio || "";
    if (C.photo) {
        $("photo").src = C.photo;
        document.querySelector('link[rel="icon"]').href = C.photo;
    }
    $("photo").alt = C.nom ? `Photo de ${C.nom}` : "";

    /* ---------- Liens ---------- */
    const zoneLiens = $("liens");
    (C.liens || []).forEach((item, i) => {
        let el;
        if (item.section) {
            el = document.createElement("p");
            el.className = "section-titre";
            el.textContent = item.section;
        } else {
            el = document.createElement("a");
            el.className = "lien" + (item.vedette ? " vedette" : "");
            el.href = item.lien || "#";
            el.target = "_blank";
            el.rel = "noopener";

            const icone = document.createElement("span");
            icone.className = "lien-icone";
            icone.textContent = item.icone || "✦";

            const titre = document.createElement("span");
            titre.className = "lien-titre";
            titre.textContent = item.titre || "";

            el.append(icone, titre);
        }
        el.style.animationDelay = 0.3 + i * 0.07 + "s";
        zoneLiens.appendChild(el);
    });

    /* ---------- Réseaux ---------- */
    (C.reseaux || []).forEach((r) => {
        const a = document.createElement("a");
        a.className = "reseau";
        a.href = r.lien || "#";
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = `${r.icone || ""} ${r.nom || ""}`.trim();
        $("reseaux").appendChild(a);
    });

    /* ---------- Bulle de confirmation ---------- */
    let minuteur;
    function bulle(texte) {
        $("bulle").textContent = texte;
        $("bulle").classList.add("visible");
        clearTimeout(minuteur);
        minuteur = setTimeout(() => $("bulle").classList.remove("visible"), 1800);
    }

    async function copier(texte) {
        try {
            await navigator.clipboard.writeText(texte);
        } catch {
            const zone = document.createElement("textarea");
            zone.value = texte;
            document.body.appendChild(zone);
            zone.select();
            document.execCommand("copy");
            zone.remove();
        }
    }

    /* ---------- E-mail ---------- */
    if (C.email) {
        $("email").hidden = false;
        $("email-texte").textContent = `✉️ ${C.email}`;
        $("copier-email").addEventListener("click", async () => {
            await copier(C.email);
            bulle("E-mail copié ✦");
        });
    }

    /* ---------- Partager ---------- */
    $("partager").addEventListener("click", async () => {
        if (navigator.share) {
            try { await navigator.share({ title: document.title, url: location.href }); } catch { /* annulé */ }
        } else {
            await copier(location.href);
            bulle("Lien de la page copié ✦");
        }
    });

    $("pied").textContent = C.piedDePage || "";

    /* ---------- Ciel étoilé ---------- */
    const ciel = document.querySelector(".ciel");
    const hasard = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < 90; i++) {
        const e = document.createElement("span");
        e.className = "etoile";
        const taille = hasard(1, 2.8);
        e.style.cssText = `width:${taille}px;height:${taille}px;top:${hasard(0, 80)}%;left:${hasard(0, 100)}%;--duree:${hasard(2, 5)}s;--delai:${hasard(0, 5)}s`;
        ciel.appendChild(e);
    }

    function etoileFilante() {
        const f = document.createElement("span");
        f.className = "filante";
        f.style.top = hasard(5, 35) + "%";
        f.style.left = hasard(40, 100) + "%";
        ciel.appendChild(f);
        f.addEventListener("animationend", () => f.remove());
        setTimeout(etoileFilante, hasard(4000, 9000));
    }
    if (!moinsDAnimations) setTimeout(etoileFilante, 2000);
})();
// assets/js/main.js

/* ===================================================
   SukiDev — script commun à toutes les pages
   ---------------------------------------------------
    1. Ciel étoilé et étoiles filantes
    2. Menu burger (téléphone)
    3. Mot qui change (accueil)
    4. Boutique par catégories (accueil)
    5. Onglets « Sur mesure » (accueil)
    6. Apparitions au défilement
    7. Menu : section en cours
    8. Boutons « Copier »
    9. Galerie + visionneuse (pages produits)
   10. Bouton « remonter »
   11. Compteur de vues
   =================================================== */

const moinsDAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// "" sur l'accueil, "../" dans le dossier produits/ (voir data-racine sur <body>)
const RACINE = document.body.dataset.racine || "";

const aleatoire = (min, max) => Math.random() * (max - min) + min;


/* ========== 1. CIEL ÉTOILÉ ========== */

const ciel = document.querySelector(".ciel");

if (ciel) {
    for (let i = 0; i < 120; i++) {
        const etoile = document.createElement("span");
        etoile.className = "etoile";
        const taille = aleatoire(1, 3);
        etoile.style.width = etoile.style.height = `${taille}px`;
        etoile.style.top = `${aleatoire(0, 85)}%`;
        etoile.style.left = `${aleatoire(0, 100)}%`;
        etoile.style.setProperty("--duree", `${aleatoire(2, 5)}s`);
        etoile.style.setProperty("--delai", `${aleatoire(0, 5)}s`);
        ciel.appendChild(etoile);
    }

    const lancerEtoileFilante = () => {
        const filante = document.createElement("span");
        filante.className = "etoile-filante";
        filante.style.top = `${aleatoire(5, 40)}%`;
        filante.style.left = `${aleatoire(40, 100)}%`;
        ciel.appendChild(filante);
        filante.addEventListener("animationend", () => filante.remove());
        setTimeout(lancerEtoileFilante, aleatoire(4000, 9000));
    };

    if (!moinsDAnimations) setTimeout(lancerEtoileFilante, 2500);
}


/* ========== 2. MENU BURGER ========== */

const nav = document.querySelector(".nav");
const burger = document.querySelector(".burger");

if (nav && burger) {
    burger.addEventListener("click", () => {
        const ouvert = nav.classList.toggle("ouvert");
        burger.setAttribute("aria-expanded", ouvert);
    });

    // Un clic sur un lien referme le menu
    nav.querySelectorAll(".nav-liens a").forEach((lien) =>
        lien.addEventListener("click", () => {
            nav.classList.remove("ouvert");
            burger.setAttribute("aria-expanded", false);
        })
    );
}


/* ========== 3. MOT QUI CHANGE ========== */

const motChange = document.getElementById("mot-change");

if (motChange && !moinsDAnimations) {
    const mots = ["bots Discord", "overlays de stream", "sites web", "dashboards domotiques", "applis web"];
    let indexMot = 0;

    setInterval(() => {
        motChange.classList.add("part");
        setTimeout(() => {
            indexMot = (indexMot + 1) % mots.length;
            motChange.textContent = mots[indexMot];
            motChange.classList.remove("part");
            motChange.classList.add("arrive");
            void motChange.offsetWidth;   // force la position de départ
            motChange.classList.remove("arrive");
        }, 450);
    }, 2650);
}


/* ========== 4. BOUTIQUE PAR CATÉGORIES ========== */

const zoneFiltres = document.getElementById("filtres-boutique");
const grilleProduits = document.getElementById("grille-produits");

// Crée un élément avec du texte (sans risque d'injecter du HTML)
function creer(balise, classe, texte) {
    const el = document.createElement(balise);
    if (classe) el.className = classe;
    if (texte !== undefined) el.textContent = texte;
    return el;
}

function carteProduit(produit) {
    const categorie = (window.CATEGORIES || []).find((c) => c.id === produit.categorie);

    const carte = creer("a", "carte carte-produit");
    carte.href = RACINE + produit.page;

    const image = creer("div", "produit-image");
    const img = document.createElement("img");
    img.src = RACINE + produit.image;
    img.alt = produit.nom;
    img.loading = "lazy";
    image.appendChild(img);
    if (produit.badge) image.appendChild(creer("span", "produit-badge", produit.badge));

    const corps = creer("div", "produit-corps");
    if (categorie) corps.appendChild(creer("span", "produit-categorie", `${categorie.emoji} ${categorie.nom}`));
    corps.appendChild(creer("h3", "", produit.nom));
    corps.appendChild(creer("p", "", produit.accroche));

    const pied = creer("div", "produit-pied");
    pied.appendChild(creer("span", "produit-prix degrade", produit.prix));
    pied.appendChild(creer("span", "produit-lien", "Voir →"));
    corps.appendChild(pied);

    carte.append(image, corps);
    return carte;
}

function carteVide(categorie) {
    const carte = creer("div", "carte carte-bientot boutique-vide");
    carte.appendChild(creer("div", "cadeau", "🎁"));
    carte.appendChild(creer("h3", "", `${categorie.emoji} ${categorie.nom} : bientôt !`));
    carte.appendChild(creer("p", "", "Des créations sont en préparation dans cette catégorie. Reviens vite ✦"));
    return carte;
}

function afficherBoutique(choix) {
    const produits = (window.PRODUITS || []).filter((p) => choix === "tout" || p.categorie === choix);
    grilleProduits.replaceChildren();

    if (produits.length) produits.forEach((p) => grilleProduits.appendChild(carteProduit(p)));
    else grilleProduits.appendChild(carteVide(window.CATEGORIES.find((c) => c.id === choix)));

    grilleProduits.classList.remove("entree");
    void grilleProduits.offsetWidth;
    grilleProduits.classList.add("entree");
}

if (zoneFiltres && grilleProduits) {
    const produits = window.PRODUITS || [];
    const filtres = [{ id: "tout", nom: "Tout", emoji: "✦" }, ...(window.CATEGORIES || [])];

    filtres.forEach((filtre, i) => {
        const nombre = filtre.id === "tout" ? produits.length : produits.filter((p) => p.categorie === filtre.id).length;
        const bouton = creer("button", "filtre" + (i === 0 ? " actif" : ""));
        bouton.type = "button";
        bouton.append(`${filtre.emoji} ${filtre.nom} `, creer("span", "compte", nombre ? String(nombre) : "bientôt"));

        bouton.addEventListener("click", () => {
            zoneFiltres.querySelectorAll(".filtre").forEach((b) => b.classList.toggle("actif", b === bouton));
            afficherBoutique(filtre.id);
        });

        zoneFiltres.appendChild(bouton);
    });

    afficherBoutique("tout");
}


/* ========== 5. ONGLETS « SUR MESURE » ========== */

const onglets = document.querySelectorAll(".onglet");
const panneaux = document.querySelectorAll(".panneau");

onglets.forEach((onglet) => {
    onglet.addEventListener("click", () => {
        onglets.forEach((o) => {
            o.classList.toggle("actif", o === onglet);
            o.setAttribute("aria-selected", o === onglet);
        });

        panneaux.forEach((panneau) => {
            const correspond = panneau.dataset.panneau === onglet.dataset.onglet;
            panneau.hidden = !correspond;
            if (correspond) {
                panneau.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
                panneau.classList.remove("entree");
                void panneau.offsetWidth;
                panneau.classList.add("entree");
            }
        });
    });
});


/* ========== 6. APPARITIONS AU DÉFILEMENT ========== */

// Les cartes d'une même grille arrivent en cascade
document.querySelectorAll(".grille, .grille-prix, .grille-tarifs, .galerie").forEach((grille) => {
    [...grille.children].forEach((el, i) => el.style.setProperty("--delai-reveal", `${(i % 3) * 0.12}s`));
});

const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        entree.target.classList.add("visible");
        observateur.unobserve(entree.target);
        // Une fois apparu, le survol doit réagir tout de suite
        setTimeout(() => entree.target.style.setProperty("--delai-reveal", "0s"), 1200);
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observateur.observe(el));


/* ========== 7. MENU : SECTION EN COURS ========== */

const liensAncres = document.querySelectorAll('.nav-liens a[href^="#"]');

if (liensAncres.length) {
    const observateurMenu = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (!entree.isIntersecting) return;
            liensAncres.forEach((lien) => lien.classList.toggle("actif", lien.getAttribute("href") === `#${entree.target.id}`));
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    document.querySelectorAll("main section[id]").forEach((s) => observateurMenu.observe(s));
}


/* ========== 8. BOUTONS « COPIER » ========== */

const annonceCopie = document.getElementById("annonce-copie");

async function copierTexte(texte) {
    try {
        await navigator.clipboard.writeText(texte);
    } catch {
        const zone = document.createElement("textarea");
        zone.value = texte;
        zone.style.position = "fixed";
        zone.style.opacity = "0";
        document.body.appendChild(zone);
        zone.select();
        document.execCommand("copy");
        zone.remove();
    }
}

document.querySelectorAll(".bouton-copier").forEach((bouton) => {
    bouton.addEventListener("click", async () => {
        await copierTexte(bouton.dataset.copier);
        bouton.classList.add("copie");
        clearTimeout(bouton.minuteur);
        bouton.minuteur = setTimeout(() => bouton.classList.remove("copie"), 1600);
        if (annonceCopie) annonceCopie.textContent = `${bouton.dataset.copier} copié`;
    });
});


/* ========== 9. GALERIE + VISIONNEUSE ========== */

const galerie = document.querySelector(".galerie");

if (galerie) {
    const images = [...galerie.querySelectorAll("img")];

    const visionneuse = creer("div", "visionneuse");
    visionneuse.setAttribute("role", "dialog");
    visionneuse.setAttribute("aria-label", "Image agrandie");
    const grande = document.createElement("img");
    const fermer = creer("button", "fermer", "✕");
    const precedent = creer("button", "precedent", "‹");
    const suivant = creer("button", "suivant", "›");
    fermer.setAttribute("aria-label", "Fermer");
    precedent.setAttribute("aria-label", "Image précédente");
    suivant.setAttribute("aria-label", "Image suivante");
    visionneuse.append(grande, fermer, precedent, suivant);
    document.body.appendChild(visionneuse);

    let index = 0;
    const montrer = (i) => {
        index = (i + images.length) % images.length;
        grande.src = images[index].src;
        grande.alt = images[index].alt;
    };
    const ouvrir = (i) => { montrer(i); visionneuse.classList.add("ouverte"); fermer.focus(); };
    const refermer = () => visionneuse.classList.remove("ouverte");

    images.forEach((img, i) => img.closest("button").addEventListener("click", () => ouvrir(i)));
    fermer.addEventListener("click", refermer);
    precedent.addEventListener("click", () => montrer(index - 1));
    suivant.addEventListener("click", () => montrer(index + 1));
    visionneuse.addEventListener("click", (e) => { if (e.target === visionneuse) refermer(); });

    document.addEventListener("keydown", (e) => {
        if (!visionneuse.classList.contains("ouverte")) return;
        if (e.key === "Escape") refermer();
        if (e.key === "ArrowLeft") montrer(index - 1);
        if (e.key === "ArrowRight") montrer(index + 1);
    });
}


/* ========== 10. BOUTON « REMONTER » ========== */

const boutonRemonter = document.querySelector(".remonter");

if (boutonRemonter) {
    const verifier = () => boutonRemonter.classList.toggle("visible", window.scrollY > 500);
    window.addEventListener("scroll", verifier, { passive: true });
    verifier();
}


/* ========== 11. COMPTEUR DE VUES ==========
   Service gratuit Abacus. Une vue par visite.
   Tes propres visites ne comptent pas : ouvre une fois
   le site avec ?moi à la fin de l'adresse. */

const COMPTEUR_URL = "https://abacus.jasoncameron.dev";
const COMPTEUR_NOM = "sukidev1.github.io/visites";
const zoneVues = document.getElementById("nombre-vues");

const lireStockage = (stockage, cle) => { try { return stockage.getItem(cle); } catch { return null; } };
const ecrireStockage = (stockage, cle, valeur) => { try { stockage.setItem(cle, valeur); } catch { /* bloqué */ } };

function animerNombre(element, total) {
    const format = new Intl.NumberFormat("fr-FR");
    if (moinsDAnimations) { element.textContent = format.format(total); return; }

    const debut = performance.now();
    const etape = (maintenant) => {
        const k = Math.min((maintenant - debut) / 1400, 1);
        element.textContent = format.format(Math.round(total * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(etape);
    };
    requestAnimationFrame(etape);
}

async function chargerCompteur() {
    if (!zoneVues) return;

    if (new URLSearchParams(location.search).has("moi")) ecrireStockage(localStorage, "sukidev-moi", "1");

    const estMoi = lireStockage(localStorage, "sukidev-moi") === "1";
    const dejaCompte = lireStockage(sessionStorage, "sukidev-vue-comptee") === "1";
    const action = estMoi || dejaCompte ? "get" : "hit";

    try {
        const reponse = await fetch(`${COMPTEUR_URL}/${action}/${COMPTEUR_NOM}`);
        if (reponse.status === 404) { zoneVues.textContent = "0"; return; }
        if (!reponse.ok) throw new Error(`Réponse ${reponse.status}`);

        const { value } = await reponse.json();
        if (action === "hit") ecrireStockage(sessionStorage, "sukidev-vue-comptee", "1");

        const obs = new IntersectionObserver((entrees) => {
            if (entrees[0].isIntersecting) { animerNombre(zoneVues, value); obs.disconnect(); }
        });
        obs.observe(zoneVues);
    } catch (erreur) {
        console.warn("Compteur de vues indisponible :", erreur.message);
    }
}

chargerCompteur();
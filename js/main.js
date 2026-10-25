// sukidev/js/main.js

// Respecte le réglage "réduire les animations" de l'ordinateur
const moinsDAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ===================================================
   1. CIEL ÉTOILÉ
   Crée des étoiles à des positions, tailles et
   rythmes de scintillement différents.
   =================================================== */

const ciel = document.querySelector(".ciel");
const NOMBRE_ETOILES = 120;

function aleatoire(min, max) {
    return Math.random() * (max - min) + min;
}

for (let i = 0; i < NOMBRE_ETOILES; i++) {
    const etoile = document.createElement("span");
    etoile.classList.add("etoile");

    const taille = aleatoire(1, 3);
    etoile.style.width = `${taille}px`;
    etoile.style.height = `${taille}px`;
    etoile.style.top = `${aleatoire(0, 85)}%`;   // pas trop bas, l'horizon reste rose
    etoile.style.left = `${aleatoire(0, 100)}%`;
    etoile.style.setProperty("--duree", `${aleatoire(2, 5)}s`);
    etoile.style.setProperty("--delai", `${aleatoire(0, 5)}s`);

    ciel.appendChild(etoile);
}


/* ===================================================
   2. ÉTOILES FILANTES
   Une étoile filante passe de temps en temps.
   =================================================== */

function lancerEtoileFilante() {
    const filante = document.createElement("span");
    filante.classList.add("etoile-filante");
    filante.style.top = `${aleatoire(5, 40)}%`;
    filante.style.left = `${aleatoire(40, 100)}%`;

    ciel.appendChild(filante);

    // On la supprime une fois son animation terminée
    filante.addEventListener("animationend", () => filante.remove());

    // Prochaine étoile filante dans 4 à 9 secondes
    setTimeout(lancerEtoileFilante, aleatoire(4000, 9000));
}

if (!moinsDAnimations) {
    setTimeout(lancerEtoileFilante, 2500);
}


/* ===================================================
   3. MOT QUI CHANGE
   "Je crée des ___" : le mot glisse vers le haut
   et le suivant arrive par en dessous.
   =================================================== */

const mots = ["bots Discord", "applis web", "sites web", "dashboards domotiques"];
const DUREE_AFFICHAGE = 2200;   // temps pendant lequel un mot reste affiché
const DUREE_TRANSITION = 450;   // doit correspondre à la transition dans style.css

const motChange = document.getElementById("mot-change");
let indexMot = 0;

function changerMot() {
    // 1. Le mot actuel part vers le haut
    motChange.classList.add("part");

    setTimeout(() => {
        // 2. On change le texte et on place le nouveau mot en bas, invisible
        indexMot = (indexMot + 1) % mots.length;
        motChange.textContent = mots[indexMot];
        motChange.classList.remove("part");
        motChange.classList.add("arrive");

        // 3. On force le navigateur à prendre en compte la position de départ…
        void motChange.offsetWidth;

        // 4. …puis le mot remonte à sa place
        motChange.classList.remove("arrive");
    }, DUREE_TRANSITION);
}

if (motChange && !moinsDAnimations) {
    setInterval(changerMot, DUREE_AFFICHAGE + DUREE_TRANSITION);
}


/* ===================================================
   4. APPARITIONS AU DÉFILEMENT
   Les éléments "reveal" apparaissent en douceur.
   Les cartes arrivent en cascade, l'une après l'autre.
   =================================================== */

// Petit décalage entre chaque carte pour l'effet cascade
document.querySelectorAll(".grille-cartes, .grille-prix").forEach((grille) => {
    grille.querySelectorAll(".carte").forEach((carte, index) => {
        carte.style.setProperty("--delai-reveal", `${(index % 3) * 0.12}s`);
    });
});

const observateur = new IntersectionObserver(
    (entrees) => {
        entrees.forEach((entree) => {
            if (!entree.isIntersecting) return;

            const element = entree.target;
            element.classList.add("visible");
            observateur.unobserve(element);

            // Une fois apparu, on retire le décalage
            // pour que le survol réagisse tout de suite
            setTimeout(() => element.style.setProperty("--delai-reveal", "0s"), 1200);
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observateur.observe(element));


/* ===================================================
   5. ONGLETS DES SERVICES
   Un clic sur un onglet affiche les offres
   de la catégorie choisie.
   =================================================== */

const onglets = document.querySelectorAll(".onglet");
const panneaux = document.querySelectorAll(".panneau");

onglets.forEach((onglet) => {
    onglet.addEventListener("click", () => {
        const choix = onglet.dataset.onglet;

        // L'onglet cliqué devient actif
        onglets.forEach((o) => {
            o.classList.toggle("actif", o === onglet);
            o.setAttribute("aria-selected", o === onglet);
        });

        // On n'affiche que le panneau correspondant
        panneaux.forEach((panneau) => {
            const correspond = panneau.dataset.panneau === choix;
            panneau.hidden = !correspond;

            if (correspond) {
                // Les cartes apparaissent tout de suite (pas besoin d'attendre le défilement)
                panneau.querySelectorAll(".reveal").forEach((carte) => carte.classList.add("visible"));

                // On relance la petite animation d'entrée
                panneau.classList.remove("entree");
                void panneau.offsetWidth;
                panneau.classList.add("entree");
            }
        });
    });
});


/* ===================================================
   6. BOUTONS "COPIER" (section Contact)
   Copie l'email ou le pseudo Discord et affiche
   une petite bulle "Copié ! ✦".
   =================================================== */

const annonceCopie = document.getElementById("annonce-copie");

async function copierTexte(texte) {
    try {
        await navigator.clipboard.writeText(texte);
    } catch {
        // Solution de secours pour les navigateurs qui bloquent le presse-papiers
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

        // Affiche la bulle, puis la cache après un moment
        bouton.classList.add("copie");
        clearTimeout(bouton.minuteur);
        bouton.minuteur = setTimeout(() => bouton.classList.remove("copie"), 1600);

        if (annonceCopie) annonceCopie.textContent = `${bouton.dataset.copier} copié`;
    });
});


/* ===================================================
   7. MENU : SECTION EN COURS EN SURBRILLANCE
   Le lien du menu correspondant à la section
   affichée à l'écran s'illumine.
   =================================================== */

const liensMenu = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

const observateurMenu = new IntersectionObserver(
    (entrees) => {
        entrees.forEach((entree) => {
            if (!entree.isIntersecting) return;

            const id = entree.target.id;
            liensMenu.forEach((lien) => {
                lien.classList.toggle("actif", lien.getAttribute("href") === `#${id}`);
            });
        });
    },
    // On regarde une fine bande au milieu de l'écran
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observateurMenu.observe(section));


/* ===================================================
   8. BOUTON "REMONTER EN HAUT"
   Il apparaît dès qu'on a un peu descendu.
   =================================================== */

const boutonRemonter = document.querySelector(".remonter");

function verifierRemonter() {
    boutonRemonter.classList.toggle("visible", window.scrollY > 500);
}

if (boutonRemonter) {
    window.addEventListener("scroll", verifierRemonter, { passive: true });
    verifierRemonter();
}


/* ===================================================
   9. COMPTEUR DE VUES
   Utilise le service gratuit Abacus.
   - Une seule vue comptée par visite (pas à chaque
     actualisation de la page).
   - Tes propres visites ne comptent pas : ouvre une
     fois le site avec ?moi à la fin de l'adresse.
   =================================================== */

const COMPTEUR_URL = "https://abacus.jasoncameron.dev";
const COMPTEUR_NOM = "sukidev1.github.io/visites";   // espace/clé du compteur

const zoneVues = document.getElementById("nombre-vues");

// Petites fonctions "sûres" : le stockage du navigateur peut être bloqué
function lireStockage(stockage, cle) {
    try { return stockage.getItem(cle); } catch { return null; }
}

function ecrireStockage(stockage, cle, valeur) {
    try { stockage.setItem(cle, valeur); } catch { /* rien */ }
}

// Le nombre défile de 0 jusqu'au total
function animerNombre(element, total) {
    const formateur = new Intl.NumberFormat("fr-FR");

    if (moinsDAnimations) {
        element.textContent = formateur.format(total);
        return;
    }

    const duree = 1400;
    const debut = performance.now();

    function etape(maintenant) {
        const progression = Math.min((maintenant - debut) / duree, 1);
        const adouci = 1 - Math.pow(1 - progression, 3);   // ralentit à la fin
        element.textContent = formateur.format(Math.round(total * adouci));

        if (progression < 1) requestAnimationFrame(etape);
    }

    requestAnimationFrame(etape);
}

async function chargerCompteur() {
    if (!zoneVues) return;

    // ?moi dans l'adresse → ce navigateur ne sera plus compté
    if (new URLSearchParams(window.location.search).has("moi")) {
        ecrireStockage(localStorage, "sukidev-moi", "1");
    }

    const estMoi = lireStockage(localStorage, "sukidev-moi") === "1";
    const dejaCompte = lireStockage(sessionStorage, "sukidev-vue-comptee") === "1";

    // On ajoute une vue seulement pour un vrai visiteur, une fois par visite
    const action = estMoi || dejaCompte ? "get" : "hit";

    try {
        const reponse = await fetch(`${COMPTEUR_URL}/${action}/${COMPTEUR_NOM}`);

        // Compteur pas encore créé (personne ne l'a jamais augmenté)
        if (reponse.status === 404) {
            zoneVues.textContent = "0";
            return;
        }

        if (!reponse.ok) throw new Error(`Réponse ${reponse.status}`);

        const { value } = await reponse.json();

        if (action === "hit") ecrireStockage(sessionStorage, "sukidev-vue-comptee", "1");

        // On lance l'animation quand le pied de page devient visible
        const observateurVues = new IntersectionObserver((entrees) => {
            if (entrees[0].isIntersecting) {
                animerNombre(zoneVues, value);
                observateurVues.disconnect();
            }
        });

        observateurVues.observe(zoneVues);
    } catch (erreur) {
        // Le service ne répond pas : on laisse l'étoile, sans casser la page
        console.warn("Compteur de vues indisponible :", erreur.message);
    }
}

chargerCompteur();
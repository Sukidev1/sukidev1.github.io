// demos/lueur/config.js

/* ===================================================
   ✦ Lueur — tes réglages
   Modifie uniquement les textes entre guillemets,
   enregistre (Ctrl + S), puis actualise la page.
   =================================================== */

window.CONFIG = {

    // Ton nom ou pseudo
    nom: "Luna",

    // Une petite phrase sous ton nom
    bio: "Streameuse cozy 🌙 · dessins & jeux vidéo · nouveaux lives chaque semaine ✦",

    // Ta photo : mets ton image dans le dossier "images" et écris son nom ici
    photo: "images/avatar.svg",

    // Couleurs : "rose", "lavande", "bleu-nuit" ou "clair"
    theme: "rose",

    // Tes liens (du haut vers le bas)
    //   titre   : le texte du bouton
    //   lien    : l'adresse complète (https://…)
    //   icone   : un emoji
    //   vedette : true pour le mettre en avant (il brille)
    // Pour ajouter une section, écris : { section: "Mon titre" },
    liens: [
        { titre: "Mon dernier live", lien: "https://twitch.tv/", icone: "🎮", vedette: true },
        { titre: "Ma chaîne YouTube", lien: "https://youtube.com/", icone: "▶️" },
        { titre: "Rejoins mon Discord", lien: "https://discord.gg/", icone: "💬" },

        { section: "Mes créations" },
        { titre: "Ma boutique", lien: "https://example.com/", icone: "🛍️" },
        { titre: "Mes dessins", lien: "https://example.com/", icone: "🎨" },
    ],

    // Tes réseaux (petites pastilles en bas). Supprime une ligne pour la retirer.
    reseaux: [
        { nom: "TikTok", lien: "https://tiktok.com/@", icone: "🎵" },
        { nom: "Instagram", lien: "https://instagram.com/", icone: "📸" },
        { nom: "Twitch", lien: "https://twitch.tv/", icone: "🎮" },
    ],

    // Ton e-mail (un bouton « Copier » s'affiche). Laisse "" pour le cacher.
    email: "contact@exemple.com",

    // Le petit texte tout en bas de la page
    piedDePage: "© 2026 Luna · fait avec ✦",
};
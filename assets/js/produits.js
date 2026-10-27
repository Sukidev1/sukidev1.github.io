// assets/js/produits.js

/* ===================================================
   ✦ LA LISTE DE TES PRODUITS ✦
   La boutique de l'accueil se remplit toute seule
   à partir de cette liste.

   Pour ajouter un produit :
     1. copie un bloc { … }, colle-le à la suite
        (n'oublie pas la virgule entre deux blocs) ;
     2. change les textes ;
     3. crée sa page dans le dossier produits/
        (copie une page existante et modifie-la).

   "categorie" doit être l'un des "id" de CATEGORIES.
   Les chemins sont écrits depuis la racine du site.
   =================================================== */

window.CATEGORIES = [
    { id: "discord",   nom: "Bots Discord", emoji: "🤖" },
    { id: "stream",    nom: "Stream",       emoji: "🎥" },
    { id: "sites",     nom: "Sites web",    emoji: "🌙" },
    { id: "domotique", nom: "Domotique",    emoji: "☀️" },
    { id: "ebooks",    nom: "Ebooks",       emoji: "📚" },
];

window.PRODUITS = [
    {
        nom: "SukiTickets",
        categorie: "discord",
        accroche: "Le système de tickets élégant pour ton serveur Discord : configuration en un clic, transcriptions, logs, en français et en anglais.",
        prix: "Gratuit · Premium 5,99 €",
        badge: "Populaire",
        image: "assets/images/produits/sukitickets/couverture.webp",
        page: "produits/sukitickets.html",
    },
    {
        nom: "Nuit étoilée",
        categorie: "stream",
        accroche: "Un pack d'overlays animés pour ton live : 4 écrans, 3 cadres, une barre d'infos et 4 alertes, en 3 couleurs.",
        prix: "4,99 €",
        badge: "Nouveau",
        image: "assets/images/produits/nuit-etoilee/couverture.webp",
        page: "produits/nuit-etoilee.html",
    },
    {
        nom: "Lueur",
        categorie: "sites",
        accroche: "Une jolie page « lien en bio » animée pour réunir tous tes liens, en 4 couleurs, personnalisable sans coder et en ligne gratuitement.",
        prix: "2,99 €",
        badge: "Nouveau",
        image: "assets/images/produits/lueur/couverture.webp",
        page: "produits/lueur.html",
    },
];
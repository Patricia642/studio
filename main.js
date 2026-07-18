const appli = Vue.createApp({
  // crée une app Vue
  data() {
    // Déclare les données de l'app
    return {
      message: "Chargement...", // texte initial
      projects: [], // liste vide pour projets
    };
  },
  mounted() {
    // Code quand DOM est prêt
    console.log("L'app Vue a été créée et montée au DOM (mounted) !"); // log info
    this.message = "Vue a été chargée et montée au DOM !"; // change message

    fetch("./projects.json") // Charge les données de projects.json
      .then((response) => response.json()) // met la réponse en JSON
      .then((data) => {
        this.projects = data; // stocke les projets dans la donnée Vue
        this.$nextTick(() => {
          // attend que Vue mette à jour le DOM
          this.initSwipers(); // Initialise les Swiper
          this.initAnimations(); // Initialise les animations GSAP
        });
      })
      .catch((error) => {
        console.error("Erreur lors du fetch :", error); // affiche une erreur si fetch n'a pas marché
      });
  },
  methods: {
    // Initialise tous les carousels Swiper
    initSwipers() {
      document.querySelectorAll(".swiper").forEach((el) => {
        // sélectionne tous les carrousels
        new Swiper(el, {
          // crée un nouveau carrousel Swiper
          loop: true, // active boucle infinie
          pagination: {
            el: el.querySelector(".swiper-pagination"), // pagination
            clickable: true, // pagination cliquable
          },
          navigation: {
            nextEl: el.querySelector(".swiper-button-next"), // flèche suivante
            prevEl: el.querySelector(".swiper-button-prev"), // flèche précédente
          },
        });
      });
    },

    // Initialise les animations GSAP pour les lignes
    initAnimations() {
      gsap.registerPlugin(ScrollTrigger); // active le plugin ScrollTrigger

      // Nettoie les ScrollTrigger existants pour éviter doublons
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      document.querySelectorAll(".ligne").forEach((el) => {
        // sélectionne chaque ligne décorative
        gsap.from(el, {
          // anime chaque ligne
          scrollTrigger: {
            trigger: el, // élément déclencheur
            start: "top 90%", // début quand il entre dans la zone de vue
            end: "top 50%", // fin quand il atteint le milieu
            scrub: 0.5, // synchronise avec le scroll
            markers: false, // pas d’indicateurs visibles
          },
          scaleX: 0, // commence à taille horizontale 0
          transformOrigin: "left", // origine de l’animation à gauche
          ease: "power2.out", // courbe d’accélération fluide
        });
      });
    },

    // Ouvre une image en plein écran
    openFullscreen(imgUrl) {
      const img = new Image(); // crée un nouvel élément image
      img.src = imgUrl; // définit la source
      img.style.position = "fixed"; // positionne en plein écran
      img.style.top = 0;
      img.style.left = 0;
      img.style.width = "100vw"; // largeur = écran entier
      img.style.height = "100vh"; // hauteur = écran entier
      img.style.objectFit = "contain"; // garde le ratio d’image
      img.style.backgroundColor = "rgba(0, 0, 0, 0.9)"; // fond noir semi-transparent
      img.style.zIndex = 9999; // au-dessus de tout
      img.style.cursor = "zoom-out"; // curseur pour sortir

      // au clique de l’image, on ferme le plein écran
      img.addEventListener("click", () => {
        document.body.removeChild(img); // retire l’image du DOM
      });

      document.body.appendChild(img); // affiche l’image
    },
  },
});

const vm = appli.mount("#app"); // monte l'app Vue sur l'élément id app de mon html

// Animation du logo à l’arrivée
gsap.from(".logo", {
  scale: 0, // commence petit
  opacity: 0, // invisible au début
  duration: 1, // dure 1 seconde
  ease: "power3.out", // effet de rebond doux
  delay: 1, // commence après 1 seconde
});

function checkMenuBlur() {
  const menu = document.getElementById("Menu"); // récupère le menu
  const hero = document.querySelector(".hero"); // récupère la section hero
  const heroBottom = hero.getBoundingClientRect().bottom; // position bas du hero

  if (heroBottom <= 0) {
    // si on a scrollé en dessous du hero
    menu.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // fond semi-transparent
    menu.style.backdropFilter = "blur(8px)"; // applique un flou
  } else {
    // sinon, menu normal
    menu.style.backgroundColor = "transparent"; // fond transparent
    menu.style.backdropFilter = "none"; // pas de flou
  }
}

// met à jour le menu au scroll ou au chargement
window.addEventListener("scroll", checkMenuBlur);
window.addEventListener("load", checkMenuBlur);

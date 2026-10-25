/* Interactions de la page : menu, prix, promotion et commande WhatsApp. */
document.addEventListener("DOMContentLoaded", () => {
  const config = window.SITE_CONFIG || {};
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const material = document.getElementById("material");
  const pricePreview = document.getElementById("price-preview");
  const promoRadios = document.querySelectorAll('input[name="addPromo"]');
  const promoWrap = document.getElementById("promo-text-wrap");
  const promoText = document.getElementById("promo-text");
  const orderForm = document.getElementById("order-form");
  const orderError = document.getElementById("order-error");

  const prices = { Polyester: 3999, Coton: 4999 };
  const formatPrice = (amount) => `${amount.toLocaleString("fr-FR")} FCFA`;

  function updatePrice() {
    const selected = material.value;
    pricePreview.textContent = prices[selected]
      ? `Prix de la blouse : ${formatPrice(prices[selected])}`
      : "Le prix s'affichera ici.";
  }
  material?.addEventListener("change", updatePrice);

  document.querySelectorAll(".choose-material").forEach((button) => {
    button.addEventListener("click", () => {
      material.value = button.dataset.material;
      updatePrice();
      document.getElementById("commander").scrollIntoView({ behavior: "smooth" });
      material.focus({ preventScroll: true });
    });
  });

  function updatePromoField() {
    const answer = document.querySelector('input[name="addPromo"]:checked')?.value;
    const show = answer === "Oui";
    promoWrap.hidden = !show;
    promoText.required = show;
    if (!show) promoText.value = "";
  }
  promoRadios.forEach((radio) => radio.addEventListener("change", updatePromoField));

  orderForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    orderError.textContent = "";

    const form = new FormData(orderForm);
    const customerName = String(form.get("customerName") || "").trim();
    const blouseName = String(form.get("blouseName") || "").trim();
    const school = String(form.get("school") || "").trim();
    const size = String(form.get("size") || "").trim();
    const selectedMaterial = String(form.get("material") || "");
    const addPromo = String(form.get("addPromo") || "Non");
    const textPromo = String(form.get("promoText") || "").trim();
    const phone = String(config.whatsapp || "").replace(/\D/g, "");

    if (!customerName || !blouseName || !school || !size || !prices[selectedMaterial]) {
      orderError.textContent = "Vérifie les champs obligatoires avant de continuer.";
      return;
    }
    if (blouseName.length > 24) {
      orderError.textContent = "Le nom à floquer doit contenir 24 caractères maximum.";
      return;
    }
    if (addPromo === "Oui" && !textPromo) {
      orderError.textContent = "Ajoute le texte de promotion ou sélectionne Non.";
      return;
    }
    if (!phone || phone.includes("XXXXXXXXX")) {
      orderError.textContent = "Le numéro WhatsApp du vendeur doit d'abord être configuré dans js/config.js.";
      return;
    }

    const lines = [
      `Bonjour ${config.nomBoutique || "Modeste PRINTLAB"} ! Je souhaite commander une blouse.`,
      "",
      `Nom du client : ${customerName}`,
      `Nom à floquer : ${blouseName}`,
      `École / établissement : ${school}`,
      `Taille : ${size}`,
      `Matière : ${selectedMaterial}`,
      `Prix affiché : ${formatPrice(prices[selectedMaterial])}`,
      `Texte de promotion : ${addPromo === "Oui" ? textPromo : "Non"}`,
      "",
      "Je souhaite confirmer la disponibilité et le lieu de livraison sur le campus."
    ];
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  const contactLinks = [
    document.getElementById("contact-whatsapp"),
    document.getElementById("footer-whatsapp")
  ];
  const phone = String(config.whatsapp || "").replace(/\D/g, "");
  contactLinks.forEach((link) => {
    if (!link) return;
    link.href = phone && !phone.includes("XXXXXXXXX")
      ? `https://wa.me/${phone}?text=${encodeURIComponent("Bonjour, je voudrais des informations sur les blouses personnalisées.")}`
      : "#commander";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});

/*
 * Avis clients avec Supabase.
 * Sans URL et clé Supabase, le formulaire explique simplement qu'il n'est pas encore activé.
 * Les nouveaux avis ont le statut "pending" et ne sont pas visibles publiquement avant validation.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const config = window.SITE_CONFIG || {};
  const list = document.getElementById("review-list");
  const summary = document.getElementById("reviews-summary");
  const form = document.getElementById("review-form");
  const message = document.getElementById("review-message");

  let client = null;
  if (window.supabase && config.supabaseUrl && config.supabaseKey) {
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
  }

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#b42318" : "";
  }

  function createReviewCard(review) {
    const article = document.createElement("article");
    article.className = "review-card";
    const title = document.createElement("h3");
    title.textContent = review.nom;
    const meta = document.createElement("div");
    meta.className = "review-meta";
    const school = document.createElement("span");
    school.textContent = review.ecole || "Client";
    const stars = document.createElement("span");
    stars.className = "review-stars";
    stars.textContent = "★".repeat(review.note) + "☆".repeat(5 - review.note);
    stars.setAttribute("aria-label", `${review.note} sur 5 étoiles`);
    meta.append(school, stars);
    const comment = document.createElement("p");
    comment.textContent = review.commentaire;
    article.append(title, meta, comment);
    return article;
  }

  async function loadReviews() {
    if (!client) {
      summary.innerHTML = "";
      const strong = document.createElement("strong");
      strong.textContent = "Les avis seront bientôt disponibles.";
      const span = document.createElement("span");
      span.textContent = "La connexion à Supabase reste à configurer dans js/config.js.";
      summary.append(strong, span);
      list.innerHTML = '<p class="empty-reviews">Les avis validés apparaîtront ici après la configuration de la base de données.</p>';
      return;
    }

    const { data, error } = await client
      .from("avis")
      .select("id, nom, ecole, note, commentaire, created_at")
      .eq("statut", "published")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      list.innerHTML = '<p class="empty-reviews">Impossible de charger les avis pour le moment. Réessaie plus tard.</p>';
      console.error("Erreur de lecture des avis :", error.message);
      return;
    }

    list.replaceChildren();
    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-reviews">Pas encore d’avis publié. Tu peux être le premier à partager ton expérience après ton achat.</p>';
      summary.innerHTML = "<strong>Aucun avis publié pour le moment.</strong>";
      return;
    }

    const average = data.reduce((total, item) => total + item.note, 0) / data.length;
    summary.replaceChildren();
    const strong = document.createElement("strong");
    strong.textContent = `★ ${average.toFixed(1)}/5`;
    const span = document.createElement("span");
    span.textContent = `${data.length} avis publié${data.length > 1 ? "s" : ""} (30 maximum affichés)`;
    summary.append(strong, span);
    data.forEach((review) => list.append(createReviewCard(review)));
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) {
      showMessage("Le formulaire d'avis n'est pas encore activé. Configure Supabase en suivant le README.", true);
      return;
    }

    const formData = new FormData(form);
    const nom = String(formData.get("reviewName") || "").trim();
    const ecole = String(formData.get("reviewSchool") || "").trim();
    const note = Number(formData.get("rating"));
    const commentaire = String(formData.get("comment") || "").trim();

    if (!nom || !commentaire || !Number.isInteger(note) || note < 1 || note > 5) {
      showMessage("Vérifie ton prénom, ta note et ton commentaire.", true);
      return;
    }
    if (commentaire.length > 600) {
      showMessage("Le commentaire ne doit pas dépasser 600 caractères.", true);
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours…";

    const { error } = await client.from("avis").insert({
      nom,
      ecole: ecole || null,
      note,
      commentaire,
      statut: "pending"
    });

    submitButton.disabled = false;
    submitButton.textContent = "Envoyer mon avis";

    if (error) {
      console.error("Erreur d'envoi de l'avis :", error.message);
      showMessage("L'avis n'a pas pu être envoyé. Réessaie plus tard.", true);
      return;
    }

    form.reset();
    showMessage("Merci ! Ton avis a été envoyé et sera publié après validation.");
  });

  await loadReviews();
});

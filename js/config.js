/*
 * CONFIGURATION DU SITE
 * 1) Remplace le numéro ci-dessous par ton numéro WhatsApp avec l'indicatif 237.
 *    Exemple de format : 2376XXXXXXXX (chiffres uniquement, sans + ni espaces).
 * 2) Pour les avis, ajoute l'URL du projet Supabase et sa clé publishable/anon.
 *    Ces deux valeurs destinées au navigateur ne sont pas des mots de passe.
 *    NE METS JAMAIS une clé "service_role" ou une clé "secret" dans ce fichier.
 */
window.SITE_CONFIG = {
  nomBoutique: "Modeste PRINTLAB",
  slogan: "où vos idées prennent forme",
  whatsapp: "237658306579",
  supabaseUrl: "https://zuogjmbdjmnanuidybbo.supabase.co",
  supabaseKey: "sb_publishable_P3SZDtyS8aKfGG--7JLlBQ_z4GJi1d7"
};

console.log("URL Supabase :", window.SITE_CONFIG.supabaseUrl);
console.log(
  "Clé publique présente :",
  Boolean(window.SITE_CONFIG.supabaseKey)
);
console.log(
  "Clé publique commence par sb_publishable_ :",
  window.SITE_CONFIG.supabaseKey.startsWith("sb_publishable_")
);
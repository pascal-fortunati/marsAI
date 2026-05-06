import { isBrevoConfigured, sendTransactionalEmail } from "./brevoService.js";
import { buildFestivalEmailHtml } from "./emailTemplate.js";

// Fonction utilitaire pour envoyer des emails en masse de manière séquentielle
async function sendBulkEmail(recipients, subjectFn, textFn, htmlFn) {
  if (!isBrevoConfigured()) {
    console.warn("Mailer not configured, skipping bulk email.");
    return { ok: false, skipped: true };
  }

  let sent = 0;
  let errors = 0;

  console.log(`Starting bulk email to ${recipients.length} recipients...`);

  // On utilise une boucle for...of pour envoyer séquentiellement et éviter de surcharger le SMTP
  for (const recipient of recipients) {
    try {
      const { director_email, director_name } = recipient;
      if (!director_email) continue;

      const name = director_name || "Réalisateur/trice";
      const subject = subjectFn(name);
      const text = textFn(name);
      const html = buildFestivalEmailHtml({
        title: subject,
        subtitle: "marsAI 2026 · Festival de courts-métrages IA",
        bodyHtml: htmlFn(name),
      });

      await sendTransactionalEmail({
        to: director_email,
        toName: name,
        subject,
        text,
        html,
      });
      sent++;
    } catch (e) {
      console.error(`Failed to send email to ${recipient.director_email}`, e);
      errors++;
    }
  }

  console.log(`Bulk email finished. Sent: ${sent}, Errors: ${errors}`);
  return { sent, errors };
}

// Notification fin Phase 1 (Appel à films) -> Début Phase 2 (Sélection)
export async function sendPhase1EndEmail(recipients) {
  return sendBulkEmail(
    recipients,
    () => "marsAI 2026 · Fin de l'appel à films / Call for entries closed",
    (name) => `Bonjour ${name},

La phase de soumission pour le festival marsAI 2026 est désormais close.
Merci infiniment pour votre participation !

Nos jurys vont maintenant visionner l'ensemble des films pour établir la Sélection Officielle.
Vous serez informé(e) prochainement de la suite du processus.

Cordialement,
L'équipe marsAI

---

Hello ${name},

The submission phase for the marsAI 2026 festival is now closed.
Thank you very much for your participation!

Our juries will now view all films to establish the Official Selection.
You will be informed shortly of the next steps.

Best regards,
The marsAI team`,
    (name) => `<p>Bonjour ${name},</p>
<p>La phase de soumission pour le festival marsAI 2026 est désormais close.<br/>
Merci infiniment pour votre participation !</p>
<p>Nos jurys vont maintenant visionner l'ensemble des films pour établir la Sélection Officielle.<br/>
Vous serez informé(e) prochainement de la suite du processus.</p>
<p>Cordialement,<br/>L'équipe marsAI</p>
<hr/>
<p>Hello ${name},</p>
<p>The submission phase for the marsAI 2026 festival is now closed.<br/>
Thank you very much for your participation!</p>
<p>Our juries will now view all films to establish the Official Selection.<br/>
You will be informed shortly of the next steps.</p>
<p>Best regards,<br/>The marsAI team</p>`
  );
}

// Notification fin Phase 2 (Sélection) -> Début Phase 3 (Vote Public & Palmarès)
export async function sendPhase2EndEmail(recipients) {
  return sendBulkEmail(
    recipients,
    () => "marsAI 2026 · Sélection Officielle dévoilée / Official Selection revealed",
    (name) => `Bonjour ${name},

La Sélection Officielle du festival marsAI 2026 est maintenant en ligne !
Découvrez les films retenus sur notre site web.

La phase de vote du public est ouverte. N'hésitez pas à partager et inviter votre communauté à découvrir les œuvres.

Cordialement,
L'équipe marsAI

---

Hello ${name},

The Official Selection of the marsAI 2026 festival is now online!
Discover the selected films on our website.

The public voting phase is open. Feel free to share and invite your community to discover the works.

Best regards,
The marsAI team`,
    (name) => `<p>Bonjour ${name},</p>
<p>La Sélection Officielle du festival marsAI 2026 est maintenant en ligne !<br/>
Découvrez les films retenus sur notre site web.</p>
<p>La phase de vote du public est ouverte. N'hésitez pas à partager et inviter votre communauté à découvrir les œuvres.</p>
<p>Cordialement,<br/>L'équipe marsAI</p>
<hr/>
<p>Hello ${name},</p>
<p>The Official Selection of the marsAI 2026 festival is now online!<br/>
Discover the selected films on our website.</p>
<p>The public voting phase is open. Feel free to share and invite your community to discover the works.</p>
<p>Best regards,<br/>The marsAI team</p>`
  );
}

// Notification fin Phase 3 (Clôture)
export async function sendPhase3EndEmail(recipients) {
  return sendBulkEmail(
    recipients,
    () => "marsAI 2026 · Clôture du festival / Festival closing",
    (name) => `Bonjour ${name},

Le festival marsAI 2026 touche à sa fin.
Merci à tous les participants, sélectionnés ou non, pour avoir fait vivre cette édition dédiée à la créativité IA.

Un email séparé suivra avec l'annonce du Palmarès.

Cordialement,
L'équipe marsAI

---

Hello ${name},

The marsAI 2026 festival is coming to an end.
Thank you to all participants, selected or not, for bringing this AI creativity edition to life.

A separate email will follow with the announcement of the Winners.

Best regards,
The marsAI team`,
    (name) => `<p>Bonjour ${name},</p>
<p>Le festival marsAI 2026 touche à sa fin.<br/>
Merci à tous les participants, sélectionnés ou non, pour avoir fait vivre cette édition dédiée à la créativité IA.</p>
<p>Un email séparé suivra avec l'annonce du Palmarès.</p>
<p>Cordialement,<br/>L'équipe marsAI</p>
<hr/>
<p>Hello ${name},</p>
<p>The marsAI 2026 festival is coming to an end.<br/>
Thank you to all participants, selected or not, for bringing this AI creativity edition to life.</p>
<p>A separate email will follow with the announcement of the Winners.</p>
<p>Best regards,<br/>The marsAI team</p>`
  );
}

// Notification des gagnants (envoyé après la fin de la phase 3)
export async function sendWinnersEmail(recipients, winners) {
  // Construction du texte des gagnants
  const winnersListText = winners.map(w => `- ${w.badge === 'grand_prix' ? 'GRAND PRIX' : 'PRIX DU JURY'} : "${w.title}" de ${w.director}`).join('\n');
  const winnersListHtml = winners.map(w => `<li><strong>${w.badge === 'grand_prix' ? 'GRAND PRIX' : 'PRIX DU JURY'}</strong> : <em>${w.title}</em> de ${w.director}</li>`).join('');

  return sendBulkEmail(
    recipients,
    () => "marsAI 2026 · PALMARÈS / WINNERS",
    (name) => `Bonjour ${name},

Voici le Palmarès officiel du festival marsAI 2026 :

${winnersListText}

Félicitations aux lauréats et bravo à tous !
Rendez-vous l'année prochaine.

L'équipe marsAI

---

Hello ${name},

Here are the official Winners of the marsAI 2026 festival:

${winnersListText}

Congratulations to the winners and well done to everyone!
See you next year.

The marsAI team`,
    (name) => `<p>Bonjour ${name},</p>
<p>Voici le Palmarès officiel du festival marsAI 2026 :</p>
<ul>${winnersListHtml}</ul>
<p>Félicitations aux lauréats et bravo à tous !<br/>
Rendez-vous l'année prochaine.</p>
<p>L'équipe marsAI</p>
<hr/>
<p>Hello ${name},</p>
<p>Here are the official Winners of the marsAI 2026 festival:</p>
<ul>${winnersListHtml}</ul>
<p>Congratulations to the winners and well done to everyone!<br/>
See you next year.</p>
<p>The marsAI team</p>`
  );
}

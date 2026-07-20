import { Resend } from "resend";

type EventType = "hotel" | "wedding" | "private_party" | "corporate" | "other";

type ContactPayload = {
  fullName?: unknown;
  email?: unknown;
  eventType?: unknown;
  eventDate?: unknown;
  location?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
};

const MAX_LENGTHS = {
  fullName: 120,
  email: 254,
  eventDate: 40,
  location: 160,
  message: 3000,
  website: 200,
} as const;

const allowedEventTypes: EventType[] = [
  "hotel",
  "wedding",
  "private_party",
  "corporate",
  "other",
];

const eventTypeLabels: Record<EventType, string> = {
  hotel: "Hotel",
  wedding: "Matrimonio",
  private_party: "Festa privata",
  corporate: "Evento aziendale",
  other: "Altro",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(input: unknown, maxLength: number) {
  if (typeof input !== "string") {
    return "";
  }

  const withoutTags = input.replace(/<[^>]*>/g, " ");
  const compact = withoutTags.replace(/\s+/g, " ").trim();
  return compact.slice(0, maxLength);
}

function sanitizeMultilineText(input: unknown, maxLength: number) {
  if (typeof input !== "string") {
    return "";
  }

  const withoutTags = input.replace(/<[^>]*>/g, " ");
  const normalized = withoutTags
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  return normalized.slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseDate(value: string) {
  if (!value) {
    return "Non specificata";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Non specificata";
  }

  return value;
}

export async function POST(request: Request) {
  try {
    let body: ContactPayload;

    try {
      body = (await request.json()) as ContactPayload;
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (
      (typeof body.fullName === "string" && body.fullName.length > MAX_LENGTHS.fullName) ||
      (typeof body.email === "string" && body.email.length > MAX_LENGTHS.email) ||
      (typeof body.eventDate === "string" && body.eventDate.length > MAX_LENGTHS.eventDate) ||
      (typeof body.location === "string" && body.location.length > MAX_LENGTHS.location) ||
      (typeof body.message === "string" && body.message.length > MAX_LENGTHS.message) ||
      (typeof body.website === "string" && body.website.length > MAX_LENGTHS.website)
    ) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const fullName = sanitizeText(body.fullName, MAX_LENGTHS.fullName);
    const email = sanitizeText(body.email, MAX_LENGTHS.email).toLowerCase();
    const eventType = sanitizeText(body.eventType, 50) as EventType;
    const eventDate = sanitizeText(body.eventDate, MAX_LENGTHS.eventDate);
    const location = sanitizeText(body.location, MAX_LENGTHS.location);
    const message = sanitizeMultilineText(body.message, MAX_LENGTHS.message);
    const website = sanitizeText(body.website, MAX_LENGTHS.website);
    const consent = body.consent === true;

    if (website) {
      return Response.json({ ok: true }, { status: 200 });
    }

    if (fullName.length < 2) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!emailPattern.test(email)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!allowedEventTypes.includes(eventType)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    if (message.length < 10) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!consent) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const finalRecipient = "cirodinolivemusic@gmail.com";

    if (!resendApiKey || !fromEmail) {
      console.error("Contact form misconfiguration", {
        hasResendKey: Boolean(resendApiKey),
        hasFromEmail: Boolean(fromEmail),
        finalRecipient,
      });

      return Response.json(
        { error: "Service unavailable. Please try again later." },
        { status: 503 },
      );
    }

    const receivedAt = new Date().toLocaleString("it-IT", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Europe/Rome",
    });

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeEventType = escapeHtml(eventTypeLabels[eventType]);
    const safeEventDate = escapeHtml(parseDate(eventDate));
    const safeLocation = escapeHtml(location || "Non specificata");
    const safeMessageHtml = escapeHtml(message).replaceAll("\n", "<br />");
    const safeReceivedAt = escapeHtml(receivedAt);

    const textContent = [
      `Nuova richiesta dal sito - ${fullName}`,
      "",
      `Nome: ${fullName}`,
      `Email: ${email}`,
      `Tipo di evento: ${eventTypeLabels[eventType]}`,
      `Data dell'evento: ${parseDate(eventDate)}`,
      `Localita: ${location || "Non specificata"}`,
      "",
      "Messaggio:",
      message,
      "",
      `Ricevuto il: ${receivedAt}`,
    ].join("\n");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2 style="margin-bottom: 16px;">Nuova richiesta dal sito</h2>
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 680px; border-collapse: collapse;">
          <tr><td style="padding: 6px 0;"><strong>Nome:</strong> ${safeName}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Email:</strong> ${safeEmail}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Tipo di evento:</strong> ${safeEventType}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Data dell'evento:</strong> ${safeEventDate}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Localita:</strong> ${safeLocation}</td></tr>
          <tr><td style="padding: 12px 0 6px;"><strong>Messaggio:</strong><br />${safeMessageHtml}</td></tr>
          <tr><td style="padding: 12px 0 0;"><small>Ricevuto il: ${safeReceivedAt}</small></td></tr>
        </table>
      </div>
    `;

    const resend = new Resend(resendApiKey);

    const resendResponse = await resend.emails.send({
      from: fromEmail,
      to: finalRecipient,
      replyTo: email,
      subject: `Nuova richiesta dal sito — ${fullName}`,
      text: textContent,
      html: htmlContent,
    });

    const { data, error } = resendResponse;

    console.log("RESEND DATA:", data);
    console.log("RESEND ERROR:", error);

	if (error) {
	  console.error("Resend email error", error);

	  return Response.json(
		{
		  success: false,
		  error: "Impossibile inviare il messaggio. Riprova più tardi.",
		},
		{ status: 500 },
	  );
	}

    if (typeof data?.id === "string" && data.id.trim().length > 0) {
      console.log("Contact email sent", { messageId: data.id });

      return Response.json(
        {
          success: true,
          messageId: data.id,
        },
        { status: 200 },
      );
    }

    console.log("RESEND RESPONSE:", resendResponse);

    return Response.json(
      {
        success: false,
        error: "Resend non ha restituito né un errore né un Message ID.",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Contact form server error", error);
    return Response.json(
      { error: "Service unavailable. Please try again later." },
      { status: 500 },
    );
  }
}
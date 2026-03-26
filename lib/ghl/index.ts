const GHL_API_KEY = process.env.GHL_API_KEY || "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "";
const GHL_BASE_URL = "https://services.leadconnectorhq.com";

async function ghlFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${GHL_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL API error: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

// --- Contacts ---

export async function createContact(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  customFields?: Array<{ key: string; value: string }>;
}) {
  return ghlFetch("/contacts/", {
    method: "POST",
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      tags: data.tags,
      source: data.source,
      customField: data.customFields,
    }),
  });
}

/**
 * Create a contact, or return the existing contactId if a duplicate is found.
 * GHL returns 400 with meta.contactId for duplicates — this handles that.
 */
export async function createContactOrGetExisting(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  source?: string;
}): Promise<{ contactId: string; created: boolean }> {
  const res = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      tags: data.tags,
      source: data.source,
    }),
  });

  const body = await res.json();
  console.log("[ghl] createContactOrGetExisting status:", res.status, "| body:", JSON.stringify(body));

  if (res.ok) {
    return { contactId: (body as { contact: { id: string } }).contact.id, created: true };
  }

  if (res.status === 400) {
    const meta = (body as { meta?: { contactId?: string } })?.meta;
    if (meta?.contactId) {
      return { contactId: meta.contactId, created: false };
    }
  }

  throw new Error(`GHL API error: ${res.status} ${JSON.stringify(body)}`);
}

/**
 * Set custom fields on a contact using field keys (e.g. "contact.message").
 * Resolves keys at the GHL API level — no hardcoded field IDs needed.
 */
export async function setContactCustomFields(
  contactId: string,
  fields: Array<{ key: string; field_value: string }>
) {
  return ghlFetch(`/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify({ customFields: fields }),
  });
}

/** Add a note to a contact. */
export async function addContactNote(contactId: string, body: string) {
  return ghlFetch(`/contacts/${contactId}/notes`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function updateContact(
  contactId: string,
  data: Record<string, unknown>
) {
  return ghlFetch(`/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getContactByEmail(email: string) {
  return ghlFetch(
    `/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`
  );
}

export async function addContactTag(contactId: string, tags: string[]) {
  return ghlFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tags }),
  });
}

export async function removeContactTag(contactId: string, tags: string[]) {
  return ghlFetch(`/contacts/${contactId}/tags`, {
    method: "DELETE",
    body: JSON.stringify({ tags }),
  });
}

// --- Workflows ---

export async function addContactToWorkflow(
  contactId: string,
  workflowId: string
) {
  return ghlFetch(
    `/contacts/${contactId}/workflow/${workflowId}`,
    { method: "POST" }
  );
}

export async function removeContactFromWorkflow(
  contactId: string,
  workflowId: string
) {
  return ghlFetch(
    `/contacts/${contactId}/workflow/${workflowId}`,
    { method: "DELETE" }
  );
}

// --- Pipelines ---

export async function getPipelines() {
  return ghlFetch(
    `/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`
  );
}

export async function createOpportunity(data: {
  pipelineId: string;
  pipelineStageId: string;
  contactId: string;
  name: string;
  monetaryValue?: number;
}) {
  return ghlFetch("/opportunities/", {
    method: "POST",
    body: JSON.stringify({
      pipelineId: data.pipelineId,
      pipelineStageId: data.pipelineStageId,
      status: "open",
      name: data.name,
      locationId: GHL_LOCATION_ID,
      contactId: data.contactId,
      ...(data.monetaryValue !== undefined && { monetaryValue: data.monetaryValue }),
    }),
  });
}

export async function updateOpportunityStage(
  opportunityId: string,
  stageId: string
) {
  return ghlFetch(`/opportunities/${opportunityId}`, {
    method: "PUT",
    body: JSON.stringify({ stageId }),
  });
}

// --- Campaigns ---

export async function getCampaigns() {
  return ghlFetch(
    `/campaigns/?locationId=${GHL_LOCATION_ID}`
  );
}

// --- Conversations ---

export async function sendSms(data: {
  contactId: string;
  message: string;
}) {
  return ghlFetch("/conversations/messages", {
    method: "POST",
    body: JSON.stringify({
      type: "SMS",
      contactId: data.contactId,
      message: data.message,
    }),
  });
}

export async function sendEmail(data: {
  contactId: string;
  subject: string;
  body: string;
  html?: string;
}) {
  return ghlFetch("/conversations/messages", {
    method: "POST",
    body: JSON.stringify({
      type: "Email",
      contactId: data.contactId,
      subject: data.subject,
      message: data.body,
      html: data.html,
    }),
  });
}

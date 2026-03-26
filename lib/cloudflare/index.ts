const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || "";
const CF_BASE = "https://api.cloudflare.com/client/v4";

async function cfFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${CF_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudflare API error: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

// Get the account ID from the zone
export async function getAccountId(): Promise<string> {
  const data = await cfFetch<{
    result: { account: { id: string } };
  }>(`/zones/${CF_ZONE_ID}`);
  return data.result.account.id;
}

// --- Bulk Redirect Lists ---

export async function createRedirectList(
  name: string,
  description?: string
) {
  const accountId = await getAccountId();
  return cfFetch(`/accounts/${accountId}/rules/lists`, {
    method: "POST",
    body: JSON.stringify({
      name,
      description: description || `Salt & Stone SEO redirects - ${name}`,
      kind: "redirect",
    }),
  });
}

export async function addRedirectItems(
  listId: string,
  redirects: Array<{
    source_url: string;
    target_url: string;
    status_code?: 301 | 302;
  }>
) {
  const accountId = await getAccountId();
  const items = redirects.map((r) => ({
    redirect: {
      source_url: r.source_url,
      target_url: r.target_url,
      status_code: r.status_code || 301,
    },
  }));

  return cfFetch(
    `/accounts/${accountId}/rules/lists/${listId}/items`,
    {
      method: "POST",
      body: JSON.stringify(items),
    }
  );
}

export async function getRedirectList(listId: string) {
  const accountId = await getAccountId();
  return cfFetch(
    `/accounts/${accountId}/rules/lists/${listId}/items`
  );
}

export async function deleteRedirectItems(
  listId: string,
  itemIds: string[]
) {
  const accountId = await getAccountId();
  return cfFetch(
    `/accounts/${accountId}/rules/lists/${listId}/items`,
    {
      method: "DELETE",
      body: JSON.stringify({ items: itemIds.map((id) => ({ id })) }),
    }
  );
}

// --- Bulk Redirect Rules ---

export async function createBulkRedirectRule(
  listId: string,
  ruleName: string
) {
  return cfFetch(`/zones/${CF_ZONE_ID}/rulesets/phases/http_request_redirect/entrypoint`, {
    method: "PUT",
    body: JSON.stringify({
      rules: [
        {
          expression: `http.request.full_uri in $${listId}`,
          description: ruleName,
          action: "redirect",
          action_parameters: {
            from_list: {
              name: listId,
              key: "http.request.full_uri",
            },
          },
        },
      ],
    }),
  });
}

// --- Utility: fetch existing site URLs ---

export async function fetchExistingSitemap(
  sitemapUrl: string
): Promise<string[]> {
  const res = await fetch(sitemapUrl);
  if (!res.ok) return [];
  const xml = await res.text();

  // Simple XML URL extraction
  const urls: string[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

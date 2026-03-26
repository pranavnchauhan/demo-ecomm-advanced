const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'salt-and-stone-au.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_ADMIN_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;

console.log("Domain:", DOMAIN);
console.log("Client ID present:", !!CLIENT_ID, CLIENT_ID?.substring(0, 8) + "...");
console.log("Client Secret present:", !!CLIENT_SECRET, CLIENT_SECRET?.substring(0, 8) + "...");

async function run() {
  // Step 1: Get Admin API access token via client_credentials grant
  console.log("\n=== Step 1: OAuth client_credentials grant ===");
  const oauthUrl = `https://${DOMAIN}/admin/oauth/access_token`;
  console.log("POST", oauthUrl);

  const oauthRes = await fetch(oauthUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  console.log("OAuth status:", oauthRes.status);
  const oauthText = await oauthRes.text();
  
  if (!oauthRes.ok) {
    // Try URL-encoded format too
    console.log("JSON body failed, trying URL-encoded...");
    const oauthRes2 = await fetch(oauthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    console.log("URL-encoded status:", oauthRes2.status);
    const oauthText2 = await oauthRes2.text();
    
    if (!oauthRes2.ok) {
      console.log("URL-encoded response:", oauthText2.substring(0, 500));
      console.log("\nBoth formats failed. Trying direct Admin API with secret as token...");
      
      // Step 1b: Try using client secret directly as Admin API token
      const adminUrl = `https://${DOMAIN}/admin/api/2024-10/products.json?limit=5`;
      const adminRes = await fetch(adminUrl, {
        headers: { 'X-Shopify-Access-Token': CLIENT_SECRET },
      });
      console.log("Direct Admin API status:", adminRes.status);
      if (adminRes.ok) {
        const data = await adminRes.json();
        console.log("SUCCESS! Products found:", data.products?.length);
        data.products?.forEach(p => {
          console.log(`  - ${p.title}: $${p.variants?.[0]?.price}`);
        });
      } else {
        console.log("Direct Admin failed:", (await adminRes.text()).substring(0, 300));
      }
      
      // Step 1c: Try client ID as Storefront token 
      console.log("\nTrying Client ID as Storefront API token...");
      const sfUrl = `https://${DOMAIN}/api/2024-10/graphql.json`;
      const sfRes = await fetch(sfUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': CLIENT_ID,
        },
        body: JSON.stringify({
          query: `{ products(first: 5) { edges { node { title priceRange { minVariantPrice { amount currencyCode } } } } } }`,
        }),
      });
      console.log("Storefront with Client ID status:", sfRes.status);
      const sfData = await sfRes.text();
      console.log("Response:", sfData.substring(0, 500));
      
      return;
    }
    
    // URL-encoded worked
    const oauthJson2 = JSON.parse(oauthText2);
    console.log("Got access token:", !!oauthJson2.access_token);
    console.log("Expires in:", oauthJson2.expires_in, "seconds");
    await testWithToken(oauthJson2.access_token);
    return;
  }

  const oauthJson = JSON.parse(oauthText);
  console.log("Got access token:", !!oauthJson.access_token);
  console.log("Expires in:", oauthJson.expires_in, "seconds");
  await testWithToken(oauthJson.access_token);
}

async function testWithToken(adminToken) {
  // Step 2: Fetch products via Admin API
  console.log("\n=== Step 2: Fetch products via Admin API ===");
  const productsUrl = `https://${DOMAIN}/admin/api/2024-10/products.json?limit=5`;
  const prodRes = await fetch(productsUrl, {
    headers: { 'X-Shopify-Access-Token': adminToken },
  });
  console.log("Products status:", prodRes.status);
  
  if (prodRes.ok) {
    const data = await prodRes.json();
    console.log("Products found:", data.products?.length);
    data.products?.forEach(p => {
      console.log(`  - ${p.title}: $${p.variants?.[0]?.price} (handle: ${p.handle})`);
    });
  } else {
    console.log("Products failed:", (await prodRes.text()).substring(0, 300));
  }

  // Step 3: Create Storefront Access Token via Admin GraphQL
  console.log("\n=== Step 3: Create Storefront Access Token ===");
  const adminGqlUrl = `https://${DOMAIN}/admin/api/2024-10/graphql.json`;
  const sfMutation = await fetch(adminGqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({
      query: `mutation { storefrontAccessTokenCreate(input: { title: "Salt & Stone AU v0 Website" }) { storefrontAccessToken { accessToken } userErrors { field message } } }`,
    }),
  });
  console.log("Storefront token creation status:", sfMutation.status);
  const sfData = await sfMutation.json();
  console.log("Response:", JSON.stringify(sfData, null, 2));
  
  if (sfData.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken) {
    const sfToken = sfData.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
    console.log("\nStorefront Access Token:", sfToken);
    
    // Step 4: Test Storefront API with the new token
    console.log("\n=== Step 4: Test Storefront API ===");
    const sfApiUrl = `https://${DOMAIN}/api/2024-10/graphql.json`;
    const sfTest = await fetch(sfApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': sfToken,
      },
      body: JSON.stringify({
        query: `{ products(first: 5) { edges { node { title handle priceRange { minVariantPrice { amount currencyCode } } variants(first: 3) { edges { node { id title price { amount currencyCode } } } } } } } }`,
      }),
    });
    console.log("Storefront API status:", sfTest.status);
    const sfTestData = await sfTest.json();
    console.log("Storefront products:", JSON.stringify(sfTestData, null, 2));
  }
}

run().catch(err => console.error("Fatal:", err.message));

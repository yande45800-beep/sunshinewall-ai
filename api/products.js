export default async function handler(req, res) {
  const limit = req.query?.limit || 20;
  const endpoint = "https://sunshinewallkl.myshopify.com/api/2023-10/graphql.json";
  const token = "24efc55d625f21341bc5dd932d056779"; // token Shopify

  const gqlQuery = `
    {
      products(first: ${limit}) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            onlineStoreUrl
            featuredImage { url altText }
            images(first: 20) { edges { node { url altText } } }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  priceV2 { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({ query: gqlQuery })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Shopify API error:", err);
    return res.status(500).json({ error: err.message });
  }
}

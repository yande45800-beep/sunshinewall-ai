export default async function handler(req, res) {
  try {
    const limit = req.query?.limit || 20;
    const endpoint = "https://sunshinewallkl.myshopify.com/api/2023-10/graphql.json";
    const token = "24efc55d625f21341bc5dd932d056779";

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

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({ query: gqlQuery })
    });

    const data = await response.json();

    // ✅ Réponse standard
    return res.status(200).json({
      success: true,
      count: data?.data?.products?.edges?.length || 0,
      data
    });

  } catch (error) {
    console.error("❌ Shopify API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

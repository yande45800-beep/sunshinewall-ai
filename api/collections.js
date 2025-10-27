export default async function handler(req, res) {
  try {
    const endpoint = "https://sunshinewallkl.myshopify.com/api/2023-10/graphql.json";
    const token = "24efc55d625f21341bc5dd932d056779";

    const gqlQuery = `
      {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
              updatedAt
              products(first: 10) {
                edges {
                  node {
                    title
                    handle
                    featuredImage { url altText }
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
    return res.status(200).json({
      success: true,
      count: data?.data?.collections?.edges?.length || 0,
      data
    });

  } catch (error) {
    console.error("❌ Shopify API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

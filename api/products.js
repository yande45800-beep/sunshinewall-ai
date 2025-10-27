export async function handler(event) {
  const limit = event.queryStringParameters?.limit || 20;
  const endpoint = "https://sunshinewallkl.myshopify.com/api/2023-10/graphql.json";
  const token = "24efc55d625f21341bc5dd932d056779"; // Storefront Access Token

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
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
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

    if (!response.ok) {
      console.error("Shopify API Error:", data);
      throw new Error(`Shopify returned ${response.status}: ${JSON.stringify(data)}`);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2)
    };
  } catch (err) {
    console.error("Error in SunshineWall products API:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

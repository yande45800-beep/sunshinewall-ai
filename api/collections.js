export async function handler() {
  const endpoint = "https://sunshinewallk.myshopify.com/api/2023-10/graphql.json";
  const token = "24efc55d625f21341bc5dd932d056779"; // remplacez par votre Storefront token

  const gqlQuery = `
    {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            image { url altText }
            products(first: 20) {
              edges {
                node {
                  id
                  title
                  handle
                  descriptionHtml
                  featuredImage { url altText }
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
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

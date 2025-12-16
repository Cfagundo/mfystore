import Client from 'shopify-buy';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const client = Client.buildClient({
    domain: domain,
    storefrontAccessToken: storefrontAccessToken,
    apiVersion: '2023-10'
});

// --- Data Mapping Helper ---
// Maps Shopify product to our App's expected format
const mapShopifyProduct = (p) => {
    // Attempt to find a "Color" option to determine variant colors
    const colorOption = p.options.find(opt => opt.name === 'Color' || opt.name === 'Colour');

    // Map variants
    const appVariants = p.variants.map(v => {
        const colorValue = v.selectedOptions.find(opt => opt.name === 'Color' || opt.name === 'Colour')?.value;
        return {
            id: v.id,
            color: mapColorToHex(colorValue), // Helper to convert strings like "Black" to "#000000"
            image: v.image?.src || p.images[0]?.src,
            price: v.price.amount,
            size: v.selectedOptions.find(opt => opt.name === 'Size')?.value
        };
    });

    // Group variants by unique color for the cycling display logic
    // We need unique color entries for the "variants" array used in ProductCard cycling
    const uniqueColorVariants = [];
    const seenColors = new Set();

    appVariants.forEach(v => {
        if (!seenColors.has(v.color) && v.color) {
            seenColors.add(v.color);
            uniqueColorVariants.push({
                color: v.color,
                image: v.image
            });
        }
    });

    return {
        id: p.id,
        code: p.title.toUpperCase(), // Using Title as Code for now
        name: p.title,
        price: pathPrice(p.variants[0]?.price.amount),
        category: 'mens', // Default or fetch from collection/tag
        color: uniqueColorVariants[0]?.color || '#000000', // Default color
        image: p.images[0]?.src,
        images: p.images.map(img => img.src),
        variants: uniqueColorVariants, // For the cycling logic
        description: p.descriptionHtml || p.description
    };
};

const pathPrice = (price) => {
    return parseFloat(price) || 0;
}

// Simple map for standard colors - In a real app this might be metadata or more robust
const mapColorToHex = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();
    // Map text names to the Hex codes your app expects
    if (n.includes('black')) return '#000000';
    if (n.includes('grey') || n.includes('gray')) return '#3F3F3F';
    if (n.includes('silver')) return '#B8B8B8';
    if (n.includes('white')) return '#FFFFFF';
    if (n.includes('red')) return '#FF0000';
    if (n.includes('blue')) return '#0000FF';
    // If it's already a hex code (e.g. user entered #123456 in Shopify), return it
    if (n.startsWith('#')) return n;

    return '#000000'; // Fallback
};

// --- API Methods ---

export const fetchAllProducts = async () => {
    if (!domain || !storefrontAccessToken) return [];
    try {
        const products = await client.product.fetchAll();
        return products.map(mapShopifyProduct);
    } catch (error) {
        console.error("Shopify fetch error:", error);
        return [];
    }
};

export const createCheckout = async () => {
    return await client.checkout.create();
};

export const addItemToCheckout = async (checkoutId, lineItems) => {
    return await client.checkout.addLineItems(checkoutId, lineItems);
};

export const fetchCheckout = async (checkoutId) => {
    return await client.checkout.fetch(checkoutId);
};


export default client;

import Client from 'shopify-buy';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const client = Client.buildClient({
    domain: domain,
    storefrontAccessToken: storefrontAccessToken,
    apiVersion: '2023-10'
});

// --- Data Mapping Helper ---
// Maps Shopify product to our App's exact expected format
// to ensure animations and styles work perfectly.
const mapShopifyProduct = (p) => {
    // 1. Identify Color Option Name (e.g. "Color", "Colour")
    const colorOptionParams = ['Color', 'Colour', 'color', 'colour'];
    const colorOption = p.options.find(opt => colorOptionParams.includes(opt.name));

    // 2. Map Variants
    const appVariants = [];
    const colorMap = new Map();

    p.variants.forEach((v, index) => {
        // Find the value for the color option
        const colorValue = v.selectedOptions.find(opt => colorOptionParams.includes(opt.name))?.value;
        const hexColor = mapColorToHex(colorValue);

        if (hexColor && !colorMap.has(hexColor)) {
            let variantImage = v.image?.src;

            // Strategy 2: Smart Filename Match
            if (!variantImage && colorValue) {
                const colorSlug = colorValue.toLowerCase().replace('matte', '').trim();
                const matchedImage = p.images.find(img => img.src.toLowerCase().includes(colorSlug));
                if (matchedImage) variantImage = matchedImage.src;
            }

            // Strategy 3: Index Match (Last Resort)
            // If we have 3 variants and 3 images, assume they align.
            if (!variantImage && index < p.images.length) {
                variantImage = p.images[index].src;
            }

            // Fallback to Main Image
            variantImage = variantImage || p.images[0]?.src;

            const appVariant = {
                id: v.id,
                color: hexColor,
                image: variantImage,
                images: p.images.map(img => img.src),
                available: v.availableForSale !== undefined ? v.availableForSale : v.available
            };

            colorMap.set(hexColor, true);
            appVariants.push(appVariant);
        }
    });

    // 3. Fallback if no variants found (simple product)
    if (appVariants.length === 0) {
        appVariants.push({
            id: p.variants[0]?.id,
            color: '#000000', // Default
            image: p.images[0]?.src,
            images: p.images.map(img => img.src)
        });
    }

    // 4. Construct Final Object
    return {
        id: p.id,
        code: p.title.toUpperCase(),
        name: p.title, // or p.handle if you prefer "T-SHIRT-01" style
        price: pathPrice(p.variants[0]?.price.amount),
        category: p.productType?.toLowerCase() || 'mens',
        color: appVariants[0]?.color || '#000000',
        image: p.images[0]?.src, // Main image
        images: p.images.map(img => img.src), // Gallery
        variants: appVariants, // Dynamic variants for the cycle
        description: p.descriptionHtml || p.description
    };
};

const pathPrice = (price) => {
    return parseFloat(price) || 0;
}

// Robust Color Map
// This bridges the gap between Shopify Naming and App Styling
const mapColorToHex = (name) => {
    if (!name) return '#000000'; // Default black
    const n = name.toString().toLowerCase();

    // Direct Hex
    if (n.startsWith('#')) return n;

    // Standard mappings
    if (n.includes('black')) return '#000000';
    if (n.includes('grey') || n.includes('gray') || n.includes('anthracite')) return '#3F3F3F';
    if (n.includes('white') || n.includes('light grey')) return '#B8B8B8';

    if (n.includes('red') || n.includes('burgundy')) return '#8B0000';
    if (n.includes('blue') || n.includes('navy')) return '#000080';
    if (n.includes('green') || n.includes('olive')) return '#556B2F';
    if (n.includes('beige') || n.includes('sand')) return '#F5F5DC';

    // Fallback for unknown text
    return '#000000';
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

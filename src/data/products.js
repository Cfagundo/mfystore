export const products = [
    {
        id: 'ts-01',
        code: 'ONE PIECE - MATTE BLACK',
        name: 'T-Shirt 01',
        price: 60,
        category: 'mens',
        color: '#000000',
        imageId: 1,
        image: '/product.png',
        images: ['/product.png', '/slide2.svg', '/slide3.svg'],
        variants: [
            // Set available: false to display "SOLD OUT" on the site
            { color: '#000000', image: '/product.png', images: ['/product.png', '/product-model1.png', '/product-model2.png'], shopifyId: 'gid://shopify/ProductVariant/52857919209779', available: true },
            { color: '#3F3F3F', image: '/product-dark.png', images: ['/product-dark.png', '/slide2.svg', '/slide3.svg'], shopifyId: 'gid://shopify/ProductVariant/52857919242547', available: false }, // Change to false to test
            { color: '#B8B8B8', image: '/product-grey.png', images: ['/product-grey.png', '/slide2.svg', '/slide3.svg'], shopifyId: 'gid://shopify/ProductVariant/52857919275315', available: false }
        ],
        description: "Constructed from a premium, high-stretch technical blend, this swimsuit provides a smooth, second-skin feel that sculpts and supports without restricting movement. The material features a sophisticated matte finish and is detailed with durable, exposed overlock stitching along the contours to ensure shape retention and long-lasting wear."
    }
];

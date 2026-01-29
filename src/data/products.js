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
            // Black - Available
            {
                color: '#000000',
                image: '/product.png',
                images: ['/product.png', '/product-model1.png', '/product-model2.png'],
                available: true,
                sizeIds: {
                    'SML': 'gid://shopify/ProductVariant/52857919209779',
                    'MED': 'gid://shopify/ProductVariant/53009335877939',
                    'LRG': 'gid://shopify/ProductVariant/53009335910707'
                }
            },
            // Grey - Sold Out (Change available to true to enable)
            {
                color: '#3F3F3F',
                image: '/product-dark.png',
                images: ['/product-dark.png', '/slide2.svg', '/slide3.svg'],
                available: false,
                sizeIds: {
                    'SML': 'gid://shopify/ProductVariant/52857919242547',
                    'MED': 'gid://shopify/ProductVariant/53009335943475',
                    'LRG': 'gid://shopify/ProductVariant/53009335976243'
                }
            },
            // Silver - Sold Out (Change available to true to enable)
            {
                color: '#B8B8B8',
                image: '/product-grey.png',
                images: ['/product-grey.png', '/slide2.svg', '/slide3.svg'],
                available: false,
                sizeIds: {
                    'SML': 'gid://shopify/ProductVariant/52857919275315',
                    'MED': 'gid://shopify/ProductVariant/53009336009011',
                    'LRG': 'gid://shopify/ProductVariant/53009336041779'
                }
            }
        ],
        description: "Constructed from a premium, high-stretch technical blend, this swimsuit provides a smooth, second-skin feel that sculpts and supports without restricting movement. The material features a sophisticated matte finish and is detailed with durable, exposed overlock stitching along the contours to ensure shape retention and long-lasting wear."
    }
];

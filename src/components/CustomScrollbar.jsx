import React, { useEffect, useState } from 'react';

const CustomScrollbar = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = window.scrollY / totalHeight;
        setScrollProgress(progress);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Color interpolation logic: Black -> Dark Gray -> Light Grey
    // 0% -> 50% -> 100%
    // Black: #000000
    // Dark Gray: #3F3F3F
    // Light Gray: #B8B8B8

    // Simple logic: we'll use CSS transitions and classes or inline styles for simplicity?
    // Let's use 3 distinct square blocks that light up? Or one moving block?
    // "scroller thats the shape of squares" - plural.
    // "squares fade in order"

    // Interpretation: A vertical stack of squares on the right (scrollbar track).
    // As you scroll down, they light up or fade in.

    // Let's assume a track height of ~80% of screen, composed of multiple squares?
    // Or just 3 main squares representing sections?

    // Given the prompt "a scroller... shape of squares... move up and down... squares fade in order",
    // I will implement a single square thumb that *moves* and changes color. 
    // Wait, "squares fade". 
    // I'll try implementing a "Trail of squares" or just a Thumb that is a Square and matches the palette.

    // Rolodex logic
    // We want a series of squares fixed in the center right.
    // As we scroll (0 to 1), we iterate through them.

    // Increase squares to create a longer "strip" feeling
    const numberOfSquares = 7;

    // Calculating the "active" float index (0 to 6.99)
    // This allows for smooth transitions between squares
    const activeIndexFloat = scrollProgress * (numberOfSquares - 1);

    // Palette colors mapping
    const getSquareColor = (index) => {
        // Map index to color palette (Black -> Dark Gray -> Light Gray)
        // 0-2: Black
        // 3-4: Dark Gray
        // 5-6: Light Gray
        if (index < 3) return '#000000';
        if (index < 5) return '#3F3F3F';
        return '#B8B8B8';
    };

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 9999,
            pointerEvents: 'none',
        }}>
            {Array.from({ length: numberOfSquares }).map((_, index) => {
                // Calculate distance from the current scroll position
                const distance = Math.abs(index - activeIndexFloat);

                // Scale effect: 
                // Close to 0 distance = 1.0 (active)
                // Further away = smaller
                let scale = Math.max(0.5, 1.2 - (distance * 0.4));
                scale = Math.min(scale, 1.2); // Cap scaling

                // Opacity effect:
                // Active = 1
                // Further away = fades out
                let opacity = Math.max(0.2, 1 - (distance * 0.5));

                return (
                    <div
                        key={index}
                        style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: getSquareColor(index),
                            transform: `scale(${scale})`,
                            opacity: opacity,
                            transition: 'all 0.1s ease-out', // Fast transition for smooth feeling
                            boxShadow: distance < 0.5 ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
                            borderRadius: '1px' // Slight rounding for style
                        }}
                    />
                );
            })}
        </div>
    );
};

export default CustomScrollbar;

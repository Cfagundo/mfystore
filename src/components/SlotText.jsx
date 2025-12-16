import React, { useState, useEffect } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

const SlotText = ({ text, interval = 20000, duration = 3000 }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const triggerAnimation = () => {
            setIsAnimating(true);
            const startTime = Date.now();

            const animate = () => {
                const now = Date.now();
                const elapsed = now - startTime;

                if (elapsed < duration) {
                    // Generate random string
                    const randomChars = text.split('').map(char => {
                        if (char === ' ') return ' '; // Preserve spaces
                        return characters[Math.floor(Math.random() * characters.length)];
                    }).join('');

                    setDisplayText(randomChars);
                    requestAnimationFrame(animate);
                } else {
                    setDisplayText(text);
                    setIsAnimating(false);
                }
            };

            requestAnimationFrame(animate);
        };

        // Initial trigger? The user said "every 20 seconds". 
        // Maybe trigger once on mount for effect? Or just wait 20s.
        // Usually "every 20s" implies waiting.
        const timer = setInterval(triggerAnimation, interval);

        // Optional: Trigger on mount?
        // triggerAnimation(); 

        return () => clearInterval(timer);
    }, [text, interval, duration]);

    // Update if prop changes
    useEffect(() => {
        if (!isAnimating) {
            setDisplayText(text);
        }
    }, [text, isAnimating]);

    return <span>{displayText}</span>;
};

export default SlotText;

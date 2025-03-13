import { useState, useEffect } from "react";

export default function useSticky(threshold = 100) {
    const [isSticky, setSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setSticky(window.scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return isSticky;
}

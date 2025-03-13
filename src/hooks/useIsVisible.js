import { useState, useEffect } from 'react';
import { useLocation } from "react-router";

export default function useIsVisible(ref) {
    const [isIntersecting, setIntersecting] = useState(false);
    const location = useLocation();
    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref.current]); // ✅ Proper dependency

    useEffect(() => {
        // ✅ Reset visibility state when navigating between pages
        setIntersecting(false);
    }, [location.pathname]);

    return isIntersecting;
}

"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if we have a hash in the URL (need to use window.location because usePathname doesn't include hash)
    const hash = window.location.hash;

    const scrollToHash = () => {
      if (hash) {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          return true;
        }
      }
      return false;
    };

    if (hash) {
      // Try immediately
      if (!scrollToHash()) {
        // Retry for dynamic content
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
          attempts++;
          if (scrollToHash() || attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

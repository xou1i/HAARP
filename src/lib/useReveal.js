export function useReveal(node) {
    const revealClass = "reveal-active";
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    node.classList.add(revealClass);
                    observer.unobserve(node);
                }
            });
        },
        { threshold: 0.1 },
    );

    node.classList.add("reveal");
    observer.observe(node);

    return {
        destroy() {
            observer.unobserve(node);
        },
    };
}

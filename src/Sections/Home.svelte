<script>
    import Shape from "../assets/Shape.png";
    import { useReveal } from "../lib/useReveal";

    let mounted = true;
</script>

<section
    id="Home"
    class="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden px-3 sm:px-4 md:px-6 py-20 sm:py-24"
>
    <div class="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {#if mounted}
            <img
                src={Shape}
                alt="HAARP decorative U-shaped ring"
                class="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -top-12 w-[780px] max-w-none opacity-80 mix-blend-soft-light z-0 sm:-top-16 sm:w-[860px] md:-top-24 md:w-[1000px] lg:-top-32 lg:w-[1180px] shape-glow-soft w-[280px] sm:w-[520px] md:w-[820px] lg:w-[1000px] -top-3 sm:-top-6 md:-top-8 lg:-top-10 max-w-full object-contain reveal"
                use:useReveal
            />

            <h2
                class="relative mt-20 z-10 text-xl md:text-3xl font-bold text-center text-white mb-6 drop-shadow-md headline-glow sm:text-3xl lg:text-4xl sm:mt-20 reveal"
                use:useReveal
            >
                HAARP - Weather Monitoring System
            </h2>

            <p
                class="relative z-10 text-center text-gray-100 max-w-2xl text-lg leading-relaxed mb-12 md:mb-14 drop-shadow-sm text-sm sm:text-base md:text-lg lg:text-base leading-snug max-w-xs sm:max-w-md md:max-w-2xl reveal"
                use:useReveal
            >
                A smart environmental monitoring system that integrates
                electronics, sensors, and software to read, analyze, and
                visualize real-time climate data.
            </p>

            <div
                class="relative z-10 glass p-8 rounded-2xl max-w-3xl w-full text-center mt-4 mb-16 animate-border-glow hover:scale-[1.01] transition-transform duration-400 w-full max-w-xs sm:max-w-xl md:max-w-2xl p-4 sm:p-6 md:p-8 reveal"
                use:useReveal
            >
                <h3
                    class="text-xl font-bold mb-6 text-white drop-shadow-sm text-lg sm:text-xl reveal"
                    use:useReveal
                >
                    What is HAARP ?
                </h3>
                <p
                    class="text-sm text-gray-100 mb-6 leading-relaxed text-sm leading-snug reveal"
                    use:useReveal
                >
                    HAARP is a complete weather-monitoring solution designed to
                    collect four main environmental indicators:
                </p>
                <ul
                    class="flex flex-wrap justify-center gap-4 text-gray-100 font-medium mb-6"
                >
                    {#each ["dYOнЛ,? Temperature", "dY' Humidity", "Г~?Л,? Light Intensity", "dY?Я Air Quality"] as pill, index}
                        <li
                            class="bg-white/10 px-4 py-1 rounded-full border border-white/20 hover:bg-white/20 hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-sm px-3 sm:px-4 py-1 reveal"
                            use:useReveal
                        >
                            {pill}
                        </li>
                    {/each}
                </ul>
                <p
                    class="text-base text-gray-100 leading-relaxed reveal"
                    use:useReveal
                >
                    These readings are processed by Arduino hardware, visualized
                    through a Java dashboard, and documented through this
                    website.
                </p>
            </div>
        {/if}
    </div>
</section>

<style>
    @keyframes shapeGlowPulse {
        0%,
        100% {
            opacity: 0.6;
            filter: drop-shadow(0 18px 42px rgba(255, 180, 255, 0.25))
                drop-shadow(0 0 18px rgba(190, 70, 190, 0.25));
        }
        50% {
            opacity: 1;
            filter: drop-shadow(0 18px 42px rgba(255, 230, 255, 0.5))
                drop-shadow(0 0 55px rgba(220, 110, 220, 0.55));
        }
    }

    :global(.shape-glow-soft) {
        animation: shapeGlowPulse 5s ease-in-out infinite;
        transition: filter 0.3s ease, opacity 0.3s ease;
    }
</style>

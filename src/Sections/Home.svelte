<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { useReveal } from "../lib/useReveal.js";
    import Shape from "../assets/Shape.png";

    let mounted = false;
    let visibleElements = new Set();
    let showWeatherPanel = false;
    let weatherData = null;
    let isLoading = false;
    let errorMessage = "";

    const baghdadCoordinates = {
        latitude: 33.3152,
        longitude: 44.3661,
    };

    const weatherEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${baghdadCoordinates.latitude}&longitude=${baghdadCoordinates.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

    async function fetchWeather() {
        isLoading = true;
        errorMessage = "";
        weatherData = null;

        try {
            const response = await fetch(weatherEndpoint);
            if (!response.ok) {
                throw new Error("Failed to fetch weather");
            }
            const data = await response.json();
            weatherData = data;
        } catch (error) {
            console.error("Weather fetch error:", error);
            errorMessage = "Unable to load live weather. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    function openWeatherPanel() {
        showWeatherPanel = true;
        fetchWeather();
    }

    function closeWeatherPanel() {
        showWeatherPanel = false;
    }

    $: weatherStats = weatherData
        ? [
                {
                    label: "Temperature",
                    value:
                        weatherData.current?.temperature_2m ??
                        weatherData.current_weather?.temperature ??
                        null,
                    unit:
                        weatherData.current_units?.temperature_2m ??
                        weatherData.current_weather_units?.temperature ??
                        "°C",
                },
                {
                    label: "Humidity",
                    value:
                        weatherData.current?.relative_humidity_2m ??
                        weatherData.hourly?.relativehumidity_2m?.[0] ??
                        null,
                    unit:
                        weatherData.current_units?.relative_humidity_2m ??
                        "%",
                },
                {
                    label: "Wind Speed",
                    value:
                        weatherData.current?.wind_speed_10m ??
                        weatherData.current_weather?.windspeed ??
                        null,
                    unit:
                        weatherData.current_units?.wind_speed_10m ??
                        weatherData.current_weather_units?.windspeed ??
                        "m/s",
                },
            ]
        : [];

    onMount(() => {
        mounted = true;
        setupScrollAnimations();
    });

    function fadeFly(node, { delay = 0, duration = 250, y = 20 } = {}) {
        const o = +getComputedStyle(node).opacity;
        node.style.willChange = "opacity, transform";

        return {
            delay,
            duration,
            css: (t) => {
                const eased = 1 - Math.pow(1 - t, 3);
                return `
                    opacity: ${eased * o};
                    transform: translateY(${(1 - eased) * y}px);
                `;
            },
            tick: (t) => {
                if (t === 1) {
                    node.style.willChange = "auto";
                }
            },
        };
    }

    function setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const id = element.dataset.animateId;
                        if (id && !visibleElements.has(id)) {
                            visibleElements.add(id);
                            element.classList.add("animate-in");
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
        );

        document.querySelectorAll("[data-animate-id]").forEach((el) => {
            observer.observe(el);
        });
    }
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
                class="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -top-12 w-[780px] max-w-none opacity-80 mix-blend-soft-light z-0 sm:-top-16 sm:w-[860px] md:-top-24 md:w-[1000px] lg:-top-32 lg:w-[1180px] shape-glow-soft w-[280px] sm:w-[520px] md:w-[820px] lg:w-[1000px] -top-3 sm:-top-6 md:-top-8 lg:-top-10 max-w-full object-contain"
                data-animate-id="home-shape"
                in:fadeFly={{ duration: 320, delay: 120, y: 10 }}
            />

            <h2
                class="relative leading-normal mt-10 z-10 text-xl md:text-3xl font-bold text-center text-white mb-6 drop-shadow-md headline-glow sm:text-3xl lg:text-4xl sm:mt-20"
                data-animate-id="home-title"
                in:fadeFly={{ duration: 250, delay: 100, y: 20 }}
            >
                HAARP - Weather Monitoring System
            </h2>

            <p
                class="relative z-10 text-center text-gray-100 max-w-2xl text-lg leading-relaxed mb-12 md:mb-14 drop-shadow-sm text-sm sm:text-base md:text-lg lg:text-base leading-snug max-w-xs sm:max-w-md md:max-w-2xl"
                data-animate-id="home-desc"
                in:fadeFly={{ duration: 250, delay: 150, y: 20 }}
            >
                A smart environmental monitoring system that integrates
                electronics, sensors, and software to read, analyze, and
                visualize real-time climate data.
            </p>

            <button
                class="relative z-10 bg-[#8b3c59] mb-8 px-6 sm:px-7 py-3 rounded-full text-white text-sm sm:text-base font-semibold shadow-lg border border-white/30 hover:bg-[#a0516e] hover:shadow-2xl transition-colors transition-shadow duration-300 ease-in-out cursor-pointer"
                on:click={() => (window.location.href = "/weather")}
                use:useReveal
                in:fadeFly={{ duration: 250, delay: 170, y: 18 }}
            >
                Open Live Weather
            </button>


            <div
                class="relative z-10 glass p-8 rounded-2xl max-w-3xl w-full text-center mt-4 mb-16 animate-border-glow hover:scale-[1.01] transition-transform duration-400 w-full max-w-xs sm:max-w-xl md:max-w-2xl p-4 sm:p-6 md:p-8"
                data-animate-id="home-card"
                in:fadeFly={{ duration: 300, delay: 200, y: 30 }}
            >
                <h3
                    class="text-xl font-bold mb-6 text-white drop-shadow-sm text-lg sm:text-xl"
                    data-animate-id="home-card-title"
                    in:fadeFly={{ duration: 250, delay: 300, y: 15 }}
                >
                    What is HAARP ?
                </h3>
                <p
                    class="text-sm text-gray-100 mb-6 leading-relaxed text-sm leading-snug"
                    data-animate-id="home-card-desc"
                    in:fadeFly={{ duration: 250, delay: 350, y: 15 }}
                >
                    HAARP is a complete weather-monitoring solution designed to
                    collect four main environmental indicators:
                </p>
                <ul
                    class="flex flex-wrap justify-center gap-4 text-gray-100 font-medium mb-6"
                >
                    {#each ["🌡️ Temperature", "💧 Humidity", "☀️ Light Intensity", "🍃 Air Quality"] as pill, index}
                        <li
                            class="bg-white/10 px-4 py-1 rounded-full border border-white/20 hover:bg-white/20 hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-sm px-3 sm:px-4 py-1"
                            data-animate-id="home-pill-{index}"
                            in:fadeFly={{
                                duration: 200,
                                delay: 400 + index * 30,
                                y: 10,
                            }}
                        >
                            {pill}
                        </li>
                    {/each}
                </ul>
                <p
                    class="text-base text-gray-100 leading-relaxed"
                    data-animate-id="home-card-footer"
                    in:fadeFly={{ duration: 250, delay: 500, y: 15 }}
                >
                    These readings are processed by Arduino hardware, visualized
                    through a Java dashboard, and documented through this
                    website.
                </p>
            </div>
        {/if}
    </div>
</section>

{#if showWeatherPanel}
    <div class="fixed inset-0 z-50 flex justify-end">
        <div
            class="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            on:click={closeWeatherPanel}
        />
        <aside
            class="relative h-full w-[92%] sm:w-[400px] md:w-[420px] glass border border-white/25 shadow-2xl rounded-l-3xl px-6 sm:px-7 py-6 sm:py-8 overflow-y-auto"
            transition:fly={{ x: 420, duration: 250 }}
            use:useReveal
        >
            <div class="flex items-start justify-between gap-4 mb-6" use:useReveal>
                <div>
                    <p class="text-xs uppercase tracking-wide text-white/70">
                        Baghdad, IQ
                    </p>
                    <h3 class="text-xl font-bold text-white">Live Weather Dashboard</h3>
                </div>
                <button
                    class="text-white/80 hover:text-white rounded-full p-2 hover:bg-white/10 transition-colors"
                    aria-label="Close weather panel"
                    on:click={closeWeatherPanel}
                >
                    ✕
                </button>
            </div>

            {#if isLoading}
                <p class="text-white/80 text-sm" use:useReveal>
                    Loading live weather...
                </p>
            {:else if errorMessage}
                <div class="space-y-4" use:useReveal>
                    <p class="text-sm text-red-100">{errorMessage}</p>
                    <button
                        class="glass px-4 py-2 rounded-lg text-white text-sm font-semibold border border-white/30 hover:shadow-lg transition-shadow"
                        on:click={fetchWeather}
                    >
                        Retry
                    </button>
                </div>
            {:else if weatherData}
                <div class="grid gap-4" use:useReveal>
                    {#each weatherStats as stat (stat.label)}
                        <div class="glass rounded-xl border border-white/25 p-4 shadow-lg" use:useReveal>
                            <p class="text-xs text-white/70 uppercase tracking-wide">
                                {stat.label}
                            </p>
                            <p class="text-2xl font-semibold text-white mt-1">
                                {#if stat.value !== null}
                                    {stat.value}{stat.unit}
                                {:else}
                                    --
                                {/if}
                            </p>
                        </div>
                    {/each}
                </div>
            {/if}
        </aside>
    </div>
{/if}

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

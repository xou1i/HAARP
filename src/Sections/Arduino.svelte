<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let mounted = false;
    let visibleElements = new Set();

    onMount(() => {
        mounted = true;
        setupScrollAnimations();
    });

    // Optimized transition combining fade and fly (GPU accelerated) - faster
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

    // Scroll-triggered animations
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

    const hardware = [
        {
            title: "1. Arduino UNO — The Core Controller",
            content: [
                "The Arduino Uno serves as the central microcontroller responsible for:",
                "Reading sensor data",
                "Processing environmental signals",
                "Sending values to the Java dashboard",
                "Managing system timing and communication",
            ],
            emoji: "🤖",
        },
        {
            title: "2. MQ-135 Gas Sensor — Air Quality Detection",
            content: [
                "The MQ-135 measures air pollution and detects several gases, including:",
                "CO₂ (Carbon Dioxide)",
                "NH₃ (Ammonia)",
                "Benzene",
                "Alcohol vapors",
                "Smoke",
                "General airborne contaminants",
                "It provides a numerical Air Quality Index used to determine pollution levels.",
            ],
            emoji: "🌫️",
        },
        {
            title: "3. LDR Sensor — Light Intensity Measurement",
            content: [
                "The Light-Dependent Resistor (LDR) measures the amount of light reaching the sensor, enabling detection of:",
                "Sunlight strength",
                "Ambient brightness",
                "Day/Night conditions",
            ],
            emoji: "☀️",
        },
        {
            title: "4. DHT22 — Temperature & Humidity Sensor",
            content: [
                "The primary environmental sensor in the system. It provides:",
                "Temperature (°C)",
                "Relative Humidity (%)",
                "This sensor supplies the core climate metrics used by the monitoring software.",
            ],
            emoji: "🌡️",
        },
    ];
</script>

<section
    id="Arduino"
    class="min-h-screen py-24 px-4 relative flex flex-col items-center"
>
    <div class="max-w-4xl w-full">
        {#if mounted}
            <!-- HEADLINE (Smaller) -->
            <h2
                class="leading-normal text-2xl mt-30 md:text-4xl font-bold text-center text-white mb-12 drop-shadow-md headline-glow"
                data-animate-id="arduino-title"
                in:fadeFly={{ duration: 1000, delay: 300, y: 30 }}
            >
                Arduino Hardware System Overview
            </h2>

            <!-- Grid Layout (Small, centered, symmetric)-->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each hardware as item, index}
                    <div
                        class="glass p-6 rounded-xl flex flex-col h-full hover:scale-[1.02] transition-transform duration-500 animate-border-glow shadow-sm"
                        data-animate-id="arduino-card-{index}"
                        in:fadeFly={{
                            duration: 1000,
                            delay: 500 + index * 150,
                            y: 40,
                        }}
                    >
                        <div
                            class="flex items-center gap-3 mb-3 border-b border-white/20 pb-2"
                            data-animate-id="arduino-card-header-{index}"
                            in:fadeFly={{
                                duration: 800,
                                delay: 700 + index * 150,
                                y: 20,
                            }}
                        >
                            <span class="text-2xl filter drop-shadow-sm"
                                >{item.emoji}</span
                            >
                            <h3
                                class="text-lg font-bold text-white drop-shadow-sm leading-tight"
                            >
                                {item.title}
                            </h3>
                        </div>

                        <ul class="space-y-1.5 flex-grow text-gray-100">
                            {#each item.content as line, lineIndex}
                                <li
                                    class="flex items-start text-sm leading-relaxed"
                                    data-animate-id="arduino-line-{index}-{lineIndex}"
                                    in:fadeFly={{
                                        duration: 800,
                                        delay:
                                            800 + index * 150 + lineIndex * 100,
                                        y: 10,
                                    }}
                                >
                                    <span
                                        class="mr-2 opacity-60 mt-1.5 w-1 h-1 rounded-full bg-white shrink-0"
                                    ></span>
                                    {line}
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

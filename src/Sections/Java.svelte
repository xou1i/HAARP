<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import code2 from "../assets/code(2).png";
    import code3 from "../assets/code(3).png";

    let mounted = false;
    let visibleElements = new Set();

    onMount(() => {
        mounted = true;
        setupScrollAnimations();
    });

    // Fade-only transition for background images
    function fadeOnly(node, { delay = 0, duration = 250 } = {}) {
        const o = +getComputedStyle(node).opacity;
        node.style.willChange = "opacity";

        return {
            delay,
            duration,
            css: (t) => {
                const eased = 1 - Math.pow(1 - t, 3);
                return `opacity: ${eased * o};`;
            },
            tick: (t) => {
                if (t === 1) {
                    node.style.willChange = "auto";
                }
            },
        };
    }

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

    // Content kept exactly as defined
    const features = [
        {
            title: "1. Serial Communication",
            content: [
                "Using the jSerialComm library, the program:",
                "Connects to COM4 at 9600 baud",
                "Continuously receives data frames",
                "Validates formatted lines (e.g., T:25.5,H:40.0,L:200,AQ:10)",
                "Parses the values and converts them into usable data points",
            ],
        },
        {
            title: "2. Real-Time Visualization with JavaFX",
            content: [
                "The dashboard includes responsive LineCharts updated using Platform.runLater() to ensure:",
                "Smooth real-time graph updates",
                "Accurate time-based plotting",
                "Safe UI operations within the JavaFX Application Thread",
            ],
        },
        {
            title: "3. CSV Data Export",
            content: [
                "The system automatically records each reading into a CSV file with:",
                "Timestamp",
                "Temperature",
                "Humidity",
                "Light",
                "Air Quality",
                "This allows later analysis and report generation.",
            ],
        },
        {
            title: "4. Multithreading for Performance",
            content: [
                "The data-reading loop runs on a background thread to ensure:",
                "A smooth and responsive user interface",
                "Continuous data acquisition",
                "Safe shutdown of the serial port when stopped",
            ],
        },
    ];
</script>

<section
    id="Java"
    class="min-h-screen py-24 px-4 relative overflow-hidden flex flex-col items-center"
>
    <!-- Floating Background Icons (New Assets, distributed, low opacity) -->
    {#if mounted}
        <div class="absolute inset-0 pointer-events-none z-0">
            <!-- Top Left -->
            <img
                src={code2}
                alt=""
                class="absolute w-20 h-20 opacity-[0.1] top-20 left-10 animate-float-delayed"
                style="filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 0 }}
            />
            <!-- Bottom Right -->
            <img
                src={code3}
                alt=""
                class="absolute w-16 h-16 opacity-[0.1] bottom-32 right-20 animate-float"
                style="filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 200 }}
            />
            <!-- Center Left -->
            <img
                src={code2}
                alt=""
                class="absolute w-24 h-24 opacity-[0.1] top-1/3 left-1/4 animate-float-delayed"
                style="transform: rotate(15deg); filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 400 }}
            />
            <!-- Center Right -->
            <img
                src={code3}
                alt=""
                class="absolute w-14 h-14 opacity-[0.1] top-1/4 right-1/4 animate-float"
                style="filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 600 }}
            />
            <!-- Bottom Left -->
            <img
                src={code2}
                alt=""
                class="absolute w-18 h-18 opacity-[0.1] bottom-20 left-20 animate-float-delayed"
                style="transform: rotate(-10deg); filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 800 }}
            />

            <!-- NEW ICONS ADDED -->
            <!-- Top Center-Right -->
            <img
                src={code3}
                alt=""
                class="absolute w-12 h-12 opacity-[0.1] top-10 right-1/3 animate-float"
                style="transform: rotate(45deg); filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 1000 }}
            />
            <!-- Middle Center -->
            <img
                src={code2}
                alt=""
                class="absolute w-28 h-28 opacity-[0.1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-delayed"
                style="filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 1200 }}
            />
            <!-- Bottom Left-Center -->

            <!-- Top Right Corner -->
            <img
                src={code2}
                alt=""
                class="absolute w-20 h-20 opacity-[0.1] top-5 right-5 animate-float-delayed"
                style="filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 1400 }}
            />
            <!-- Bottom Center -->
            <img
                src={code3}
                alt=""
                class="absolute w-16 h-16 opacity-[0.1] bottom-5 right-1/3 animate-float"
                style="transform: rotate(30deg); filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 1600 }}
            />
            <!-- Far Left Middle -->
            <img
                src={code2}
                alt=""
                class="absolute w-16 h-16 opacity-[0.1] top-2/3 left-5 animate-float-delayed"
                style="transform: rotate(-15deg); filter: brightness(0) invert(1);"
                in:fadeOnly={{ duration: 1500, delay: 1800 }}
            />
        </div>
    {/if}

    <div class="max-w-5xl w-full z-10">
        {#if mounted}
            <!-- HEADLINE (Smaller) -->
            <h2
                class="text-2xl mt-30 md:text-4xl font-bold text-center text-white mb-12 drop-shadow-md"
                data-animate-id="java-title"
                in:fadeFly={{ duration: 1000, delay: 300, y: 30 }}
            >
                Programming (Java) — Weather Dashboard
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each features as feature, index}
                    <div
                        class="glass p-6 rounded-xl flex flex-col h-full hover:scale-[1.02] transition-transform duration-500 animate-border-glow shadow-sm"
                        data-animate-id="java-card-{index}"
                        in:fadeFly={{
                            duration: 1000,
                            delay: 500 + index * 150,
                            y: 40,
                        }}
                    >
                        <h3
                            class="text-lg font-bold mb-3 text-white drop-shadow-sm border-b border-white/20 pb-2"
                            data-animate-id="java-card-title-{index}"
                            in:fadeFly={{
                                duration: 800,
                                delay: 700 + index * 150,
                                y: 20,
                            }}
                        >
                            {feature.title}
                        </h3>

                        <ul class="space-y-1.5 grow">
                            {#each feature.content as line, lineIndex}
                                <li
                                    class="flex items-start text-gray-100 text-sm leading-relaxed"
                                    data-animate-id="java-line-{index}-{lineIndex}"
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

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

    const teams = [
        {
            title: "Arduino",
            members: [
                "Mustafa Ahmed Hussein",
                "Mohammed Ali Haider",
                "Maryam Aysir",
            ],
        },
        {
            title: "Java & C++",
            members: [
                "Ahmed Hassan Neamah",
                "Mohammed Ghassan Khaleel",
                "Mohammed Abdullah Abed",
            ],
        },
        {
            title: "Web Development & Design",
            members: ["Ghaith Ali Shayea", "Maryam Alaa Abd Al-Khaleq"],
        },
        {
            title: "Other Members",
            members: [
                "Ahmed Omar",
                "Mazin Omar Hamid",
                "Mustafa Yasser Malik",
                "Mohammed Ayad Hadi",
                "Karrar Kamil Hashim",
                "Mohammed Haqi Ismael",
                "Rawan Thamer Saadoun",
            ],
        },
    ];
</script>

<section
    id="Team"
    class="min-h-screen py-24 px-4 relative flex flex-col items-center"
>
    <div class="max-w-5xl w-full">
        {#if mounted}
            <!-- HEADLINE (Smaller) -->
            <h2
                class="leading-normal text-2xl mt-30 md:text-4xl font-bold text-center text-white mb-12 drop-shadow-md headline-glow"
                data-animate-id="team-title"
                in:fadeFly={{ duration: 1000, delay: 300, y: 30 }}
            >
                Team Members of the Project
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {#each teams as team, index}
                    <div
                        class="glass p-8 rounded-xl flex flex-col h-full hover:scale-[1.01] transition-transform duration-500 animate-border-glow"
                        data-animate-id="team-card-{index}"
                        in:fadeFly={{
                            duration: 1200,
                            delay: 500 + index * 200,
                            y: 40,
                        }}
                    >
                        <h3
                            class="text-lg font-bold mb-4 text-white border-b border-white/20 pb-3 inline-block"
                            data-animate-id="team-card-title-{index}"
                            in:fadeFly={{
                                duration: 800,
                                delay: 700 + index * 200,
                                y: 20,
                            }}
                        >
                            {team.title}
                        </h3>

                        <ul class="flex flex-col gap-2">
                            <!-- One name per line, smooth hover on names -->
                            {#each team.members as member, memberIndex}
                                <li
                                    class="flex items-center text-gray-100 text-base py-1 px-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] cursor-default"
                                    data-animate-id="team-member-{index}-{memberIndex}"
                                    in:fadeFly={{
                                        duration: 800,
                                        delay:
                                            900 +
                                            index * 200 +
                                            memberIndex * 100,
                                        y: 10,
                                    }}
                                >
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-white/60 mr-3"
                                    ></span>
                                    <span>{member}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

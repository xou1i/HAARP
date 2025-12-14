<script>
    import { onMount } from "svelte";
    import { useReveal } from "../lib/useReveal.js";

    const iraqLocations = {
        baghdad: { lat: 33.3152, lon: 44.3661 },
        basra: { lat: 30.5081, lon: 47.7835 },
        mosul: { lat: 36.34, lon: 43.13 },
        erbil: { lat: 36.1911, lon: 44.0092 },
        sulaymaniyah: { lat: 35.5612, lon: 45.4309 },
        duhok: { lat: 36.8671, lon: 43.0086 },
        kirkuk: { lat: 35.4681, lon: 44.3922 },
        najaf: { lat: 32.0, lon: 44.33 },
        karbala: { lat: 32.616, lon: 44.024 },
        babil: { lat: 32.4829, lon: 44.4329 },
        diyala: { lat: 33.7733, lon: 45.1494 },
        anbar: { lat: 33.3558, lon: 43.786 },
        salahaddin: { lat: 34.5333, lon: 43.4833 },
        wasit: { lat: 32.5167, lon: 45.8167 },
        maysan: { lat: 31.8333, lon: 47.1667 },
        dhiqar: { lat: 31.0429, lon: 46.2676 },
        nineveh: { lat: 36.3, lon: 43.1 },
        alqadisiyah: { lat: 31.9889, lon: 44.925 },
    };

    const governorateList = Object.entries(iraqLocations).map(([key, coords]) => ({
        key,
        label:
            key === "salahaddin"
                ? "Salahaddin"
                : key === "dhiqar"
                  ? "Dhi Qar"
                  : key === "alqadisiyah"
                    ? "Al-Qadisiyah"
                    : capitalize(key),
        ...coords,
    }));

    let selectedKey = "baghdad";
    let searchQuery = "";
    let weather = null;
    let isLoading = false;
    let error = "";

    const hourlyKeys = {
        temperature: "temperature_2m",
        humidity: "relative_humidity_2m",
        wind: "wind_speed_10m",
    };

    onMount(() => {
        fetchWeather(selectedKey);
    });

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function fetchWeather(key) {
        const location = iraqLocations[key];
        if (!location) return;

        isLoading = true;
        error = "";
        weather = null;

        const params =
            "hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover,precipitation,surface_pressure,uv_index&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover,precipitation,surface_pressure,uv_index&timezone=auto";
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&${params}`;

        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch weather");
            }
            const data = await res.json();
            weather = data;
        } catch (err) {
            console.error("Weather fetch error", err);
            error = "Unable to load live weather. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    function selectGovernorate(key) {
        selectedKey = key;
        fetchWeather(key);
    }

    $: filteredGovernorates =
        searchQuery.trim().length === 0
            ? governorateList
            : governorateList.filter((g) =>
                    g.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
                );

    $: current = weather?.current ?? null;
    $: hourly = weather?.hourly ?? null;

    function toKmH(value) {
        return value != null ? (value * 3.6).toFixed(1) : null;
    }

    function formatValue(value, suffix = "") {
        if (value === null || value === undefined || Number.isNaN(value)) return "--";
        return `${value}${suffix}`;
    }

    function buildLinePath(values, width = 640, height = 240, padding = 18) {
        if (!values || values.length < 2) return "";
        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = max - min || 1;
        return values
            .map((val, idx) => {
                const x =
                    padding + (idx / (values.length - 1)) * (width - padding * 2);
                const y =
                    height -
                    padding -
                    ((val - min) / span) * (height - padding * 2);
                return `${idx === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
            })
            .join(" ");
    }

    $: chartData = {
        temperature: hourly?.[hourlyKeys.temperature]?.slice(0, 24) ?? [],
        wind: hourly?.[hourlyKeys.wind]?.slice(0, 24) ?? [],
        humidity: hourly?.[hourlyKeys.humidity]?.slice(0, 24) ?? [],
    };

    const chartConfigs = [
        { key: "temperature", title: "Temperature (°C)", color: "rgba(255,255,255,0.9)", label: "°C" },
        { key: "wind", title: "Wind Speed (m/s)", color: "rgba(255,255,255,0.75)", label: "m/s" },
        { key: "humidity", title: "Humidity (%)", color: "rgba(255,255,255,0.8)", label: "%", full: true },
    ];
</script>

<section class="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-12">
    <div class="w-full max-w-6xl mx-auto space-y-10 text-white">
        <div class="text-center space-y-3" use:useReveal>
            <p class="text-sm uppercase tracking-[0.3em] text-white/70">
                {capitalize(selectedKey)}, Iraq
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold headline-glow">
                Iraq Live Weather Dashboard
            </h1>
            <p class="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
                Choose a governorate to load real-time metrics and hourly trends powered by Open-Meteo.
            </p>
        </div>

        <div class="glass  rounded-2xl border border-white/30 p-5 sm:p-6 shadow-xl space-y-4 font-['Lexend']" use:useReveal>
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="flex-1 space-y-2">
                    <label class="text-xs uppercase tracking-wide text-white/70">Search governorates</label>
                    <input
                        class="w-full glass rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/60"
                        type="text"
                        placeholder="Search other cities…"
                        bind:value={searchQuery}
                    />
                </div>
                <!-- <div class="flex items-center gap-2 text-sm sm:text-base text-white/80">
                    <span class="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                        Default: Baghdad
                    </span>
                </div> -->
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-h-64 overflow-y-auto pr-4 governorate-scroll">
                {#each filteredGovernorates as gov (gov.key)}
                    <button
                        class={`bg-[#9a5970] w-full text-left px-5 py-4 rounded-xl border ${selectedKey === gov.key ? "border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.25)]" : "border-white/25 shadow-lg"} transition-all duration-300 ease-out hover:shadow-xl hover:bg-white/20 duration-300 hover:backdrop-blur-md`}
                        on:click={() => selectGovernorate(gov.key)}
                        use:useReveal
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="space-y-1">
                                <p class="text-base sm:text-lg font-semibold leading-tight">{gov.label}</p>
                                <p class="text-xs sm:text-sm text-white/70">
                                    Lat {gov.lat.toFixed(2)} · Lon {gov.lon.toFixed(2)}
                                </p>
                            </div>
                            {#if selectedKey === gov.key}
                                <span class="text-sm px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                                    Selected
                                </span>
                            {/if}
                        </div>
                    </button>
                {/each}
            </div>
        </div>

        <div class="space-y-6">
            {#if isLoading}
                <div class="text-center text-white/80" use:useReveal>
                    Loading live weather...
                </div>
            {:else if error}
                <div class="glass p-4 rounded-xl border border-white/30 text-center space-y-3" use:useReveal>
                    <p class="text-red-100 text-sm">{error}</p>
                    <button
                        class="glass px-4 py-2 rounded-lg text-white text-sm font-semibold border border-white/30 hover:shadow-lg transition-shadow"
                        on:click={() => fetchWeather(selectedKey)}
                    >
                        Retry
                    </button>
                </div>
            {:else if weather}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="glass p-6 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Temperature</p>
                        <p class="text-3xl font-bold mt-2">{formatValue(current?.temperature_2m, "°C")}</p>
                    </div>
                    <div class="glass p-6 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Humidity</p>
                        <p class="text-3xl font-bold mt-2">{formatValue(current?.relative_humidity_2m, "%")}</p>
                    </div>
                    <div class="glass p-6 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Wind Speed</p>
                        <p class="text-3xl font-bold mt-2">
                            {toKmH(current?.wind_speed_10m) !== null
                                ? `${toKmH(current?.wind_speed_10m)} km/h`
                                : "--"}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div class="glass p-4 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Cloud Cover</p>
                        <p class="text-xl font-semibold mt-1">{formatValue(current?.cloud_cover, "%")}</p>
                    </div>
                    <div class="glass p-4 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Precipitation</p>
                        <p class="text-xl font-semibold mt-1">{formatValue(current?.precipitation, " mm")}</p>
                    </div>
                    <div class="glass p-4 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Pressure</p>
                        <p class="text-xl font-semibold mt-1">{formatValue(current?.surface_pressure, " hPa")}</p>
                    </div>
                    <div class="glass p-4 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">UV Index</p>
                        <p class="text-xl font-semibold mt-1">{formatValue(current?.uv_index)}</p>
                    </div>
                    <div class="glass p-4 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow" use:useReveal>
                        <p class="text-xs uppercase tracking-wide text-white/70">Wind (m/s)</p>
                        <p class="text-xl font-semibold mt-1">{formatValue(current?.wind_speed_10m, " m/s")}</p>
                    </div>
                </div>

                <div class="space-y-3" use:useReveal>
                    <h2 class="text-2xl font-bold headline-glow text-center">Hourly Weather Trends</h2>
                    <p class="text-center text-white/70 text-sm max-w-2xl mx-auto">
                        Last 24 hours of temperature, wind speed, and humidity.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each chartConfigs as chart (chart.key)}
                        <div
                            class={`glass p-5 rounded-xl border border-white/30 shadow-lg hover:shadow-2xl transition-shadow ${chart.full ? "md:col-span-2" : ""}`}
                            use:useReveal
                        >
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-lg font-semibold">{chart.title}</h3>
                                <span class="text-xs text-white/60">Last 24h</span>
                            </div>
                            {#if chartData[chart.key]?.length > 1}
                                <div class="w-full h-56">
                                    <svg viewBox="0 0 640 240" preserveAspectRatio="none" class="w-full h-full">
                                        <defs>
                                            <linearGradient id={`grad-${chart.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stop-color={chart.color} stop-opacity="0.8" />
                                                <stop offset="100%" stop-color={chart.color} stop-opacity="0.1" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d={buildLinePath(chartData[chart.key])}
                                            fill="none"
                                            stroke={chart.color}
                                            stroke-width="3"
                                            class="chart-line"
                                        />
                                        <path
                                            d={`${buildLinePath(chartData[chart.key])} V240 H0 Z`}
                                            fill={`url(#grad-${chart.key})`}
                                            opacity="0.35"
                                        />
                                    </svg>
                                </div>
                                <div class="flex items-center justify-between text-xs text-white/60 mt-2">
                                    <span>Min {Math.min(...chartData[chart.key]).toFixed(1)}{chart.label}</span>
                                    <span>Max {Math.max(...chartData[chart.key]).toFixed(1)}{chart.label}</span>
                                </div>
                            {:else}
                                <p class="text-white/70 text-sm">Not enough data to display chart.</p>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</section>

<style>
    .chart-line {
        stroke-dasharray: 900;
        stroke-dashoffset: 900;
        animation: drawLine 1.2s ease-out forwards;
    }

    @keyframes drawLine {
        to {
            stroke-dashoffset: 0;
        }
    }

    :global(.governorate-scroll::-webkit-scrollbar) {
        width: 6px;
    }
    :global(.governorate-scroll::-webkit-scrollbar-thumb) {
        background: rgba(255, 255, 255, 0.25);
        border-radius: 20px;
    }
    :global(.governorate-scroll::-webkit-scrollbar-thumb:hover) {
        background: rgba(255, 255, 255, 0.45);
    }
</style>

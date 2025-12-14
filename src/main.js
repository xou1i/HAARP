import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import Weather from "./Pages/Weather.svelte";

const target = document.getElementById("app");
const path = window.location.pathname;

const app = mount(path === "/weather" ? Weather : App, {
    target,
});

export default app;

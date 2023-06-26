import Sketch from "./app.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let animation = new Sketch({
    dom: document.getElementById("container")
});

gsap.to(animation.settings, {
    duration: 3,
    progress: 1,
    ease: "expo.inOut"
})
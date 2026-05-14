"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

// Register at module load so any client component importing from here gets
// plugins ready before its useEffect runs (child effects fire before parent).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText, Flip);
}

export function registerGsap() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText, Flip);
}

export { gsap, ScrollTrigger, TextPlugin, SplitText, Flip };

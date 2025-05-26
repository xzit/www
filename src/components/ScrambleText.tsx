import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

export default function ScrambleText({
  text,
  chars,
}: {
  text: string;
  chars?: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.to(headingRef.current, {
      duration: 1,
      scrambleText: {
        text: text || "",
        chars: chars || "upperCase",
      },
      onComplete: () => {},
    });
  });

  useGSAP(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const glitch = () => {
      if (!headingRef.current) return;

      // Glitch temporal
      gsap.to(headingRef.current, {
        duration: 0.3,
        ease: "sine.in",
        scrambleText: {
          text: text || "",
          chars: chars || "upperCase",
          speed: 0,
          revealDelay: 0.3,
        },
      });

      // Próximo glitch aleatorio entre 3 y 5 segundos
      const nextGlitchIn = 3000 + Math.random() * 5000;
      timeoutId = setTimeout(glitch, nextGlitchIn);
    };

    // Inicia el primer glitch aleatorio
    const initialDelay = 3000 + Math.random() * 5000;
    timeoutId = setTimeout(glitch, initialDelay);

    return () => clearTimeout(timeoutId);
  });

  return <span ref={headingRef}>{text}</span>;
}

import { useRef, useState } from "react";
// Utilisation directe du logo depuis public/

interface Props {
  onDone: () => void;
}

const FADE_DURATION_S = 1.6; // secondes

export function IntroScreen({ onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const fadeTriggered = useRef(false);

  const handleEnter = async () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.currentTime = 0;
    try {
      await video.play();
    } catch {
      setStarted(false);
    }
  };

  const startFade = () => {
    if (fadeTriggered.current) return;
    fadeTriggered.current = true;
    const video = videoRef.current;
    setFadingOut(true);

    // Fade audio progressif sur la même durée
    if (video && !video.muted && video.volume > 0) {
      const initialVolume = video.volume;
      const step = initialVolume / ((FADE_DURATION_S * 1000) / 16);
      const tick = setInterval(() => {
        if (!videoRef.current) return clearInterval(tick);
        const next = videoRef.current.volume - step;
        if (next <= 0) {
          videoRef.current.volume = 0;
          clearInterval(tick);
        } else {
          videoRef.current.volume = next;
        }
      }, 16);
    }

    setTimeout(onDone, FADE_DURATION_S * 1000);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    // Déclenche le fade FADE_DURATION_S secondes avant la fin
    if (video.currentTime >= video.duration - FADE_DURATION_S) {
      startFade();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] overflow-hidden bg-black transition-opacity"
      style={{
        opacity: fadingOut ? 0 : 1,
        transitionDuration: `${FADE_DURATION_S}s`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/opening_marsai.mp4"
        preload="auto"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={startFade}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div
        className={[
          "relative z-10 flex min-h-full flex-col items-center justify-center px-4 sm:px-6 text-center transition-opacity duration-500",
          started ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <img
          src="/mars_ai_logo.png"
          alt="marsAI"
          className="mb-4 w-[clamp(180px,50vw,320px)] max-w-full object-contain drop-shadow-[0_0_35px_rgba(255,92,53,0.35)]"
        />
        <div className="mb-8 f-orb text-[clamp(1.7rem,6vw,2.4rem)] font-black leading-none tracking-[0.06em]">
          <span className="text-white">MARS</span>
          <span className="text-[#ff5c35]">AI</span>
        </div>
        <button
          type="button"
          onClick={handleEnter}
          className="f-orb rounded-xl border border-[#7d71fb]/70 bg-[#05030d]/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-[#ff5c35] hover:bg-[#0c0820]/85 sm:px-8 sm:py-4 sm:text-sm"
        >
          Entrez sur le site
        </button>
      </div>
    </div>
  );
}

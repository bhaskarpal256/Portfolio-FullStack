import { useEffect } from "react";

const LoadingScreen = ({ title = "CASIO", subtitle = "INITIALIZING" }) => {
  return (
    <div
      className="
    flex
    items-center
    justify-center
    px-4
    py-36
  "
    >
      <div className="lcd-screen w-full max-w-md p-8 text-center ">
        <h1 className="casio-display text-[clamp(2.5rem,6vw,4rem)] mb-8">
          {title}
        </h1>

        <p className="tracking-[0.35em] text-sm opacity-70 mb-8">{subtitle}</p>

        <div className="h-3 border-2 border-black p-[2px] bg-[#d7e7af] mb-6 ">
          <div
            className="
              h-full
              bg-black
              animate-[loading_0.8s_linear_infinite]
            
            "
          />
        </div>

        <p className="casio-display text-xl lcd-blink">PLEASE WAIT...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

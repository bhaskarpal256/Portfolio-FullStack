import { useState, useEffect, useRef } from "react";

export const CasioSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? {
          value: option,
          label: option,
        }
      : option,
  );

  const selectedOption = normalizedOptions.find(
    (option) => option.value === value,
  );

  return (
    <div
      ref={wrapperRef}
      className="relative w-full min-w-0"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          casio-input
          w-full
          flex
          items-center
          justify-between
          cursor-pointer

          ${
            open
              ? "!rounded-b-none border-b-0"
              : ""
          }
        `}
      >
        <span
          className={`
            tracking-wider
            uppercase
            truncate

            ${
              selectedOption
                ? "text-black"
                : "text-black/50"
            }
          `}
        >
          {selectedOption?.label || placeholder}
        </span>

        <span
          className={`
            text-sm
            ml-4
            shrink-0
            transition-transform duration-200

            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            w-full

            z-[9999]

            bg-[radial-gradient(circle_at_center,#b8d6a8_0%,#a8c69b_45%,#8ea887_100%)]

            border-x-2
            border-b-2
            border-[#506050]

            rounded-b-md

            shadow-[0_0_18px_rgba(120,180,120,.45)]

            overflow-hidden
          "
        >
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`
                block
                w-full
                px-3
                py-2

                text-left

                transition-colors

                ${
                  value === option.value
                    ? "bg-[#5f735f] text-[#e8ffe8]"
                    : "hover:bg-[#4f5f4f] hover:text-[#d7ffd7]"
                }
              `}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider">
                  {option.label}
                </span>

                {value === option.value && (
                  <span>✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
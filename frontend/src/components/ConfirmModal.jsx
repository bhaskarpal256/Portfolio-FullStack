import { createPortal } from "react-dom";
import { useEffect } from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          casio-panel
          w-full
          max-w-md
          p-5
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* LCD SCREEN */}

        <div className="lcd-screen lcd-breathe">
          <div className="flex items-center justify-between mb-4">
            <span
              className="
                text-xs
                tracking-[0.25em]
                opacity-70
              "
            >
              SYSTEM WARNING
            </span>

            <span
              className="
                text-xs
                tracking-[0.2em]
                text-red-800
                font-bold
                animate-pulse
              "
            >
              DANGER
            </span>
          </div>

          <h3
            className="
              casio-display
              text-4xl
              leading-none
              mb-4
            "
          >
            DELETE?
          </h3>

          <div
            className="
              border-y
              border-[#5d6e5d]
              py-3
              text-sm
              tracking-wider
              break-words
            "
          >
            {message}
          </div>

          <div
            className="
              mt-4
              text-[11px]
              opacity-70
              tracking-[0.15em]
            "
          >
            THIS ACTION CANNOT BE UNDONE
          </div>
        </div>

        {/* BUTTONS */}

        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="
              casio-lcd-btn
              flex-1
              cursor-pointer
            "
          >
            CANCEL
          </button>

          <button
            onClick={onConfirm}
            className="casio-danger-btn flex-1 cursor-pointer"
          >
            DELETE
          </button>
        </div>

        <div
          className="
            text-center
            mt-4
            text-[10px]
            tracking-[0.2em]
            opacity-50
          "
        >
          ENTER = CONFIRM • ESC = CANCEL
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;

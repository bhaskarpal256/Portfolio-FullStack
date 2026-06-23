const SkillCard = ({ skill, onToggle, onEdit, onDelete }) => {
  return (
    <div
      className="
        lcd-screen
        p-4
        flex
        flex-col
        justify-between
        min-h-[260px]
        transition-all
        duration-300
        hover:scale-[1.02]
      "
    >
      {/* TOP */}
      <div>
        {/* HEADER */}
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <p
              className="
        text-[10px]
        tracking-[0.25em]
        opacity-70
        mb-2
      "
            >
              SKILL ENTRY
            </p>

            <h3
              className="
        casio-display
        text-3xl
        leading-none
        break-words
      "
            >
              {skill.name}
            </h3>
          </div>

          {/* CONTROL PANEL */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* DELETE */}
            <button
              type="button"
              onClick={() => onDelete(skill)}
              className="
        casio-delete-btn
        cursor-pointer
      "
            >
              ×
            </button>

            {/* STAR */}
            <button
              type="button"
              onClick={() => onToggle(skill)}
              className={`
        text-3xl
        leading-none
        transition-all
        duration-200
        cursor-pointer

        ${
          skill.isFeatured
            ? "text-[#3b4f26] drop-shadow-[0_0_8px_rgba(120,180,120,.8)]"
            : "opacity-50 hover:opacity-100"
        }
      `}
            >
              {skill.isFeatured ? "★" : "☆"}
            </button>
          </div>
        </div>

        {/* ICON */}
        <div
          className="
    flex
    justify-center
    items-center
    my-6
  "
        >
          <img
            src={skill.icon?.url}
            alt={skill.name}
            className="
      w-16
      h-16
      object-contain
    "
          />
        </div>

        {/* CATEGORY */}
        <div
          className="
            border-t
            border-b
            border-[#5d6e5d]
            py-2
            text-center
          "
        >
          <span
            className="
              text-xs
              tracking-[0.25em]
              font-bold
            "
          >
            {skill.category.toUpperCase()}
          </span>
        </div>

        {/* STATUS */}
        <div className="mt-4 text-center">
          <span
            className={`
              text-xs
              tracking-[0.2em]
              ${skill.isFeatured ? "text-[#3b4f26]" : "opacity-60"}
            `}
          >
            {skill.isFeatured ? "STARRED RECORD" : "STANDARD RECORD"}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="
          mt-5
          pt-4
          border-t
          border-[#5d6e5d]
        "
      >
        <button
          onClick={() => onEdit(skill)}
          className="
            casio-lcd-btn
            w-full
            cursor-pointer
          "
        >
          EDIT
        </button>
      </div>
    </div>
  );
};

export default SkillCard;

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onToggle,
}) => {
  return (
    <div
      className="
        lcd-screen
        p-4
        flex
        flex-col
        justify-between
        min-h-[340px]
        transition-all
        duration-300
        hover:scale-[1.02]
      "
    >
      {/* HEADER */}
      <div className="flex justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p
            className="
              text-[10px]
              tracking-[0.25em]
              opacity-70
              mb-2
            "
          >
            PROJECT ENTRY
          </p>

          <h3
            className="
              casio-display
              text-2xl
              leading-none
              break-words
            "
          >
            {project.title}
          </h3>
        </div>

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            shrink-0
          "
        >
          <button
            type="button"
            onClick={() => onDelete(project)}
            className="
              casio-delete-btn
              cursor-pointer
            "
          >
            ×
          </button>

          <button
            type="button"
            onClick={() => onToggle(project)}
            className={`
              text-3xl
              cursor-pointer
              transition-all
              duration-200

              ${
                project.isFeatured
                  ? "text-[#3b4f26] drop-shadow-[0_0_8px_rgba(120,180,120,.8)]"
                  : "opacity-50 hover:opacity-100"
              }
            `}
          >
            {project.isFeatured ? "★" : "☆"}
          </button>
        </div>
      </div>

      {/* IMAGE */}
      <div
  className="
    my-5
    overflow-hidden
    rounded
    border-2
    border-[#5d6e5d]
    shadow-[inset_0_0_12px_rgba(0,0,0,.15)]
  "
>
  {project.imageUrl?.url ? (
    <img
      src={project.imageUrl.url}
      alt={project.title}
      className="
        w-full
        aspect-video
        object-cover
      "
    />
  ) : (
    <div
      className="
        w-full
        aspect-video
        flex
        items-center
        justify-center
        opacity-50
        border-2
        border-dashed
        border-[#5d6e5d]
      "
    >
      NO IMAGE
    </div>
  )}
</div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <p
          className="
            text-sm
            leading-relaxed
            opacity-80
            line-clamp-3
          "
        >
          {project.description}
        </p>
      </div>

      {/* TECH STACK */}
      <div
        className="
          border-t
          border-b
          border-[#5d6e5d]
          py-2
          flex
          flex-wrap
          gap-2
          justify-center
        "
      >
        {project.techStack?.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="
              text-xs
              px-2
              py-1
              border
              border-[#5d6e5d]
            "
          >
            {tech.toUpperCase()}
          </span>
        ))}
      </div>

      {/* LINKS */}
      <div
        className="
          mt-4
          flex
          justify-center
          gap-4
          text-sm
        "
      >
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            GITHUB
          </a>
        )}

        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            LIVE
          </a>
        )}
      </div>

      {/* STATUS */}
      <div className="mt-4 text-center">
        <span
          className={`
            text-xs
            tracking-[0.2em]
            ${
              project.isFeatured
                ? "text-[#3b4f26]"
                : "opacity-60"
            }
          `}
        >
          {project.isFeatured
            ? "STARRED PROJECT"
            : "STANDARD PROJECT"}
        </span>
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
          onClick={() => onEdit(project)}
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

export default ProjectCard;
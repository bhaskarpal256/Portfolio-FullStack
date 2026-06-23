export default function LCDPanel({ children }) {
  return (
    <div
      className="
        bg-[var(--lcd-bg)]
        text-[var(--lcd-text)]
        border-2
        border-black
        rounded-md
        p-4
      "
    >
      {children}
    </div>
  );
}
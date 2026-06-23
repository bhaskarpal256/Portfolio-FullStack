export default function WatchFrame({ children }) {
  return (
    <div
      className="
        bg-gradient-to-b
        from-zinc-300
        via-zinc-500
        to-zinc-700
        p-4
        rounded-xl
        shadow-lg
      "
    >
      {children}
    </div>
  );
}
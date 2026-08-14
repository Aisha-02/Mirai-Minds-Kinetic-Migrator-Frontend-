export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-secondary/[0.07]" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-[150px]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,26,42,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,26,42,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />
    </div>
  );
}

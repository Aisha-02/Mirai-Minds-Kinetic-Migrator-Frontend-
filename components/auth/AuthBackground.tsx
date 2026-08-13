export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary mix-blend-screen blur-[120px] filter" />
      <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-secondary mix-blend-screen blur-[150px] filter" />
    </div>
  );
}

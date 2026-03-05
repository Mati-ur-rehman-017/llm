export function Header() {
  return (
    <header className="flex items-center gap-3 bg-emerald-700 px-6 py-3 text-white shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-700 font-bold text-lg">
        N
      </div>
      <div>
        <h1 className="text-lg font-semibold leading-tight">
          NUST Bank Assistant
        </h1>
        <p className="text-xs text-emerald-200">
          AI-powered customer support
        </p>
      </div>
    </header>
  );
}

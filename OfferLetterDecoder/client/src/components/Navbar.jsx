import { FileText, ArrowUpRight } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <FileText size={21} strokeWidth={2.3} />
          </div>

          <div>
            <h1 className="font-heading text-xl font-extrabold tracking-tight text-ink">
              Offer<span className="text-brand">Lens</span>
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-muted">
              Know your worth
            </p>
          </div>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <span className="hidden text-sm font-medium text-muted sm:block">
            Understand your offer. Make informed decisions.
          </span>

          <a
            href="#upload"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Get Started
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

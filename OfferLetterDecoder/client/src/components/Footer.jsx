import { FileText, ShieldCheck } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <FileText size={17} className="text-brand" />
          <span className="text-sm font-bold text-ink">OfferLens</span>
          <span className="text-xs text-muted">© 2026</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck size={15} className="text-green-600" />
          Your career decisions deserve clarity.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

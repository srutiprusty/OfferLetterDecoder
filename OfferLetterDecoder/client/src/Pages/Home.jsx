import {
  ArrowDown,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  FileSearch,
  Scale,
} from "lucide-react";

import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import Footer from "../components/Footer";

function Home({ onAnalyze }) {
  const features = [
    {
      icon: Wallet,
      title: "Know your in-hand salary",
      description: "Understand your actual monthly earnings after deductions.",
    },
    {
      icon: FileSearch,
      title: "Decode every clause",
      description: "Identify bonds, notice periods and hidden conditions.",
    },
    {
      icon: Scale,
      title: "Make informed decisions",
      description: "Understand your offer before signing the agreement.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main>
        {/* Hero section */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
            {/* Left content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-brand"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  Your offer. Decoded.
                </span>
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-[58px]">
                Your CTC isn't your{" "}
                <span className="text-brand">take-home.</span>
                <br />
                Know the difference.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
                Don't let confusing salary breakups or complicated employment
                clauses catch you off guard. Decode your offer letter and
                understand what you're really signing.
              </p>

              {/* Benefits */}
              <div className="mt-8 space-y-4">
                {[
                  "Calculate estimated monthly in-hand salary",
                  "Understand taxes and salary deductions",
                  "Spot bonds and potentially risky clauses",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-green-600"
                    />
                    <span className="text-sm font-medium text-ink sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#upload"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                Decode My Offer
                <ArrowDown size={17} />
              </a>

              <div className="mt-7 flex items-center gap-2 text-xs text-muted">
                <ShieldCheck size={16} className="text-green-600" />
                No account required · PDF only · Up to 10 MB
              </div>
            </div>

            {/* Right upload panel */}
            <div id="upload" className="scroll-mt-8">
              <FileUpload onAnalyze={onAnalyze} />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[2px] text-brand">
                Everything you need to know
              </p>

              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-ink">
                Understand your offer, not just the numbers.
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted">
                Get clarity on the financial and contractual details that matter
                before accepting a job.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-brand">
                      <Icon size={23} />
                    </div>

                    <h3 className="font-heading text-lg font-bold text-ink">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-muted">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-surface px-5 py-8">
          <div className="mx-auto flex max-w-5xl items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-5">
            <ShieldCheck size={21} className="mt-0.5 shrink-0 text-brand" />

            <div>
              <h3 className="text-sm font-bold text-ink">
                Important disclaimer
              </h3>
              <p className="mt-1 text-xs leading-6 text-muted">
                Salary calculations are estimates based on extracted information
                and stated assumptions. Actual salary, taxes and employment
                terms may differ. Always verify the details with your employer
                or HR team before making a decision.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;

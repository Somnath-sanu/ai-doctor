import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 shadow-sm">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              MEDIVA AI
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold tracking-wide text-emerald-400">
                404 · Page not found
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                We could not find that clinical workspace.
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                The link you followed might be broken or the page may have been
                moved. Return to your MEDIVA AI dashboard to continue your work.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-3 justify-center sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Go back home
              </Link>
              <Link
                href="/consultations"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition-colors"
              >
                Open consultations
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="h-px w-8 bg-slate-800" />
              <span>MEDIVA AI · Intelligent medical reporting</span>
              <span className="h-px w-8 bg-slate-800" />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}


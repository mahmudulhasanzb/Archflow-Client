import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
        <FileQuestion className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-3 text-base text-slate-600 max-w-md">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

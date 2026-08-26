export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 py-6 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 text-sm text-black/60 sm:flex-row sm:px-6 dark:text-white/50">
        <p>
          © {year} IBEROGO. Built as part of the IBERO Build Discipline
          course.
        </p>
        <a
          href="https://github.com/REPLACE_ME/iberogo"
          target="_blank"
          rel="noreferrer"
          className="hover:text-emerald-600"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
}

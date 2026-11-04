export function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        © <CopyrightYear /> Utsho. Built by neighbours, for neighbours.
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

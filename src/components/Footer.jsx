const CATEGORIES = ['Rings', 'Earrings', 'Pendants', 'Bracelets', 'Anklets', 'Sets', 'Toe Rings', 'Silver Rakhi'];
const COLLECTIONS = ['Everyday Essentials', 'Bloom', 'Heart Stories', 'Bandhan'];

export default function Footer() {
  return (
    <footer className="absolute bottom-14 inset-x-0 z-10 pointer-events-none hidden md:block">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <p className="text-[11px] text-charcoal-700/60 leading-relaxed">
          Aajiva · 925 sterling silver · skin-safe · made for every day
          <span className="mx-2">·</span>
          <a href="https://aajiva.com" target="_blank" rel="noreferrer" className="pointer-events-auto underline underline-offset-2 hover:text-charcoal-900">aajiva.com</a>
          <span className="mx-2">·</span>
          <a href="https://instagram.com/aajivaa" target="_blank" rel="noreferrer" className="pointer-events-auto underline underline-offset-2 hover:text-charcoal-900">@aajivaa</a>
        </p>
        <p className="text-[10px] text-charcoal-700/45 mt-1 hidden md:block">
          {CATEGORIES.join(' · ')} — {COLLECTIONS.join(' · ')}
        </p>
        <p className="text-[10px] text-charcoal-700/45 mt-1">
          3D concept preview · checkout on aajiva.com
        </p>
      </div>
    </footer>
  );
}

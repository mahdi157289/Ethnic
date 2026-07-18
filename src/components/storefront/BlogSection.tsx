import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

// Strip HTML tags to build a clean excerpt from the post content
function excerpt(content: string, max = 160): string {
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

// Format a "DD/MM/YYYY" date into a readable French label
function formatDate(raw: string): string {
  const parts = raw.split('/');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  return raw;
}

// Simple reading-time estimate (French)
function readingTime(content: string): string {
  const words = excerpt(content, 100000).split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min`;
}

export function BlogSection() {
  const { blogPosts } = useStore();
  const sectionRef = useRef<HTMLElement>(null);

  if (blogPosts.length === 0) {
    return (
      <section id="blog" ref={sectionRef} className="relative py-24 px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-[var(--charcoal)] mb-4">
            Notre Journal
          </h2>
          <p className="text-[var(--charcoal)]/60">Aucun article pour le moment.</p>
        </div>
      </section>
    );
  }

  const [featured, ...others] = blogPosts;

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="relative py-24 px-6 bg-[var(--cream)]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-xs mb-4">
            Journal
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--charcoal)]">
            Nos Derniers Articles
          </h2>
          <div className="mt-5 h-px w-24 bg-[var(--gold)]" />
        </div>

        {/* Featured (large, full-width editorial hero of the blog) */}
        <Link
          to={`/blog/${featured.id}`}
          className="group cursor-pointer block mb-12"
        >
          <article className="relative overflow-hidden rounded-3xl border border-[var(--gold)] bg-white grid grid-cols-1 lg:grid-cols-2">
            <div className="img-zoom h-72 lg:h-[28rem] w-full">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--gold)] mb-4">
                <span>À la une</span>
                <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                <span>{formatDate(featured.createdAt)}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                <span>{readingTime(featured.content)} de lecture</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-[var(--charcoal)] mb-4 group-hover:text-[var(--gold)] transition-colors duration-300">
                {featured.title}
              </h3>
              <p className="text-[var(--charcoal)]/70 leading-relaxed text-lg">
                {excerpt(featured.content, 240)}
              </p>
              <span className="inline-flex items-center gap-2 mt-6 text-sm text-[var(--gold)] font-medium">
                Lire l'article
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                </svg>
              </span>
            </div>
          </article>
        </Link>

        {/* All remaining articles in an editorial responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group cursor-pointer block h-full"
            >
              <article className="flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--gold)] bg-white hover:bg-[var(--beige)] transition-colors duration-300">
                <div className="img-zoom h-56 w-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--gold)] mb-3">
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                    <span>{readingTime(post.content)}</span>
                  </div>
                  <h4 className="font-display text-xl text-[var(--charcoal)] leading-snug mb-2 group-hover:text-[var(--gold)] transition-colors duration-300">
                    {post.title}
                  </h4>
                  <p className="text-sm text-[var(--charcoal)]/60 leading-relaxed line-clamp-3 flex-1">
                    {excerpt(post.content, 140)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm text-[var(--gold)] font-medium">
                    Lire
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* All articles link */}
        <div className="text-center mt-14">
          <Link to="/blog" className="forma-btn-outline cursor-pointer">
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
}

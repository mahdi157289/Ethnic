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

export function BlogSection() {
  const { blogPosts } = useStore();
  const sectionRef = useRef<HTMLElement>(null);

  const featured = blogPosts[0];
  const rest = blogPosts.slice(1, 4);

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

        {blogPosts.length === 0 ? (
          <p className="text-center text-[var(--charcoal)]/60">
            Aucun article pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Featured article */}
            {featured && (
              <Link
                to={`/blog/${featured.id}`}
                className="lg:col-span-7 group cursor-pointer block"
              >
                <article className="relative overflow-hidden rounded-2xl border border-[var(--gold)] bg-white">
                  <div className="img-zoom h-72 md:h-96 w-full">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--gold)] mb-3">
                      <span>À la une</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                      <span>{formatDate(featured.createdAt)}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-[var(--charcoal)] mb-3 group-hover:text-[var(--gold)] transition-colors duration-300">
                      {featured.title}
                    </h3>
                    <p className="text-[var(--charcoal)]/70 leading-relaxed">
                      {excerpt(featured.content, 200)}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-5 text-sm text-[var(--gold)] font-medium">
                      Lire l'article
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            )}

            {/* Secondary articles */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group cursor-pointer block"
                >
                  <article className="flex gap-5 items-center p-4 rounded-2xl border border-[var(--gold)] bg-white hover:bg-[var(--beige)] transition-colors duration-300">
                    <div className="img-zoom w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-[var(--gold)] mb-1">
                        {formatDate(post.createdAt)}
                      </div>
                      <h4 className="font-display text-lg text-[var(--charcoal)] leading-snug group-hover:text-[var(--gold)] transition-colors duration-300">
                        {post.title}
                      </h4>
                      <p className="text-sm text-[var(--charcoal)]/60 mt-1 line-clamp-2">
                        {excerpt(post.content, 90)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All articles link */}
        {blogPosts.length > 0 && (
          <div className="text-center mt-14">
            <Link
              to="/blog"
              className="forma-btn-outline cursor-pointer"
            >
              Voir tous les articles
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

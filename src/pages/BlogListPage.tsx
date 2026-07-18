import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';

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

function excerpt(content: string, max = 180): string {
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

export function BlogListPage() {
  const { blogPosts } = useStore();

  return (
    <>
      <Helmet>
        <title>Journal | Ethnic Bijoux</title>
        <meta name="description" content="Articles et inspirations de la maison Ethnic." />
      </Helmet>
      <Nav />
      <main className="pt-28 pb-24 px-6 bg-[var(--cream)] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-14">
            <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-xs mb-4">Journal</span>
            <h1 className="font-display text-4xl md:text-5xl text-[var(--charcoal)]">Tous les Articles</h1>
            <div className="mt-5 h-px w-24 bg-[var(--gold)]" />
          </div>

          {blogPosts.length === 0 ? (
            <p className="text-center text-[var(--charcoal)]/60">Aucun article pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group cursor-pointer block">
                  <article className="overflow-hidden rounded-2xl border border-[var(--gold)] bg-white hover:bg-[var(--beige)] transition-colors duration-300">
                    <div className="img-zoom h-56 w-full">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-[var(--gold)] mb-2">{formatDate(post.createdAt)}</div>
                      <h2 className="font-display text-2xl text-[var(--charcoal)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300">
                        {post.title}
                      </h2>
                      <p className="text-[var(--charcoal)]/70 leading-relaxed">{excerpt(post.content)}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-14">
            <Link to="/" className="forma-btn-outline cursor-pointer">Retour à l'accueil</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

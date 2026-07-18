import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useStore } from '../context/StoreContext';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { blogPosts } = useStore();

  const blogPost = blogPosts.find(post => post.id === Number(id));

  if (!blogPost) {
    return (
      <>
        <Helmet>
          <title>Blog Post Not Found | Ethnic</title>
        </Helmet>
        <Nav />
        <div className="pt-40 pb-20 px-6 text-center">
          <h2 className="font-display text-3xl text-[#0F0F0F] mb-4">Blog Post Not Found</h2>
          <Link to="/" className="text-[#0F0F0F] hover:opacity-60 transition-opacity">
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const canonicalUrl = `https://yourdomain.com/blog/${blogPost.id}`;

  return (
    <>
      <Helmet>
        <title>{blogPost.title} | Ethnic</title>
        <meta name="description" content={blogPost.content.replace(/<[^>]+>/g, '').substring(0, 160)} />
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.content.replace(/<[^>]+>/g, '').substring(0, 160)} />
        <meta property="og:image" content={blogPost.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:image" content={blogPost.image} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${blogPost.title}",
          "author": {
            "@type": "Person",
            "name": "${blogPost.author}"
          },
          "datePublished": "${blogPost.createdAt}",
          "image": "${blogPost.image}",
          "publisher": {
            "@type": "Organization",
            "name": "Ethnic",
            "logo": {
              "@type": "ImageObject",
              "url": "https://yourdomain.com/favicon.svg"
            }
          }
        }
        `}</script>
      </Helmet>
      <Nav />
      <article className="pt-32 pb-24 px-6 bg-[var(--cream)]" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Back link */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-[var(--charcoal)] hover:opacity-60 transition-opacity cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article header */}
        <header className="max-w-3xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-widest text-[var(--gold)] mb-4">
            <span>Journal</span>
            <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
            <span>{blogPost.createdAt}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--charcoal)] leading-tight">
            {blogPost.title}
          </h1>
          <p className="mt-4 text-[var(--charcoal)]/60">By {blogPost.author}</p>
        </header>

        {/* Hero image */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="rounded-3xl overflow-hidden shadow-sm border border-[var(--gold)]">
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-[300px] md:h-[460px] object-cover"
            />
          </div>
        </div>

        {/* Article body — expanded, no height limit */}
        <div className="max-w-3xl mx-auto">
          <div
            className="prose-blog text-[var(--charcoal)]/85 leading-loose text-lg md:text-xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blogPost.content) }}
          />

          <div className="mt-14 pt-8 border-t border-[var(--gold)]/40 text-center">
            <Link
              to="/blog"
              className="forma-btn-outline cursor-pointer"
            >
              Voir tous les articles
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}

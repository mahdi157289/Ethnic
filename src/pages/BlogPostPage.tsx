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
        <meta name="description" content={blogPost.content.substring(0, 160)} />
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.content.substring(0, 160)} />
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
      <article className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-[#0F0F0F] hover:opacity-60 transition-opacity mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-stretch max-h-[50vh]">
            <div className="forma-card bg-white rounded-3xl overflow-hidden h-[400px]">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="forma-card bg-white rounded-3xl p-8 space-y-4 overflow-y-auto h-[400px]">
              <div className="flex items-center gap-4 text-sm text-[#0F0F0F]/60">
                <span>By {blogPost.author}</span>
                <span>•</span>
                <span>{blogPost.createdAt}</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl text-[#0F0F0F]">
                {blogPost.title}
              </h1>
              
              <div
                className="prose-blog text-[#0F0F0F]/80 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blogPost.content) }}
              />
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}

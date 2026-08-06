# AGENTS.md — Ethnic / FORMA Project Reference

> This file is the canonical reference for AI assistants working on this codebase.
> It documents architecture, conventions, deployment, and gotchas to enable fast, correct changes.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | FORMA / Ethnic |
| **Type** | Ethnic artisan jewelry e-commerce SPA |
| **Stack** | React 19 + TypeScript + Vite 8 + Tailwind CSS v4 |
| **Language** | French (all UI copy, meta tags, schema.org) |
| **Currency** | TND (Tunisian Dinar) |
| **Deploy** | Render (`ethnic-s2m2.onrender.com`) |
| **Repo** | `https://github.com/mahdi157289/Ethnic.git` |
| **Render service** | `ethnic` (defined in `render.yaml`) |
| **Render API key** | Stored in user's OpenCode MCP config |

---

## 2. Directory Structure

```
ethnic/
  forma/                          ← Main React app (ALL source code lives here)
    index.html                    ← Entry HTML (lang="fr", Google Fonts: Playfair Display + Inter)
    package.json                  ← Dependencies & scripts
    vite.config.ts                ← Vite config (base: '/', Tailwind v4 plugin)
    tsconfig.json                 ← Strict TS, ES2022 target, bundler resolution
    render.yaml                   ← Render deployment config
    server.cjs                    ← Zero-dep Node static server for Render (SPA fallback)
    src/
      main.tsx                    ← App entry: HelmetProvider + imports tailwind.css + forma.css
      App.tsx                     ← Router: BrowserRouter + StoreProvider + global overlays
      types/
        index.ts                  ← All TypeScript interfaces (Product, Category, BlogPost, etc.)
      context/
        StoreContext.tsx           ← THE central state (products, cart, orders, blog, admin UI)
      data/
        productCatalog.ts         ← Seed product/category generators from images
        seed.ts                   ← Exports pre-built seed data
      services/
        databaseLoader.ts         ← localStorage persistence layer (MockDatabaseService singleton)
      hooks/
        useImageSlider.ts         ← Image carousel state (activeIndex, start/stop)
        useScrollSpy.ts           ← Section visibility tracking
      utils/
        formatPrice.ts            ← formatPrice(n) → "1,200 TND"
      pages/
        HomePage.tsx              ← Landing page (Hero → Carousel → Featured → Categories → Blog → Gallery → About → Newsletter)
        StorePage.tsx             ← Full product collection with filters
        BlogListPage.tsx          ← Blog index (card grid)
        BlogPostPage.tsx          ← Blog detail (image + HTML content + product recs)
      components/
        layout/
          Nav.tsx                 ← Top navigation bar
          Footer.tsx              ← Site footer
        storefront/
          Hero.tsx                ← Hero section with product carousel
          HeroDecorations.tsx     ← 3D decorative elements for hero
          CollectionCarouselSection.tsx  ← Infinite-scroll product carousel (home)
          CollectionSection.tsx   ← Full product grid (store page) with category filters
          FeaturedSection.tsx     ← Featured product spotlight
          CategoriesSection.tsx   ← Category grid with infinite scroll
          BlogSection.tsx         ← Latest blog posts (home)
          GallerySection.tsx      ← Image gallery
          AboutSection.tsx        ← About section
          NewsletterSection.tsx   ← Newsletter signup
          ProductCard.tsx         ← Reusable product card
        cart/
          CartSidebar.tsx         ← Slide-out cart drawer
          CheckoutModal.tsx       ← Checkout form
          OrderSuccessModal.tsx   ← Order confirmation
        product/
          QuickViewModal.tsx      ← Product quick-view overlay
        admin/
          AdminPanel.tsx          ← Admin panel wrapper + FAB toggle
          AdminDashboard.tsx      ← Admin dashboard
          AdminProductsPage.tsx   ← Product CRUD
          AdminBlogPage.tsx       ← Blog post CRUD (HTML editor)
          AdminGalleryPage.tsx    ← Gallery image management
          EmailNotificationModal.tsx  ← Email subscribers about new products
        ui/
          VideoLoader.tsx         ← Intro video loader (shown before app)
          ImageSlider.tsx         ← Reusable image slider with dots/thumbnails
          Modal.tsx               ← Reusable modal wrapper
          NotificationToasts.tsx  ← Toast notification system
          BrandLogo.tsx           ← Logo component
      styles/
        tailwind.css              ← Tailwind v4 entry: @import 'tailwindcss'
        forma.css                 ← ALL custom CSS (variables, buttons, prose-blog, animations)
      assets/
        admin-data.json           ← Seed data for products/blog/featured/welcome (committed defaults)
        brand.ts                  ← Brand-related assets
        product pictures/         ← All product images (.jpg files, loaded via import.meta.glob)
        video loader ethnic.mp4   ← Intro video
        ethnic logo.jpeg          ← Logo
        ethnic-logo-navbar.png    ← Navbar logo
```

---

## 3. Architecture & Data Flow

### 3.1 State Management

**No external state library.** All state lives in `StoreContext.tsx` — a single React Context wrapping the entire app.

```
App.tsx
  └─ StoreProvider (StoreContext.tsx)
       ├─ State: products, categories, blogPosts, cart, orders, customers, subscribers, etc.
       ├─ Actions: addToCart, placeOrder, addProduct, addBlogPost, etc.
       └─ Persistence: databaseLoader.ts → localStorage
```

**Key context values consumed via `useStore()`:**
- `products`, `categories`, `blogPosts`, `featuredProduct` — data
- `cart`, `cartTotal`, `cartCount` — cart state
- `addToCart`, `removeFromCart`, `updateCartQuantity` — cart actions
- `placeOrder`, `orders`, `updateOrderStatus` — order management
- `adminOpen`, `adminPage`, `setAdminPanel` — admin UI state
- `showNotification(message, type)` — toast notifications
- `formatPrice` — price formatting utility

### 3.2 Data Persistence (databaseLoader.ts)

The app uses a **localStorage-based persistence layer** with a fallback chain:

```
localStorage → admin-data.json (committed seed) → productCatalog.ts generators → image files
```

**localStorage keys:**
- `db_products-seed.json` — `{ products: Product[] }`
- `db_categories-seed.json` — `Category[]`
- `db_blogposts-seed.json` — `BlogPost[]`
- `db_featured-seed.json` — `FeaturedProduct | null`
- `db_gallery-seed.json` — `string[]`
- `db_welcome-seed.json` — `string[]`
- `db_storage_version` — version tracker (triggers data reset on change)

**IMPORTANT:** Blog post `content` field stores **raw HTML** (rendered via `dangerouslySetInnerHTML` + `DOMPurify.sanitize()`). Admin editor uses a rich text editor that outputs HTML.

### 3.3 Image Handling

Product images are loaded at build time via Vite's `import.meta.glob`:
```ts
const imageModules = import.meta.glob<string>('../assets/product pictures/*.jpg', {
  eager: true, query: '?url', import: 'default',
});
```

Images are grouped by base filename (ignoring `(1)` suffixes) to combine multiple views of the same product.

---

## 4. Routing

Defined in `App.tsx`:

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Full landing page with all sections |
| `/store` | `StorePage` | Product collection with category filters |
| `/blog` | `BlogListPage` | Blog index (card grid) |
| `/blog/:id` | `BlogPostPage` | Blog detail (HTML content + product recs) |

**Global overlays** (rendered on every page):
- `QuickViewModal` — product quick view
- `CartSidebar` — slide-out cart
- `CheckoutModal` — checkout form
- `OrderSuccessModal` — confirmation
- `NotificationToasts` — toast notifications
- `AdminFab` + `AdminPanel` — admin panel with FAB toggle

---

## 5. Routing & Page Composition

### 5.1 HomePage Sections (in order)

1. `Nav` — top navigation
2. `Hero` — hero banner with featured product carousel
3. `CollectionCarouselSection` — infinite-scroll product carousel
4. `FeaturedSection` — spotlight on a single featured product
5. `CategoriesSection` — category grid with infinite scroll
6. `BlogSection` — latest blog posts
7. `GallerySection` — image gallery
8. `AboutSection` — about the brand
9. `NewsletterSection` — email signup
10. `Footer`

### 5.2 StorePage

- `Nav`
- Page header ("Collection Complète")
- `CollectionSection` — full product grid with category filter tabs
- `Footer`

### 5.3 BlogPostPage Layout

- `Nav`
- Back link (→ `/#blog`)
- Desktop: two-column grid
  - **Left (col 1):** Sticky blog image
  - **Right (col 2):** Meta info + HTML content + "Voir tous les articles" link
- Below image (col 1, row 2): Product recommendations ("Vous aimerez aussi")
- `Footer`

---

## 6. Styling Conventions

### 6.1 Tailwind CSS v4

- Entry: `src/styles/tailwind.css` → `@import 'tailwindcss'`
- Plugin: `@tailwindcss/vite` in `vite.config.ts`
- **No `tailwind.config.js`** — Tailwind v4 uses CSS-first configuration
- Custom CSS lives in `src/styles/forma.css`

### 6.2 CSS Custom Properties (forma.css)

```css
--beige: #E8E0D5;
--beige-dark: #D4C8B8;
--cream: #F5F1EB;
--white: #FFFFFF;
--charcoal: #0F0F0F;
--gold: #C4A35A;
--gold-light: #D4AF37;
```

### 6.3 CSS Classes

| Class | Usage |
|---|---|
| `.font-display` | Playfair Display serif font |
| `.forma-btn-primary` | Dark CTA button (charcoal bg, gold border) |
| `.forma-btn-outline` | Outlined button (transparent bg, gold border) |
| `.forma-btn-soft` | Soft button (beige bg) |
| `.card-3d` | 3D hover effect with perspective transform |
| `.img-zoom` | Image zoom on hover (scale 1.08) |
| `.prose-blog` | Blog content typography (h1-h3, p, ul, li, strong, blockquote, a, img) |
| `.category-tag` | Category pill badge |
| `.filter-btn` | Store filter button (active state = dark bg) |
| `.product-card` | Product card with transition/filter effects |
| `.nav-link` | Navigation link with gold underline on hover/active |
| `.section-title` / `.section-title-text` | Section headings with decorative lines |

### 6.4 Tailwind v4 Gotchas

**DO NOT use opacity modifiers with arbitrary CSS variable values:**
```tsx
// WRONG — produces invisible text (rgba(#0F0F0F, 0.85) is invalid)
<div className="text-[var(--charcoal)]/85">

// CORRECT — rely on .prose-blog or .text-[var(--charcoal)]
<div className="prose-blog">
```

Tailwind v4 opacity modifiers (`/85`) only work with Tailwind's built-in color utilities, NOT with arbitrary `[]` values containing CSS variables.

---

## 7. Type Definitions (src/types/index.ts)

| Type | Description |
|---|---|
| `Product` | id, name, price, salePrice?, description, images[], category, type, tags[], rating |
| `FeaturedProduct` | extends Product with `type: 'featured'` |
| `Category` | id, name, image, count |
| `CartItem` | name, price, quantity, image? |
| `Customer` | id, name, email, phone, address, createdAt |
| `Order` | id, customerId, customerName/customerEmail/customerPhone/customerAddress, items[], total, status, createdAt |
| `BlogPost` | id, title, content (HTML), image, author, createdAt (DD/MM/YYYY) |
| `Subscriber` | email, name?, source, subscribedAt |
| `AdminPage` | 'dashboard' \| 'products' \| 'blog' \| 'gallery' |
| `Toast` | id, message, type ('success' \| 'error') |

---

## 8. Admin Panel

Accessible via floating action button (FAB) on any page.

### 8.1 Admin Pages

| Page | Component | Features |
|---|---|---|
| Dashboard | `AdminDashboard` | Stats overview |
| Products | `AdminProductsPage` | Add/edit/delete products, featured product, categories |
| Blog | `AdminBlogPage` | Add/edit/delete blog posts with HTML rich text editor |
| Gallery | `AdminGalleryPage` | Add/delete gallery images |

### 8.2 Blog Content

- Blog content is stored as **HTML strings**
- Admin uses a rich text editor that outputs HTML
- Rendered via `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}`
- Styled by `.prose-blog` CSS class
- Supports: h1, h2, h3, p, strong, em, ul, ol, li, a, blockquote, img

---

## 9. Build & Deployment

### 9.1 Local Development

```bash
cd forma
npm install
npm run dev        # Vite dev server (port 3000)
```

### 9.2 Build

```bash
npm run build      # tsc && vite build → dist/
```

Build outputs to `forma/dist/`. The `server.cjs` serves this folder in production.

### 9.3 Deployment (Render)

- Push to `main` branch triggers auto-deploy on Render
- `render.yaml` config: `npm install && npm run build` → `node server.cjs`
- `server.cjs`: zero-dependency Node HTTP server, serves `dist/` with SPA fallback
- **Important:** After fixing code, you MUST:
  1. `npm run build` (in `forma/`)
  2. `git add` + `git commit` + `git push origin main`
  3. Render auto-deploys

### 9.4 Server (server.cjs)

- Serves static files from `dist/`
- SPA fallback: unknown non-asset routes serve `index.html`
- MIME types: html, js, css, json, svg, png, jpg, jpeg, gif, mp4, webp, ico, woff, woff2
- Binds to `0.0.0.0:${PORT}` (PORT from env, default 3000)

---

## 10. Key Gotchas & Rules

### 10.1 Tailwind v4 Arbitrary Values

- **NEVER** use `text-[var(--xxx)]/opacity` — the opacity modifier doesn't work with arbitrary CSS variables
- Use plain `text-[var(--xxx)]` or rely on CSS classes like `.prose-blog` that set `color` directly
- Example fix: remove `text-[var(--charcoal)]/85` from elements that already have `.prose-blog`

### 10.2 Blog Content Rendering

- Blog `content` is HTML → always sanitize with `DOMPurify.sanitize()` before rendering
- Always wrap in `.prose-blog` class for typography
- `.prose-blog` styles: h1, h2, h3, p, strong, em, ul, ol, li, a, blockquote, img
- If adding new HTML tags in blog content, add corresponding `.prose-blog` styles in `forma.css`

### 10.3 Image Loading

- Product images are loaded via `import.meta.glob` (build-time static imports)
- New product images go in `src/assets/product pictures/` as `.jpg` files
- Images are auto-grouped by base filename (e.g., `collier 01.jpg` + `collier 01 (1).jpg` = same product)

### 10.4 Data Persistence

- All admin changes save to `localStorage` immediately
- First load uses `admin-data.json` as seed, then falls back to `productCatalog.ts` generators
- Changing `STORAGE_VERSION` in `databaseLoader.ts` clears all user data

### 10.5 CSS Variable References in Tailwind

- Use `bg-[var(--cream)]`, `text-[var(--charcoal)]`, `border-[var(--gold)]` (no opacity modifier)
- For semi-transparent borders: use `border-[var(--gold)]/30` — this DOES work for border opacity in Tailwind v4 (different from text color)
- Alternatively, use inline styles: `style={{ borderColor: 'rgba(196, 163, 90, 0.3)' }}`

### 10.6 Price Format

- All prices are in TND (Tunisian Dinar)
- `formatPrice(n)` returns `"1,200 TND"`
- Prices are whole numbers (no decimals)

### 10.7 Language

- All UI text is in French
- Date format: DD/MM/YYYY (French locale)
- Blog content: French
- Meta tags: French

---

## 11. Dependency Reference

| Package | Version | Purpose |
|---|---|---|
| react | ^19.2.6 | UI framework |
| react-dom | ^19.2.6 | DOM rendering |
| react-router-dom | ^7.15.1 | Client-side routing |
| react-helmet-async | ^3.0.0 | SEO meta tags per page |
| dompurify | ^3.4.12 | Sanitize HTML content (blog posts) |
| gsap | ^3.15.0 | Animations (hero, scroll effects) |
| tailwindcss | ^4.3.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.3.0 | Tailwind Vite plugin |
| vite | ^8.0.12 | Build tool / dev server |
| typescript | ~6.0.2 | Type checking |
| @vitejs/plugin-react | ^6.0.2 | React fast refresh |

---

## 12. Common Tasks Quick Reference

### Add a new page
1. Create `src/pages/NewPage.tsx`
2. Add route in `App.tsx`: `<Route path="/new" element={<NewPage />} />`
3. Import in `App.tsx`

### Add a new storefront section
1. Create `src/components/storefront/NewSection.tsx`
2. Import and add to `HomePage.tsx`

### Add a new admin page
1. Create `src/components/admin/AdminNewPage.tsx`
2. Add `AdminPage` type value in `types/index.ts`
3. Add to `AdminPanel.tsx` page switch
4. Add nav button in `AdminPanel.tsx` sidebar

### Modify blog styling
1. Edit `.prose-blog` rules in `src/styles/forma.css`
2. Build and push to deploy

### Add product categories
1. Edit `CATEGORY_NAMES` array in `src/data/productCatalog.ts`
2. Add prefix in `PRODUCT_PREFIX` map
3. Or use Admin Panel → Products → Add Category

### Fix invisible/broken text
- Check for `text-[var(--xxx)]/opacity` patterns (broken in Tailwind v4)
- Remove the opacity modifier or use CSS class instead
- Check `.prose-blog` has appropriate color set

---

## 13. Git Workflow

- **Branch:** `main` (production)
- **Deploy trigger:** push to `main` → Render auto-deploys
- **Commit style:** `fix:`, `feat:`, `chore:` (conventional commits)
- **Before pushing:** always run `npm run build` to verify no TS errors
- **Uncommitted files:** check `git status` — there may be unrelated modified files in working directory

---

## 14. MCP Servers (configured in OpenCode)

| Server | Purpose |
|---|---|
| Render | Deploy management, service status |
| Context7 | Library documentation lookup |
| Sentry | Error monitoring |

Render API key: stored in `~/.config/opencode/opencode.jsonc` under MCP servers config.

---

## 15. Token Optimization Tools

### RTK (Rust Token Killer) — Always Use
RTK compresses command output before it reaches the LLM context. **Always prefix shell commands with `rtk`** to minimize token usage.

```bash
# Instead of:              Use:
git status                 rtk git status
git diff                   rtk git diff
npm run build              rtk npm run build
npm run lint               rtk npm run lint
find . -name "*.tsx"       rtk find . -name "*.tsx"
grep -r "useEffect" .      rtk grep -r "useEffect" .
ls src/                    rtk ls src/
cat file.ts                rtk read file.ts
docker ps                  rtk docker ps
pytest                     rtk pytest
cargo test                 rtk cargo test
```

RTK paths:
- Binary: `C:\Users\bacca\.local\bin\rtk.exe`
- Skill: `.agents/skills/rtk-token-saver/SKILL.md`
- Verify: `rtk --version` and `rtk gain` to see savings

### Graphify — Knowledge Graph for Codebase Questions
Before grepping or reading multiple files to understand architecture, **query the knowledge graph first**:

```bash
# Build graph (run once after major changes):
graphify . --code-only

# Query the graph instead of grepping:
graphify query "How does the cart flow work?"
graphify explain "StoreContext"
graphify path "ProductPage" "CartOverlay"
graphify explain "AdminPanel"
```

Graphify paths:
- Graph: `C:\Users\bacca\Desktop\ethnic\graphify-out\graph.json`
- Report: `C:\Users\bacca\Desktop\ethnic\graphify-out\GRAPH_REPORT.md`
- Visual: `C:\Users\bacca\Desktop\ethnic\graphify-out\graph.html`
- Skill: `C:\Users\bacca\.config\opencode\skills\graphify\SKILL.md`

### Token Usage Rules
1. **Always** prefix shell commands with `rtk` (git, npm, find, grep, ls, cat, docker, etc.)
2. **Always** query Graphify before reading multiple source files
3. **Never** run raw `git diff`, `find`, `grep` — use `rtk` versions
4. **Check savings** periodically with `rtk gain`

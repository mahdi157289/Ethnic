# FORMA — React App

Modular React + TypeScript port of the FORMA artisan furniture storefront. **All data is in-memory (static seed)** until you connect a database.

## Run locally

```bash
cd forma
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

- `src/data/seed.ts` — initial categories, products, featured product
- `src/context/StoreContext.tsx` — cart, orders, admin, filters (replace with API later)
- `src/styles/forma.css` — original custom CSS (animations, 3D, sliders)
- `src/components/` — layout, storefront, cart, admin, UI

## Legacy reference

The original single-file site remains at `../index.html` for visual comparison.

## Database hook (future)

When you have a connection string, swap `StoreProvider` state loaders for API calls in `src/services/` and keep components unchanged.

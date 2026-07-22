import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

interface CollectionSectionProps {
  hideTitle?: boolean;
}

export function CollectionSection({ hideTitle = false }: CollectionSectionProps) {
  const { products, categories, currentCategoryFilter, filterByCategory, clearCategoryFilter } = useStore();

  const catalogProducts = products.filter((p) => p.type !== 'featured');

  return (
    <section id="collection" className={`bg-white ${hideTitle ? 'pt-0 pb-24' : 'py-24'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center ${hideTitle ? 'mb-10' : 'mb-16'}`}>
          {!hideTitle && (
            <p className="text-sm tracking-[0.3em] text-[#0F0F0F]/60 uppercase mb-4">Notre Collection</p>
          )}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {!hideTitle && (
              <h2 className="section-title font-display text-5xl font-medium text-[#0F0F0F]">
                <span className="section-dot" />
                <span className="section-title-text">Collection Complète</span>
                <span className="section-dot" />
              </h2>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={clearCategoryFilter}
                className={`filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300${!currentCategoryFilter ? ' active' : ''}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => filterByCategory(cat.name)}
                  className={`filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300${
                    currentCategoryFilter === cat.name ? ' active' : ''
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {currentCategoryFilter && (
            <div className="mt-6">
              <div className="forma-card inline-flex items-center gap-3 px-6 py-3 bg-[#E8E0D5] rounded-full">
                <span className="text-[#0F0F0F] font-medium">
                  Showing: <span className="font-display">{currentCategoryFilter}</span>
                </span>
                <button
                  type="button"
                  onClick={clearCategoryFilter}
                  className="forma-btn-icon w-6 h-6 bg-[#0F0F0F] text-white rounded-full flex items-center justify-center hover:bg-[#0F0F0F]/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {catalogProducts.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <div className="w-20 h-20 bg-[#E8E0D5] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0F0F0F]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
                <h3 className="font-display text-2xl text-[#0F0F0F] mb-2">Aucun bijou trouvé</h3>
                <p className="text-[#0F0F0F]/60 mb-6">Aucun bijou dans cette catégorie pour le moment.</p>
            <button
              type="button"
              onClick={clearCategoryFilter}
              className="forma-btn-primary rounded-xl !py-3 !px-6"
            >
              Voir Tous les Bijoux
            </button>
          </div>
        ) : (
          <div id="products-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {catalogProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

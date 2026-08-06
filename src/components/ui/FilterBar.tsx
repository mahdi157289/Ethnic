import { useStore } from '../../context/StoreContext';

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className = '' }: FilterBarProps) {
  const { categories, currentCategoryFilter, filterByCategory, clearCategoryFilter } = useStore();

  return (
    <div className={`filter-bar-wrapper relative -mx-6 px-6 md:mx-0 md:px-0 ${className}`}>
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:flex-wrap md:overflow-x-visible md:pb-0">
        <button
          type="button"
          onClick={clearCategoryFilter}
          className={`filter-btn flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300${
            !currentCategoryFilter ? ' active' : ''
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => filterByCategory(cat.name)}
            className={`filter-btn flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300${
              currentCategoryFilter === cat.name ? ' active' : ''
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

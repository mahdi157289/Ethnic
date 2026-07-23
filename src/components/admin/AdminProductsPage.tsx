import { useRef, useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { SectionTitle } from '../ui/SectionTitle';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function readFilesAsDataUrls(files: FileList): Promise<string[]> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          if (file.size > MAX_IMAGE_SIZE) {
            reject(new Error('Image too large. Max 5MB allowed.'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export function AdminProductsPage() {
  const {
    adminPage,
    categories,
    products,
    addCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    showNotification,
    editingProduct,
    setEditingProduct,
    welcomeImages,
    addWelcomeImage,
    updateWelcomeImage,
    deleteWelcomeImage,
  } = useStore();

  // State for welcome images
  const [editingWelcomeImageIndex, setEditingWelcomeImageIndex] = useState<number | null>(null);
  const [welcomeImagePreview, setWelcomeImagePreview] = useState<string | null>(null);
  const [welcomeDragOver, setWelcomeDragOver] = useState(false);
  const welcomeImageInputRef = useRef<HTMLInputElement>(null);

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productSalePrice, setProductSalePrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productType, setProductType] = useState<'normal' | 'featured'>('normal');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const productImagesRef = useRef<HTMLInputElement>(null);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [productRating, setProductRating] = useState<number>(5);

  // Sync form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductCategory(editingProduct.category);
      setProductPrice(String(editingProduct.price));
      setProductSalePrice(editingProduct.salePrice ? String(editingProduct.salePrice) : '');
      setProductDescription(editingProduct.description);
      setProductType(editingProduct.type);
      setUploadedImages([...editingProduct.images]);
      setProductTags([...(editingProduct.tags || [])]);
      setProductRating(editingProduct.rating);
    } else {
      setProductName('');
      setProductCategory('');
      setProductPrice('');
      setProductSalePrice('');
      setProductDescription('');
      setProductType('normal');
      setUploadedImages([]);
      setProductTags([]);
      setTagInput('');
      setProductRating(5);
    }
  }, [editingProduct]);

  const handleCategoryImage = async (files: FileList | null) => {
    if (!files?.[0]) return;
    try {
      const [url] = await readFilesAsDataUrls(files);
      setCategoryImage(url);
    } catch {
      showNotification('Image too large. Max 5MB allowed.', 'error');
    }
  };

  const handleProductImages = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const urls = await readFilesAsDataUrls(files);
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch {
      showNotification('Image too large. Max 5MB allowed.', 'error');
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !productTags.includes(trimmedTag)) {
      setProductTags([...productTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductTags(productTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const submitCategory = () => {
    if (addCategory(categoryName, categoryImage ?? '')) {
      setCategoryName('');
      setCategoryImage(null);
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      showNotification('Please upload at least one image', 'error');
      return;
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productName,
        category: productCategory,
        price: parseInt(productPrice, 10),
        description: productDescription,
        images: uploadedImages,
        type: productType,
        salePrice: productSalePrice ? parseInt(productSalePrice, 10) : undefined,
        tags: productTags,
        rating: productRating,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: productName,
        category: productCategory,
        price: parseInt(productPrice, 10),
        description: productDescription,
        images: uploadedImages,
        type: productType,
        salePrice: productSalePrice ? parseInt(productSalePrice, 10) : undefined,
        tags: productTags,
        rating: productRating,
      });
      setProductName('');
      setProductCategory('');
      setProductPrice('');
      setProductSalePrice('');
      setProductDescription('');
      setProductType('normal');
      setUploadedImages([]);
      setProductTags([]);
      setTagInput('');
      setProductRating(5);
    }
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const handleWelcomeImage = async (files: FileList | null) => {
    if (!files?.[0]) return;
    try {
      const [url] = await readFilesAsDataUrls(files);
      setWelcomeImagePreview(url);
    } catch {
      showNotification('Image too large. Max 5MB allowed.', 'error');
    }
  };

  const submitWelcomeImage = () => {
    if (!welcomeImagePreview) return;
    if (editingWelcomeImageIndex !== null) {
      updateWelcomeImage(editingWelcomeImageIndex, welcomeImagePreview);
      setEditingWelcomeImageIndex(null);
    } else {
      addWelcomeImage(welcomeImagePreview);
    }
    setWelcomeImagePreview(null);
  };

  const startEditWelcomeImage = (index: number) => {
    setEditingWelcomeImageIndex(index);
    setWelcomeImagePreview(welcomeImages[index]);
  };

  const cancelEditWelcomeImage = () => {
    setEditingWelcomeImageIndex(null);
    setWelcomeImagePreview(null);
  };

  return (
    <div id="admin-page-products" className={`admin-page p-4 md:p-8${adminPage === 'products' ? ' active' : ''}`}>
      <div className="mb-8 md:mb-12">
        <SectionTitle title="Manage Categories" size="sm" />
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6" id="categories-list">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <img src={cat.image} alt={cat.name} className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F0F0F] text-sm truncate">{cat.name}</p>
                  <p className="text-xs text-[#0F0F0F]/50">
                    {products.filter((p) => p.category === cat.name).length} products
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E8E0D5] pt-4 md:pt-6">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Outdoor"
              className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#0F0F0F] mb-4"
            />
            <div
              className="category-upload-preview-large mb-4"
              onClick={() => categoryInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && categoryInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              {categoryImage ? (
                <img src={categoryImage} alt="Category preview" />
              ) : (
                <p className="text-sm text-[#0F0F0F]/40">Click to upload image</p>
              )}
              <input
                ref={categoryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCategoryImage(e.target.files)}
              />
            </div>
            <button
              type="button"
              onClick={submitCategory}
              className="w-full px-6 py-3 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80 text-sm"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 md:mb-12">
        <SectionTitle title={editingProduct ? 'Edit Product' : 'Add New Product'} size="sm" />
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm">
          <form onSubmit={submitProduct} className="space-y-4 md:space-y-6">
            <div className="bg-[#F5F1EB] p-4 md:p-6 rounded-xl text-center">
              <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="product-type"
                    checked={productType === 'normal'}
                    onChange={() => setProductType('normal')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Bijou Standard</span>
                </label>
                <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="product-type"
                    checked={productType === 'featured'}
                    onChange={() => setProductType('featured')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Bijou de la Semaine</span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#0F0F0F]"
              />
              <select
                required
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="number"
                required
                min={1}
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Regular Price (TND)"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl"
              />
              {productType === 'featured' && (
                <input
                  type="number"
                  min={1}
                  value={productSalePrice}
                  onChange={(e) => setProductSalePrice(e.target.value)}
                  placeholder="Sale Price (TND)"
                  className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl"
                />
              )}
            </div>

            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={3}
              placeholder="Describe your product..."
              className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl resize-none"
            />

            <div
              className={`upload-area${dragOver ? ' dragover' : ''}`}
              onClick={() => productImagesRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleProductImages(e.dataTransfer.files); }}
            >
              <input
                ref={productImagesRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleProductImages(e.target.files)}
              />
              <p className="text-[#0F0F0F] font-medium text-sm">Click to upload images</p>
              <p className="text-[#0F0F0F]/50 text-xs md:text-sm">or drag and drop • PNG, JPG up to 5MB</p>
            </div>
            <div className="upload-preview">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="upload-preview-item">
                  <img src={img} alt={`Preview ${idx + 1}`} />
                  <button type="button" onClick={() => setUploadedImages((p) => p.filter((_, i) => i !== idx))}>×</button>
                </div>
              ))}
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-wrap gap-2">
                {productTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--gold-light)]/20 text-[#0F0F0F] rounded-full text-sm font-medium border border-[var(--gold)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-[#0F0F0F]/60 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  placeholder="Add a tag (press Enter)"
                  className="flex-1 px-4 py-3 border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#0F0F0F]"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-5 py-3 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80 text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-[#0F0F0F]">Product Rating</label>
              <div className="flex items-center gap-1 md:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setProductRating(star)}
                    className="p-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 md:h-8 md:w-8"
                      viewBox="0 0 24 24"
                      fill={star <= productRating ? '#C4A35A' : '#E8E0D5'}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 md:gap-4">
              {editingProduct && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex-1 py-3 md:py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 text-sm md:text-base"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 md:py-4 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80 text-sm md:text-base"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mb-8 md:mb-12">
        <SectionTitle title="Welcome Page Images" size="sm" />
        {welcomeImages.length === 0 ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center">
            <p className="text-[#0F0F0F]/50 text-sm">No welcome images yet. Add your first image below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {welcomeImages.map((img, index) => (
              <div key={index} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm relative">
                <img
                  src={img}
                  alt={`Welcome ${index + 1}`}
                  className="w-full h-36 md:h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => startEditWelcomeImage(index)}
                  className="absolute top-3 left-3 p-2 text-[#0F0F0F] bg-white/90 rounded-full hover:bg-gray-100 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => deleteWelcomeImage(index)}
                  className="absolute top-3 right-3 p-2 text-red-500 bg-white/90 rounded-full hover:bg-red-50 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm">
          <div className="space-y-4 md:space-y-6">
            <div
              className={`upload-area${welcomeDragOver ? ' dragover' : ''}`}
              onClick={() => welcomeImageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setWelcomeDragOver(true); }}
              onDragLeave={() => setWelcomeDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setWelcomeDragOver(false); handleWelcomeImage(e.dataTransfer.files); }}
            >
              <input
                ref={welcomeImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleWelcomeImage(e.target.files)}
              />
              <p className="text-[#0F0F0F] font-medium text-sm">Click to upload welcome image</p>
              <p className="text-[#0F0F0F]/50 text-xs md:text-sm">or drag and drop • PNG, JPG up to 5MB</p>
            </div>
            {welcomeImagePreview && (
              <div className="upload-preview">
                <div className="upload-preview-item">
                  <img src={welcomeImagePreview} alt="Welcome preview" />
                  <button type="button" onClick={() => setWelcomeImagePreview(null)}>×</button>
                </div>
              </div>
            )}

            <div className="flex gap-3 md:gap-4">
              {editingWelcomeImageIndex !== null && (
                <button
                  type="button"
                  onClick={cancelEditWelcomeImage}
                  className="flex-1 py-3 md:py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 text-sm md:text-base"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={submitWelcomeImage}
                disabled={!welcomeImagePreview}
                className="flex-1 py-3 md:py-4 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80 disabled:opacity-50 text-sm md:text-base"
              >
                {editingWelcomeImageIndex !== null ? 'Update Welcome Image' : 'Add Welcome Image'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

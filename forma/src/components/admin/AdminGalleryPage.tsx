import { useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error('Image too large. Max 5MB allowed.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminGalleryPage() {
  const { adminPage, galleryImages, addGalleryImage, deleteGalleryImage, showNotification } = useStore();
  const [image, setImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImage = async (files: FileList | null) => {
    if (!files?.[0]) return;
    try {
      const url = await readFileAsDataUrl(files[0]);
      setImage(url);
    } catch {
      showNotification('Image too large. Max 5MB allowed.', 'error');
    }
  };

  const submitGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      addGalleryImage(image);
      setImage(null);
    }
  };

  return (
    <div id="admin-page-gallery" className={`admin-page p-8${adminPage === 'gallery' ? ' active' : ''}`}>
      <div className="mb-12">
        <h3 className="section-title font-display text-xl text-[#0F0F0F] mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Add New Gallery Image</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <form onSubmit={submitGalleryImage} className="space-y-6">
            <div
              className={`upload-area${dragOver ? ' dragover' : ''}`}
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleImage(e.dataTransfer.files);
              }}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files)}
              />
              <p className="text-[#0F0F0F] font-medium">Click to upload image</p>
              <p className="text-[#0F0F0F]/50 text-sm">or drag and drop • PNG, JPG up to 5MB</p>
            </div>
            {image && (
              <div className="upload-preview">
                <div className="upload-preview-item">
                  <img src={image} alt="Preview" />
                  <button type="button" onClick={() => setImage(null)}>
                    ×
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={!image} className="w-full py-4 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80 disabled:opacity-50">
              Add to Gallery
            </button>
          </form>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="section-title font-display text-xl text-[#0F0F0F] mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Gallery Images</span>
          <span className="section-dot" />
        </h3>
        {galleryImages.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-[#0F0F0F]/50">No gallery images yet. Add your first image above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm relative">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => deleteGalleryImage(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 bg-white/90 rounded-full hover:bg-red-50 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

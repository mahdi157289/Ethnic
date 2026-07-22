import { useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { BlogPost } from '../../types';

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

export function AdminBlogPage() {
  const { adminPage, blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, showNotification } = useStore();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
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

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setImage(post.image);
    document.getElementById('admin-blog-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setAuthor('');
    setImage(null);
  };

  const submitBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      updateBlogPost(editingId, { title, content, image: image ?? '', author });
    } else {
      addBlogPost({ title, content, image: image ?? '', author });
    }
    resetForm();
  };

  return (
    <div id="admin-page-blog" className={`admin-page p-4 md:p-8${adminPage === 'blog' ? ' active' : ''}`}>
      <div className="mb-8 md:mb-12">
        <h3 className="section-title font-display text-lg md:text-xl text-[#0F0F0F] mb-4 md:mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Blog Posts</span>
          <span className="section-dot" />
        </h3>
        {blogPosts.length === 0 ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center">
            <p className="text-[#0F0F0F]/50 text-sm">No blog posts yet. Add your first post below!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-[#F5F1EB]">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Image</th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Title</th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Author</th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Date</th>
                    <th className="text-right px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="border-t border-[#E8E0D5] hover:bg-[#F5F1EB]/50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <img src={post.image} alt={post.title} className="w-12 h-9 md:w-16 md:h-12 object-cover rounded-lg" />
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-[#0F0F0F] text-sm">{post.title}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[#0F0F0F]/70 text-sm">{post.author}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[#0F0F0F]/70 text-sm">{post.createdAt}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(post)}
                            className="px-2 py-1.5 md:p-2 text-[#0F0F0F]/70 hover:bg-[#F5F1EB] rounded-lg text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlogPost(post.id)}
                            className="px-2 py-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div id="admin-blog-form" className="mb-8 md:mb-12">
        <h3 className="section-title font-display text-lg md:text-xl text-[#0F0F0F] mb-4 md:mb-6">
          <span className="section-dot" />
          <span className="section-title-text">
            {editingId !== null ? 'Edit Blog Post' : 'Add New Blog Post'}
          </span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm">
          <form onSubmit={submitBlogPost} className="space-y-4 md:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog Post Title"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#0F0F0F]"
              />
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#0F0F0F]"
              />
            </div>

            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Write your blog post content... (use <strong> for bold, <em> for italic)"
              className="w-full px-4 py-3 border border-[#E8E0D5] rounded-xl resize-none"
            />

            <div
              className={`upload-area${dragOver ? ' dragover' : ''}`}
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImage(e.dataTransfer.files); }}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files)}
              />
              <p className="text-[#0F0F0F] font-medium text-sm">Click to upload image</p>
              <p className="text-[#0F0F0F]/50 text-xs md:text-sm">or drag and drop • PNG, JPG up to 5MB</p>
            </div>
            {image && (
              <div className="upload-preview">
                <div className="upload-preview-item">
                  <img src={image} alt="Preview" />
                  <button type="button" onClick={() => setImage(null)}>×</button>
                </div>
              </div>
            )}

            <div className="flex gap-3 md:gap-4">
              <button type="submit" className="flex-1 py-3 md:py-4 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80 text-sm md:text-base">
                {editingId !== null ? 'Save Changes' : 'Add Blog Post'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 md:px-6 py-3 md:py-4 border border-[#E8E0D5] text-[#0F0F0F]/70 rounded-xl hover:bg-[#F5F1EB] text-sm md:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

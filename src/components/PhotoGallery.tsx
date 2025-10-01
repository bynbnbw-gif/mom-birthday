import { useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { supabase, type Photo } from '../lib/supabase';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    uploaded_by: '',
  });

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (data) {
      setPhotos(data);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.url.trim()) return;

    setUploading(true);
    const { error } = await supabase.from('photos').insert([
      {
        url: formData.url,
        caption: formData.caption,
        uploaded_by: formData.uploaded_by || 'אנונימי',
        display_order: 0,
      },
    ]);

    if (!error) {
      setFormData({ url: '', caption: '', uploaded_by: '' });
      setShowUploadForm(false);
      loadPhotos();
    }
    setUploading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">גלריית תמונות</h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Camera size={20} />
          הוסף תמונה
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קישור לתמונה *
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                השתמש בתמונות מ-Pexels או העלה לשירות כמו Imgur
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כיתוב
              </label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="תאר את התמונה או הזיכרון..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם שלך
              </label>
              <input
                type="text"
                value={formData.uploaded_by}
                onChange={(e) => setFormData({ ...formData, uploaded_by: e.target.value })}
                placeholder="השם שלך (אופציונלי)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {uploading ? 'מעלה...' : 'הוסף תמונה'}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <Camera size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">עדיין אין תמונות. היה הראשון להוסיף!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              {photo.caption && (
                <div className="p-4">
                  <p className="text-gray-700 text-sm line-clamp-2">{photo.caption}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    מאת: {photo.uploaded_by}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10"
              >
                <X size={24} />
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full max-h-[70vh] object-contain bg-gray-100"
              />
            </div>
            {selectedPhoto.caption && (
              <div className="p-6">
                <p className="text-gray-800 text-lg">{selectedPhoto.caption}</p>
                <p className="text-gray-500 text-sm mt-2">
                  מאת: {selectedPhoto.uploaded_by}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

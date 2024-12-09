import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { useNewsStore } from '../../store/newsStore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';

export default function NewsSettings() {
  const { news, addNews, updateNews, deleteNews } = useNewsStore();
  const [editingNews, setEditingNews] = useState(null);
  const [isAddingNews, setIsAddingNews] = useState(false);

  const handleAddNews = () => {
    setIsAddingNews(true);
    setEditingNews({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      author: '',
      publishedAt: new Date().toISOString(),
      active: true
    });
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
  };

  const handleDeleteNews = (newsId) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      deleteNews(newsId);
      toast.success('Notícia excluída com sucesso');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">
          Notícias
        </h2>
        <button
          onClick={handleAddNews}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Notícia
        </button>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 font-poppins">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-poppins mt-1">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditNews(item)}
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500 font-poppins">
                  <span className="font-medium text-gray-900">{item.author}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={item.publishedAt}>
                    {formatDate(item.publishedAt)}
                  </time>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingNews && (
        <NewsModal
          news={editingNews}
          onSave={(newsData) => {
            if (isAddingNews) {
              addNews(newsData);
              toast.success('Notícia criada com sucesso');
            } else {
              updateNews(newsData.id, newsData);
              toast.success('Notícia atualizada com sucesso');
            }
            setEditingNews(null);
            setIsAddingNews(false);
          }}
          onClose={() => {
            setEditingNews(null);
            setIsAddingNews(false);
          }}
        />
      )}
    </div>
  );
}

function NewsModal({ news, onSave, onClose }) {
  const [formData, setFormData] = useState(news);
  const [imagePreview, setImagePreview] = useState(news.imageUrl);

  const editor = useEditor({
    extensions: [StarterKit],
    content: news.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        content: editor.getHTML()
      }));
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
          {news.id ? 'Editar Notícia' : 'Nova Notícia'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Resumo
            </label>
            <textarea
              value={formData.excerpt}
              onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Imagem (640x400)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <Image className="w-4 h-4 mr-2" />
                Escolher Imagem
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Autor
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Conteúdo
            </label>
            <div className="mt-1 prose max-w-none">
              <EditorContent editor={editor} className="min-h-[200px] border border-gray-300 rounded-md p-4" />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900 font-poppins">
              Ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-poppins"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 font-poppins"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
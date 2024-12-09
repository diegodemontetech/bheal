import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  stock: number;
  category: string;
  sku: string;
  image?: File;
  imageUrl?: string;
}

export default function ProductSettings() {
  const [products] = useState(useProductStore.getState().products);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setEditingProduct({
      name: '',
      description: '',
      price: 0,
      weight: 0,
      stock: 0,
      category: '',
      sku: ''
    });
  };

  const handleEditProduct = (product: ProductFormData) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      // Delete product logic here
      toast.success('Produto excluído com sucesso');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">
          Produtos
        </h2>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center font-poppins"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 font-poppins">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-poppins mt-1">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-poppins">Preço</label>
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-poppins">Peso</label>
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {formatWeight(product.weight)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-poppins">Estoque</label>
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {product.stock} un.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-poppins">Categoria</label>
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {product.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <ProductModal
          product={editingProduct}
          onSave={(product) => {
            // Save product logic here
            toast.success(isAddingProduct ? 'Produto criado com sucesso' : 'Produto atualizado com sucesso');
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
          onClose={() => {
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
        />
      )}
    </div>
  );
}

interface ProductModalProps {
  product: ProductFormData;
  onSave: (product: ProductFormData) => void;
  onClose: () => void;
}

function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(product);
  const [imagePreview, setImagePreview] = useState<string | undefined>(product.imageUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins">
          {product.id ? 'Editar Produto' : 'Novo Produto'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
              Imagem do Produto
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="mt-2 text-xs text-gray-500 font-poppins">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Preço
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-poppins">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.weight}
                onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Estoque
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-poppins"
                required
              >
                <option value="">Selecione...</option>
                <option value="Barreiras">Barreiras</option>
                <option value="Kits">Kits</option>
                <option value="Instrumentais">Instrumentais</option>
              </select>
            </div>
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
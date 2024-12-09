import React from 'react';
import { useProductStore } from '../store/productStore';
import { formatCurrency } from '../utils/formatters';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const { products, addToCart } = useProductStore();

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
    toast.success('Produto adicionado ao carrinho');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 font-poppins">Produtos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 font-poppins mb-2">{product.name}</h3>
              <p className="text-sm text-gray-500 font-poppins mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 font-poppins">
                  {formatCurrency(product.price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-poppins"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
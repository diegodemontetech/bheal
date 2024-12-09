import React, { useState } from 'react';
import { useProductStore } from '../store/productStore';
import { formatCurrency } from '../utils/formatters';
import { Package, CreditCard, Truck, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, products, removeFromCart, updateCartQuantity } = useProductStore();
  const [selectedClient, setSelectedClient] = useState(null);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  });

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast.error('Quantidade maior que o estoque disponível');
      return;
    }
    updateCartQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removido do carrinho');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900 font-poppins">Carrinho</h1>

      {/* Client */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4 font-poppins">Cliente</h2>
        <input
          type="text"
          placeholder="Buscar cliente..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-poppins"
        />
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4 font-poppins flex items-center">
          <Package className="w-4 h-4 mr-2" />
          Produtos
        </h2>

        <div className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <div key={item.productId} className="py-4 flex items-center">
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900 font-poppins">
                  {item.product?.name}
                </h3>
                <p className="text-sm text-gray-500 font-poppins">
                  {formatCurrency(item.product?.price || 0)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                    className="w-16 text-center rounded-md border-gray-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <div className="text-right">
            <span className="text-sm text-gray-500 font-poppins">Subtotal:</span>
            <span className="ml-2 text-lg font-medium text-gray-900 font-poppins">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4 font-poppins flex items-center">
          <CreditCard className="w-4 h-4 mr-2" />
          Pagamento
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input type="radio" name="payment" id="boleto" />
            <label htmlFor="boleto" className="font-poppins">Boleto 30 dias</label>
          </div>
          <div className="flex items-center space-x-4">
            <input type="radio" name="payment" id="credit-card" />
            <label htmlFor="credit-card" className="font-poppins">Cartão de Crédito</label>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4 font-poppins flex items-center">
          <Truck className="w-4 h-4 mr-2" />
          Entrega
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
              CEP
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-poppins"
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-poppins"
          onClick={() => {
            if (!selectedClient) {
              toast.error('Selecione um cliente para continuar');
              return;
            }
            // Handle checkout
          }}
        >
          Finalizar Orçamento
        </button>
      </div>
    </div>
  );
}
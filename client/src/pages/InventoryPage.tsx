import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, AlertTriangle, Store, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useSupermarketStore } from '../store/supermarketStore';
import type { Product } from '../types';
import { ProductModal } from '../components/inventory/ProductModal';

export const InventoryPage = () => {
    const user = useAuthStore((state) => state.user);
    const { products, fetchProducts, deleteProduct, isLoading: isLoadingProducts } = useProductStore();
    const { supermarkets, fetchSupermarkets } = useSupermarketStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    
    // Estado para saber de qué supermercado estamos viendo el inventario
    const [selectedSupermarketId, setSelectedSupermarketId] = useState<string>('');
    // Estado para barra de búsqueda local
    const [searchTerm, setSearchTerm] = useState('');

    // Lógica inicial de Roles y Set supermarket ID for manager/worker users
    useEffect(() => {
        if (!user) return;

        if (user.role === 'admin' || user.role === 'provider') {
            // Si es Admin, cargamos la lista de supermercados para el dropdown
            fetchSupermarkets();
        }
    }, [user, fetchSupermarkets]);

    // Set supermarket ID for manager/worker users in a separate effect
    useEffect(() => {
            if (!user) return;

            // Extraemos el ID del supermercado del usuario de forma segura
            const userSupermarketId = typeof user.supermarket === 'object' 
                ? user.supermarket?._id 
                : user.supermarket;

            if (user.role === 'admin' || user.role === 'provider') {
                // Si es Admin o Proveedor, cargamos la lista de supermercados para el dropdown
                fetchSupermarkets();
            } else if (userSupermarketId) {
                setSelectedSupermarketId((prevId) => 
                    prevId !== userSupermarketId ? userSupermarketId : prevId
                );
            }
        }, [user, fetchSupermarkets]);

    // Cada vez que cambie el supermercado seleccionado, traemos sus productos
    useEffect(() => {
        if (selectedSupermarketId) {
            fetchProducts(selectedSupermarketId);
        }
    }, [selectedSupermarketId, fetchProducts]);

    // Funciones de la Modal
    const handleOpenCreate = () => {
        if (!selectedSupermarketId) return; // Protección
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    // Filtrar productos por la barra de búsqueda (SKU o Nombre)
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className="space-y-6">
            {/* --- ENCABEZADO Y SELECTOR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-full md:w-auto space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {/* Cambiado a rose-600 */}
                            <Package className="text-rose-600" /> 
                            Inventario
                        </h1>
                        <p className="text-gray-500">Gestiona los productos y el stock.</p>
                    </div>

                    {/* Mostrar Selector SOLO a Admin y Provider */}
                    {(user?.role === 'admin' || user?.role === 'provider') && (
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sucursal:</label>
                            <div className="relative w-full sm:w-64">
                                <Store className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <select 
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-600 outline-none appearance-none bg-gray-50"
                                    value={selectedSupermarketId}
                                    onChange={(e) => setSelectedSupermarketId(e.target.value)}
                                >
                                    <option value="" disabled>Seleccione una sucursal...</option>
                                    {supermarkets.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Buscador y Botón Nuevo */}
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o SKU..." 
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-600 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Provider NO puede crear productos */}
                    {user?.role !== 'provider' && (
                        <button 
                            onClick={handleOpenCreate} 
                            disabled={!selectedSupermarketId}
                            className="flex items-center justify-center gap-2 bg-rose-700 text-white px-4 py-2 rounded-lg hover:bg-rose-800 transition-all shadow-md active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Plus size={18} />
                            Nuevo Producto
                        </button>
                    )}
                </div>
            </div>

            {/* --- TABLA DE PRODUCTOS --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4 text-right">Precio</th>
                                <th className="px-6 py-4 text-center">Stock</th>
                                {user?.role !== 'provider' && <th className="px-6 py-4 text-center">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* ESTADOS DE CARGA Y VACÍO */}
                            {!selectedSupermarketId ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-500">
                                        <Store className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        Selecciona un supermercado para ver su inventario.
                                    </td>
                                </tr>
                            ) : isLoadingProducts ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        {/* Spinner cambiado a rose-600 */}
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-500">
                                        <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            ) : (
                                /* RENDER DE PRODUCTOS */
                                filteredProducts.map((product) => {
                                    const isLowStock = product.stock <= product.minStock;

                                    return (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                                    {product.category || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isLowStock ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700'}`}>
                                                    {isLowStock && <AlertTriangle size={12} />}
                                                    {product.stock}
                                                </span>
                                            </td>
                                            
                                            {user?.role !== 'provider' && (
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleOpenEdit(product)}
                                                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <ProductModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    productToEdit={productToEdit}
                    supermarketId={selectedSupermarketId} // Le pasamos el ID para que sepa dónde crearlo
                />
            )}

        </div>
    );
};
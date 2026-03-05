import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { useSupermarketStore } from '../store/supermarketStore';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const Dashboard = () => {
    // --- ESTADO GLOBAL: Supermercados ---
    const supermarkets = useSupermarketStore((state) => state.supermarkets);
    const activeSupermarketId = useSupermarketStore((state) => state.activeSupermarketId);
    const fetchSupermarkets = useSupermarketStore((state) => state.fetchSupermarkets);
    const setActiveSupermarket = useSupermarketStore((state) => state.setActiveSupermarket);

    // --- ESTADO GLOBAL: Productos/Stats ---
    const dashboardStats = useProductStore((state) => state.dashboardStats);
    const isLoading = useProductStore((state) => state.isLoading);
    const error = useProductStore((state) => state.error);
    const fetchDashboardStats = useProductStore((state) => state.fetchDashboardStats);

    // Cargar la lista de supermercados al montar el componente
    useEffect(() => {
        fetchSupermarkets();
    }, [fetchSupermarkets]);

    // Cargar stats cada vez que cambie el supermercado seleccionado
    useEffect(() => {
        if (activeSupermarketId) {
            fetchDashboardStats(activeSupermarketId);
        }
    }, [activeSupermarketId, fetchDashboardStats]);

    // Manejo de estados de carga y error
    if (isLoading && !dashboardStats) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Cargando StockMaster...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 font-semibold underline">Error de conexión</p>
                <button 
                    onClick={() => activeSupermarketId && fetchDashboardStats(activeSupermarketId)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            
            {/* --- Encabezado Dinámico --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Resumen del Inventario</h1>
                    <p className="text-sm text-gray-500">Visualiza el estado actual de tu sucursal en tiempo real.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                    <label htmlFor="sucursal" className="text-xs font-bold uppercase text-gray-400 ml-2">
                        Sucursal
                    </label>
                    <select 
                        id="sucursal"
                        value={activeSupermarketId || ''} 
                        onChange={(e) => setActiveSupermarket(e.target.value)}
                        className="bg-gray-50 border-none text-gray-900 text-sm rounded-lg focus:ring-0 block w-full p-2 font-medium cursor-pointer"
                    >
                        {supermarkets.length > 0 ? (
                            supermarkets.map((s) => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))
                        ) : (
                            <option value="">Cargando sucursales...</option>
                        )}
                    </select>
                </div>
            </div>

            {!dashboardStats ? (
                <div className="text-center py-20 text-gray-400">Selecciona una sucursal para ver los datos.</div>
            ) : (
                <>
                    {/* --- SECCIÓN 1: Tarjetas KPI --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {/* Cambiado de blue-500 a rose-800 (Guinda) */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-rose-800">
                            <h3 className="text-sm text-gray-500 font-medium">Productos Totales</h3>
                            <p className="text-3xl font-bold text-gray-800">{dashboardStats.kpis.totalProducts}</p>
                        </div>
                        {/* Mantenemos verde por ser dinero/valor */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-sm text-gray-500 font-medium">Valor Total</h3>
                            <p className="text-3xl font-bold text-gray-800">${dashboardStats.kpis.totalValue.toLocaleString()}</p>
                        </div>
                        {/* Cambiado de purple-500 a rose-600 para mantener la armonía de la paleta cálida */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-rose-600">
                            <h3 className="text-sm text-gray-500 font-medium">Categorías</h3>
                            <p className="text-3xl font-bold text-gray-800">{dashboardStats.kpis.totalCategories}</p>
                        </div>
                        {/* Mantenemos rojo por ser alerta de stock crítico */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
                            <h3 className="text-sm text-gray-500 font-medium">Stock Crítico</h3>
                            <p className="text-3xl font-bold text-red-600">{dashboardStats.kpis.lowStockAlerts}</p>
                        </div>
                    </div>

                    {/* --- SECCIÓN 2: Gráficas y Tablas --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Gráfica de Categorías */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 text-gray-700">Distribución por Categoría</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardStats.charts.productsByCategory}
                                            cx="50%" cy="50%"
                                            innerRadius={60} outerRadius={90}
                                            paddingAngle={5} dataKey="value"
                                        >
                                            {dashboardStats.charts.productsByCategory.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tabla de Reabastecimiento Urgente */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Reabastecimiento Urgente
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3">Stock</th>
                                            <th className="px-4 py-3">Mín.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {dashboardStats.tables.lowestStock.length > 0 ? (
                                            dashboardStats.tables.lowestStock.map((product) => (
                                                <tr key={product._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                                    <td className="px-4 py-3 text-red-600 font-bold">
                                                        {product.stock}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-400">
                                                        {product.minStock}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-10 text-center text-gray-400 italic">
                                                    ✅ No hay productos en estado crítico actualmente.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
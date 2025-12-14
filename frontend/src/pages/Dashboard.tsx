import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer'; 

interface Sweet {
  id: number;
  name: string;
  price: string;
  category: string;
  quantity: number;
}

export default function Dashboard() {
  const { logout, user, isAuthenticated, isAdmin } = useAuth();
  const { addToCart, cartCount } = useCart(); // <--- Get Cart Actions
  const navigate = useNavigate();
  
  // Data States
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [actionId, setActionId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // <--- Cart Drawer State
  
  // Admin: Creation State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSweet, setNewSweet] = useState({ name: '', price: '', category: '', quantity: '' });

  // Admin: Edit State
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get('/sweets');
      setSweets(res.data);
    } catch (error) {
      console.error('Failed to fetch sweets', error);
    } finally {
      setLoading(false);
    }
  };

  // --- CUSTOMER ACTION: ADD TO CART ---
  const handleBuy = (id: number) => {
    if (!isAuthenticated) return navigate('/login');
    
    // Find the full sweet object based on ID
    const sweet = sweets.find(s => s.id === id);
    if (!sweet) return;

    // Add to Global Cart Context
    addToCart({
      id: sweet.id,
      name: sweet.name,
      price: parseFloat(sweet.price),
      quantity: 1,
      maxStock: sweet.quantity
    });
    
    // Optional: Open drawer automatically
    // setIsCartOpen(true); 
  };

  // --- ADMIN ACTIONS ---
  const handleRestock = async (id: number, amount: number) => {
    if (amount <= 0) return alert("Please enter a valid amount");
    setActionId(id);
    try {
      const res = await api.post(`/sweets/${id}/restock`, { amount });
      updateStockLocally(id, res.data.quantity);
      alert(`Successfully added ${amount} items.`);
    } catch (error: any) {
      alert('Restock failed: ' + error.response?.data?.message);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this sweet?")) return;
    setActionId(id);
    try {
      await api.delete(`/sweets/${id}`);
      setSweets(current => current.filter(s => s.id !== id));
    } catch (error: any) {
      alert('Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newSweet.name,
        price: parseFloat(newSweet.price),
        category: newSweet.category,
        quantity: parseInt(newSweet.quantity)
      };
      const res = await api.post('/sweets', payload);
      setSweets([...sweets, res.data]);
      setShowCreateForm(false);
      setNewSweet({ name: '', price: '', category: '', quantity: '' });
      alert('Sweet created successfully!');
    } catch (error: any) {
      alert('Failed to create sweet: ' + error.response?.data?.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSweet) return;

    try {
      const payload = {
        name: editingSweet.name,
        price: parseFloat(editingSweet.price),
        category: editingSweet.category
      };

      const res = await api.patch(`/sweets/${editingSweet.id}`, payload);
      
      setSweets(current => current.map(s => s.id === editingSweet.id ? { ...s, ...res.data } : s));
      setEditingSweet(null);
      alert('Sweet updated successfully!');
    } catch (error: any) {
      alert('Update failed: ' + error.response?.data?.message);
    }
  };

  const updateStockLocally = (id: number, newQuantity: number) => {
    setSweets(current => current.map(s => s.id === id ? { ...s, quantity: newQuantity } : s));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 relative">
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight cursor-pointer" onClick={() => navigate('/')}>🍬 Sweet Shop</h1>
        
        <div className="flex items-center">
          {/* CART ICON (Only for Customers/Guests) */}
          {!isAdmin && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative mr-6 p-2 text-gray-600 hover:text-blue-600 transition-transform active:scale-95"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* ACCOUNT DROPDOWN */}
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600">
              {user ? user.role.toUpperCase() : 'Account'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                    <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Catalogue</h2>
            <p className="text-gray-500">Manage your inventory</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
            >
              <span>+ Add New Sweet</span>
            </button>
          )}
        </div>

        {/* --- MODAL 1: CREATE FORM --- */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Item</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                  <input required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newSweet.name} onChange={e => setNewSweet({...newSweet, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                    <input required type="number" step="0.01" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newSweet.price} onChange={e => setNewSweet({...newSweet, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qty</label>
                    <input required type="number" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newSweet.quantity} onChange={e => setNewSweet({...newSweet, quantity: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <input required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newSweet.category} onChange={e => setNewSweet({...newSweet, category: e.target.value})} />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="text-gray-600 hover:bg-gray-100 px-5 py-2 rounded-lg font-medium transition">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 2: EDIT FORM --- */}
        {editingSweet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all border-t-4 border-blue-500">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Sweet</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                  <input required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingSweet.name} onChange={e => setEditingSweet({...editingSweet, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                    <input required type="number" step="0.01" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingSweet.price} onChange={e => setEditingSweet({...editingSweet, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <input required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingSweet.category} onChange={e => setEditingSweet({...editingSweet, category: e.target.value})} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">Note: Use 'Restock' to change quantity.</p>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setEditingSweet(null)} className="text-gray-600 hover:bg-gray-100 px-5 py-2 rounded-lg font-medium transition">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="text-center mt-20 text-gray-400 animate-pulse">Loading sweets...</div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-xl text-gray-500 mb-2">The shop is empty!</p>
            {isAdmin && <p className="text-blue-600">Click "+ Add New Sweet" to get started.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sweets.map((sweet) => (
              <ProductCard 
                key={sweet.id}
                sweet={sweet}
                isAdmin={!!isAdmin}
                loading={actionId === sweet.id}
                onAction={isAdmin ? handleDelete : handleBuy} // Admin = Delete, Customer = AddToCart
                onRestock={handleRestock}
                onEdit={setEditingSweet}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
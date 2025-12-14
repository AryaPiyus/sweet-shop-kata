import { motion } from 'framer-motion';

interface ProductCardProps {
  sweet: {
    id: number;
    name: string;
    price: string;
    category: string;
    quantity: number;
  };
  isAdmin: boolean;
  onAction: (id: number) => void; // Used for Delete (Admin) or Buy (Customer)
  onRestock?: (id: number, amount: number) => void;
  onEdit?: (sweet: any) => void; // New prop for opening the Edit Modal
  loading: boolean;
}

export default function ProductCard({ sweet, isAdmin, onAction, onRestock, onEdit, loading }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
      className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      {/* --- Visual Header (Icon & Category) --- */}
      <div className="h-48 bg-gradient-to-br from-rose-100 to-teal-50 relative overflow-hidden flex items-center justify-center">
        <motion.div 
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="text-8xl drop-shadow-md cursor-pointer select-none"
        >
          🍭
        </motion.div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm uppercase tracking-wide">
          {sweet.category}
        </div>
      </div>

      {/* --- Content Body --- */}
      <div className="p-6">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
          <span className="text-lg font-semibold text-blue-600">${Number(sweet.price).toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 mb-6 text-sm">
           {/* Animated Stock Indicator */}
           <div className={`w-2 h-2 rounded-full ${sweet.quantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
           <span className={sweet.quantity < 5 ? "text-red-500 font-medium" : "text-gray-500"}>
             {sweet.quantity === 0 ? "Sold Out" : `${sweet.quantity} in stock`}
           </span>
        </div>

        {/* --- Action Buttons (Admin vs Customer) --- */}
        {isAdmin ? (
             <div className="space-y-3">
               {/* Row 1: Restock Input & Button */}
               <div className="flex gap-2">
                 <input 
                   type="number" 
                   id={`restock-${sweet.id}`}
                   placeholder="+0" 
                   className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 text-center text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                 />
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     const input = document.getElementById(`restock-${sweet.id}`) as HTMLInputElement;
                     if(onRestock) onRestock(sweet.id, Number(input.value));
                     input.value = '';
                   }}
                   className="flex-1 bg-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors"
                 >
                   RESTOCK
                 </motion.button>
               </div>
               
               {/* Row 2: Edit & Delete Buttons */}
               <div className="flex gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit && onEdit(sweet)} 
                    className="flex-1 bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    EDIT DETAILS
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction(sweet.id)}
                    className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    DELETE
                  </motion.button>
               </div>
             </div>
        ) : (
            // Customer "Add to Cart" Button
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onAction(sweet.id)}
              disabled={sweet.quantity === 0 || loading}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                sweet.quantity === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
              }`}
            >
              {sweet.quantity === 0 ? 'Notify Me' : loading ? 'Processing...' : 'Add to Cart'}
            </motion.button>
        )}
      </div>
    </motion.div>
  );
}
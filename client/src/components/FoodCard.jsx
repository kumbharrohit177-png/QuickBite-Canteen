import { Plus, Clock } from 'lucide-react';

export default function FoodCard({ item, onAdd }) {
    return (
        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:-translate-y-1">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-lg tracking-wide uppercase">
                    {item.category}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-xl drop-shadow-md">₹{item.price}</p>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{item.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-100">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${item.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        {item.available ? 'Available' : 'Sold Out'}
                    </div>

                    <button
                        onClick={() => onAdd(item)}
                        disabled={!item.available}
                        className={`
                        relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 group/btn
                        ${item.available
                                ? 'bg-gray-900 text-white hover:bg-primary hover:shadow-orange-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Add <Plus className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

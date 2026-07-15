import { useEffect, useMemo, useState } from "react";
import PackingItem from "./PackingItem";
import { generatePackingList } from "../../services/packingService";

export default function PackingList({
  destination,
  days,
  weather,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Clothing");

  const storageKey = `packing_list_${destination}`;

  // Load packing list from LocalStorage cache, or generate via AI
  useEffect(() => {
    if (!destination) return;

    const cached = localStorage.getItem(storageKey);
    if (cached) {
      setItems(JSON.parse(cached));
      return;
    }

    async function loadPackingList() {
      setLoading(true);
      try {
        const data = await generatePackingList({
          destination,
          days,
          weather,
        });

        const formatted = data.map((item) => ({
          ...item,
          checked: false,
        }));

        setItems(formatted);
        localStorage.setItem(storageKey, JSON.stringify(formatted));
      } catch (err) {
        console.error("Packing List Generation Error:", err);
      }
      setLoading(false);
    }

    loadPackingList();
  }, [destination, days, weather]);

  // Save changes to LocalStorage whenever items state changes
  const updateItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem(storageKey, JSON.stringify(newItems));
  };

  // Toggle item status
  function toggleItem(index) {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    updateItems(newItems);
  }

  // Add custom item
  const handleAddItem = (e) => {
    e.preventDefault();
    const name = newItemName.trim();
    if (!name) return;

    const newItem = {
      item: name,
      category: newItemCategory,
      checked: false,
    };

    const newItems = [...items, newItem];
    updateItems(newItems);
    setNewItemName("");
  };

  // Delete item
  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateItems(newItems);
  };

  const packedCount = items.filter((item) => item.checked).length;
  const progress = items.length === 0 ? 0 : Math.round((packedCount / items.length) * 100);

  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach((item, index) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      // Keep track of the original index in the flat array
      groups[item.category].push({ ...item, originalIndex: index });
    });
    return groups;
  }, [items]);

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-slate-300">
        Generating AI Smart Packing List for {destination}...
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 border border-slate-700/35">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            🎒 Smart Packing List
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Packed {packedCount} of {items.length} items
          </p>
        </div>

        {/* Clear Cache/Reset Button */}
        <button
          onClick={() => {
            if (window.confirm("Reset list to AI recommendations? All custom items and checks will be cleared.")) {
              localStorage.removeItem(storageKey);
              window.location.reload();
            }
          }}
          className="text-xs border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-xl transition duration-300"
        >
          🔄 Reset List
        </button>
      </div>

      {/* Progress Bar with Glowing effects */}
      <div className="w-full bg-slate-800 rounded-full h-3.5 mb-6 overflow-hidden relative shadow-inner">
        <div
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 grid sm:grid-cols-3 gap-3 mb-8">
        <input
          type="text"
          placeholder="Add custom item (e.g. Hiking shoes)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="sm:col-span-1 p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-slate-700 outline-none focus:border-cyan-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-slate-700 outline-none"
        >
          <option>Documents</option>
          <option>Clothing</option>
          <option>Electronics</option>
          <option>Health</option>
          <option>Accessories</option>
          <option>Toiletries</option>
          <option>Miscellaneous</option>
        </select>

        <button type="submit" className="primary-btn text-xs py-2 border-none">
          ➕ Add Custom Item
        </button>
      </form>

      {/* Categorized Items */}
      {items.length === 0 ? (
        <p className="text-slate-400 text-center py-6 text-sm">Add some items to get started!</p>
      ) : (
        Object.keys(groupedItems).map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-bold text-cyan-300 mb-3 border-b border-slate-800/80 pb-1.5">
              {category}
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              {groupedItems[category].map((item) => (
                <PackingItem
                  key={item.originalIndex}
                  item={item}
                  checked={item.checked}
                  onToggle={() => toggleItem(item.originalIndex)}
                  onDelete={() => handleDeleteItem(item.originalIndex)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
import { Cash } from '@/app/admin/cash/page';

interface Props {
  selected: Cash;
  onChange: (
    field: keyof Cash,
    value: Cash[keyof Cash]
  ) => void;
}

export default function EditProductModalComp({ selected, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Cash</h2>

      <form>
        {/* Cash Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Cash Type</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.cash_type}
            onChange={(e) => onChange('cash_type', e.target.value)}
          />
        </div>

        {/* Cash */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Cash</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.cash}
            onChange={(e) => onChange('cash', e.target.value)}
            onFocus={(e) => e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false })}
            onBlur={(e) => e.target.removeEventListener('wheel', (ev) => ev.preventDefault())}
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.stock}
            onChange={(e) => onChange('stock', e.target.value)}
            onFocus={(e) => e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false })}
            onBlur={(e) => e.target.removeEventListener('wheel', (ev) => ev.preventDefault())}
          />
        </div>

      </form>
    </div>
  );
}

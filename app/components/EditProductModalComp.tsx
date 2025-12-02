import { Product } from '@/app/interface/Product';
import { useState } from 'react';

interface Props {
  selected: Product;
  onChange: (
    field: keyof Product,
    value: Product[keyof Product]
  ) => void;
}

export default function EditProductModalComp({ selected, onChange }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const BASE_URL_IMAGE = process.env.NEXT_PUBLIC_IMAGE_URL;
  function handlePreviewImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onChange('image', file);
    setImageError(false); // reset error

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  const imageToShow =
    previewImage || (selected.image ? `${BASE_URL_IMAGE}/products/${selected.image}` : null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      <form>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.title}
            onChange={(e) => onChange('title', e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.price}
            onChange={(e) => onChange('price', e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                'wheel',
                (ev) => ev.preventDefault(),
                { passive: false }
              )
            }
            onBlur={(e) =>
              e.target.removeEventListener('wheel', (ev) => ev.preventDefault())
            }
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
            onFocus={(e) =>
              e.target.addEventListener(
                'wheel',
                (ev) => ev.preventDefault(),
                { passive: false }
              )
            }
            onBlur={(e) =>
              e.target.removeEventListener('wheel', (ev) => ev.preventDefault())
            }
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <label className="border-gray-300 bg-gray-100 text-gray-700 py-2 px-3 rounded cursor-pointer inline-block">
            Choose File
            <input type="file" className="hidden" onChange={handlePreviewImage} />
          </label>
        </div>

        {/* Preview */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Image Preview</label>
          <div className="w-full h-48 border border-gray-300 rounded bg-gray-100 flex items-center justify-center">
            {imageToShow && !imageError ? (
              <img
                src={imageToShow}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-gray-400">Image not found</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

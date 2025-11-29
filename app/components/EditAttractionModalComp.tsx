import { Attraction } from '@/app/admin/attractions/page';

interface Props {
  selected: Attraction;
  onChange: (
    field: keyof Attraction,
    value: Attraction[keyof Attraction]
  ) => void;
}

export default function EditAttractionModalComp({ selected, onChange }: Props) {
  function handlePreviewImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onChange('cover_image', file); // ส่งไฟล์ขึ้นไปให้ parent

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewElement = document.getElementById(
        'image-preview'
      ) as HTMLDivElement;

      if (previewElement) {
        previewElement.style.backgroundImage = `url(${reader.result})`;
        previewElement.style.backgroundRepeat = 'no-repeat';

      }
    };
    reader.readAsDataURL(file);
  }
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Attraction</h2>

      <form>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
            value={selected.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selected.location}
            onChange={(e) => onChange('location', e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <input type="file" className="w-full" onChange={handlePreviewImage} />
        </div>

        {/* Preview */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Image Preview
          </label>
          <div
            id="image-preview"
            className="w-full h-48 border border-gray-300 rounded bg-gray-100 bg-center bg-contain"
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundImage:
                typeof selected.cover_image === 'string'
                  ? `url(${BASE_URL}/uploads/attractions/${selected.cover_image})`
                  : undefined,
            }}
          ></div>
        </div>
      </form>
    </div>
  );
}

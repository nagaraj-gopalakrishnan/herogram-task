'use client';

import { useEffect, useState } from 'react';

export default function GeneratePage() {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [referenceImage, setReferenceImage] = useState('');
  const [count, setCount] = useState(5); // Default to 5
  const [message, setMessage] = useState('');
  const [tempIds, setTempIds] = useState<number[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load stored form values
  useEffect(() => {
    const storedTitle = localStorage.getItem('title');
    const storedInstructions = localStorage.getItem('instructions');
    const storedRef = localStorage.getItem('referenceImage');

    if (storedTitle) setTitle(storedTitle);
    if (storedInstructions) setInstructions(storedInstructions);
    if (storedRef) setReferenceImage(storedRef);

    fetchGallery();
  }, []);

  useEffect(() => {
    localStorage.setItem('title', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('instructions', instructions);
  }, [instructions]);

  useEffect(() => {
    localStorage.setItem('referenceImage', referenceImage);
  }, [referenceImage]);

  // Auto refresh gallery every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGallery();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchGallery = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setGallery(data.data);
  };

const generateImages = async () => {
  setMessage('');
  setIsGenerating(true);
  const ids: number[] = [];
  const placeholderImages: any[] = [];

  for (let i = 0; i < count; i++) {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, instructions, referenceImage }),
    });
    const data = await res.json();
    if (data.success && data.id) {
      ids.push(data.id);
      placeholderImages.push({
        id: data.id,
        title,
        instructions,
        referenceImage,
        status: 'creating prompt',
        imageUrl: null,
        createdAt: new Date().toISOString(),
      });
    }
  }

  setTempIds(ids); // ⬅️ THIS triggers Generation Progress block
  setGallery((prev: any[]) => [...placeholderImages, ...prev]); // ⬅️ THIS shows immediate placeholder progress
  setMessage('Image generation started. Updates will appear below.');
  setIsGenerating(false);
};


  const handleSubmit = (e: any) => {
    e.preventDefault();
    generateImages();
  };

  const handleRegenerate = () => {
    generateImages();
  };

  const getStatusClass = (status: string) => {
    return status === 'done'
      ? 'text-green-600'
      : status === 'creating image'
      ? 'text-blue-600'
      : status === 'creating prompt'
      ? 'text-yellow-600'
      : 'text-red-600';
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-6 hidden md:block">
        <h2 className="text-xl font-semibold mb-4">AI Image Generator</h2>
        <div className="text-sm text-gray-600">{title || 'No title'}</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Create Paintings</h1>

        {/* Reference Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reference Image (optional)</label>
          <input
            type="text"
            placeholder="Paste image URL"
            value={referenceImage}
            onChange={(e) => setReferenceImage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Paintings</label>
            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2"
              disabled={isGenerating}
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`px-5 py-2 text-white rounded ${
              isGenerating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Paintings'}
          </button>

          {tempIds.length > 0 && !isGenerating && (
            <button
              type="button"
              onClick={handleRegenerate}
              className="ml-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Generate More
            </button>
          )}

          {message && <p className="text-green-600 font-medium">{message}</p>}
        </form>

        {/* Generation Progress */}
        {tempIds.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Generation Progress</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {tempIds.map((id) => {
                const entry = gallery.find((g) => g.id === id);
                return (
                  <div key={id} className="border p-2 rounded bg-white shadow min-w-[160px]">
                    {entry?.imageUrl ? (
                      <img src={entry.imageUrl} className="h-32 w-full object-cover rounded mb-2" />
                    ) : (
                      <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                        {entry?.status || 'Waiting...'}
                      </div>
                    )}
                    <div className={`text-xs ${getStatusClass(entry?.status || '')}`}>
                      Status: {entry?.status || 'queued'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Gallery */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Gallery</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gallery.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
              >
                {entry.imageUrl ? (
                  <img src={entry.imageUrl} alt="Generated" className="h-48 w-full object-cover" />
                ) : entry.referenceImage ? (
                  <img
                    src={entry.referenceImage}
                    alt="Reference"
                    className="h-48 w-full object-cover grayscale opacity-80"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                    Image Not Ready
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{entry.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{entry.instructions}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Status: <span className={getStatusClass(entry.status)}>{entry.status}</span>
                    </span>

                    {entry.imageUrl && (
                      <a
                        href={entry.imageUrl}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

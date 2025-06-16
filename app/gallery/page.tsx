'use client';
import { useEffect, useState } from 'react';

export default function GalleryPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setEntries(data.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Gallery</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry: any) => (
          <div
            key={entry.id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
          >
            {/* Header Image */}
            {entry.imageUrl ? (
              <img
                src={entry.imageUrl}
                alt="Generated"
                className="h-48 w-full object-cover"
              />
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

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {entry.title}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{entry.instructions}</p>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  Status:{' '}
                  <span
                    className={
                      entry.status === 'done'
                        ? 'text-green-600'
                        : entry.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {entry.status}
                  </span>
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
  );
}

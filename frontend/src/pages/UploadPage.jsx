import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [printType, setPrintType] = useState('B/W');
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    const randomToken = `SPX-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('activeToken', randomToken);
    localStorage.setItem('printType', printType);
    navigate('/token');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #F5F5DC 0%, #EEF5FF 100%)' }}
    >
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{
              background: 'linear-gradient(135deg, #1565C0, #0A192F)',
              boxShadow: '0 8px 24px rgba(21,101,192,0.35)',
            }}
          >
            📄
          </div>
          <h1 className="text-3xl font-black text-[#0A192F]">Upload Document</h1>
          <p className="text-gray-500 text-sm mt-1">
            Encrypted end-to-end · Auto-deleted after printing
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer"
              style={{
                borderColor: file ? '#43A047' : dragOver ? '#1565C0' : '#D1D5DB',
                background: file
                  ? 'rgba(67,160,71,0.05)'
                  : dragOver
                  ? 'rgba(21,101,192,0.05)'
                  : '#FAFAFA',
              }}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="text-5xl mb-3">
                  {file ? '✅' : dragOver ? '📂' : '📁'}
                </div>
                <p className="font-bold text-[#0A192F] text-base">
                  {file ? file.name : 'Drag & drop or click to browse'}
                </p>
                <p className="text-xs text-gray-400 mt-1.5 font-medium">
                  PDF · DOCX · PNG — Max 10 MB
                </p>
              </label>
            </div>

            {/* Print mode */}
            <div>
              <label className="block text-xs font-bold text-[#0A192F] uppercase tracking-widest mb-3">
                Print Mode
              </label>
              <div className="flex gap-3">
                {[
                  { type: 'B/W', icon: '⬛', desc: 'Black & White' },
                  { type: 'Color', icon: '🎨', desc: 'Full Color' },
                ].map(({ type, icon, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPrintType(type)}
                    className="flex-1 py-4 rounded-2xl font-bold border-2 transition-all duration-200 text-sm flex flex-col items-center gap-1"
                    style={{
                      borderColor: printType === type ? '#1565C0' : '#E5E7EB',
                      background: printType === type
                        ? 'linear-gradient(135deg, #1565C0, #0D47A1)'
                        : '#F9FAFB',
                      color: printType === type ? '#fff' : '#9CA3AF',
                      boxShadow: printType === type
                        ? '0 4px 14px rgba(21,101,192,0.35)'
                        : 'none',
                      transform: printType === type ? 'translateY(-2px)' : 'none',
                    }}
                  >
                    <span className="text-xl">{icon}</span>
                    <span>{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Copies */}
            <Input label="Number of Copies" type="number" defaultValue="1" min="1" />

            <Button type="submit" className="w-full py-4 text-base mt-2">
              🔒 &nbsp; Generate Secure Token
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

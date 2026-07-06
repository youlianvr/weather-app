import { useState } from 'react';
import { Music, X } from 'lucide-react';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`music-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Песенка Львёнка и Черепахи"
      >
        <Music size={18} />
        <span className="music-btn-label">🎵 Музыка</span>
      </button>

      {isOpen && (
        <div className="music-panel">
          <div className="music-panel-header">
            <div>
              <div className="music-panel-title">Я на солнышке лежу</div>
              <div className="music-panel-sub">🦁 Львёнок и Черепаха</div>
            </div>
            <button className="music-close" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="music-embed">
            <iframe
              src={`https://www.youtube.com/embed/mrVygVP5PLU?autoplay=${isOpen ? 1 : 0}&loop=1&playlist=mrVygVP5PLU`}
              title="Я на солнышке лежу"
              allow="autoplay; encrypted-media"
              className="music-iframe"
            />
          </div>
        </div>
      )}
    </>
  );
}

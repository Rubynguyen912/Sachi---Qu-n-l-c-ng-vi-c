import React, { useState, useEffect } from 'react';
import { NoteItem, QuickLink } from '../types';
import LucideIcon from './LucideIcon';

export default function QuickNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [newNote, setNewNote] = useState('');
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [qlTitle, setQlTitle] = useState('');
  const [qlUrl, setQlUrl] = useState('');
  const [showAddQl, setShowAddQl] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('sachi_quick_notes');
    if (savedNotes) {
      try { setNotes(JSON.parse(savedNotes)); } catch (e) { console.error(e); }
    } else {
      const initial: NoteItem[] = [
        { id: 'n1', content: '🧸 Ngày 15/06: Review video bọt tắm bé bên Agency Lê Gia.', createdAt: '11/06/2026, 20:00' },
        { id: 'n2', content: '💬 Nhắc team cập nhật kịch bản TikTok cho Sachi Baby.', createdAt: '11/06/2026, 17:30' }
      ];
      setNotes(initial);
      localStorage.setItem('sachi_quick_notes', JSON.stringify(initial));
    }

    const savedLinks = localStorage.getItem('sachi_quick_links');
    if (savedLinks) {
      try { setQuickLinks(JSON.parse(savedLinks)); } catch (e) { console.error(e); }
    } else {
      const initialLinks: QuickLink[] = [
        { id: 'l1', title: 'Google Analytics Sachi', url: 'https://analytics.google.com' },
        { id: 'l2', title: 'TikTok Sponsor Ads', url: 'https://ads.tiktok.com' }
      ];
      setQuickLinks(initialLinks);
      localStorage.setItem('sachi_quick_links', JSON.stringify(initialLinks));
    }
  }, []);

  const saveNotesToStorage = (updated: NoteItem[]) => {
    setNotes(updated);
    localStorage.setItem('sachi_quick_notes', JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const item: NoteItem = {
      id: `note-${Date.now()}`,
      content: newNote.trim(),
      createdAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    };
    const updated = [item, ...notes];
    saveNotesToStorage(updated);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotesToStorage(updated);
  };

  const handleAddQuickLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qlTitle.trim() || !qlUrl.trim()) return;
    let urlString = qlUrl.trim();
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'https://' + urlString;
    }
    const item: QuickLink = {
      id: `ql-${Date.now()}`,
      title: qlTitle.trim(),
      url: urlString
    };
    const updated = [...quickLinks, item];
    setQuickLinks(updated);
    localStorage.setItem('sachi_quick_links', JSON.stringify(updated));
    setQlTitle('');
    setQlUrl('');
    setShowAddQl(false);
  };

  const handleDeleteQuickLink = (id: string) => {
    const updated = quickLinks.filter(l => l.id !== id);
    setQuickLinks(updated);
    localStorage.setItem('sachi_quick_links', JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Quick Notes Card */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-sky-50">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <LucideIcon name="FileText" size={18} />
              </span>
              <h3 className="font-display font-semibold text-slate-800">Ghi chú & Nhắc việc nhanh</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{notes.length} ghi chú</span>
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Thêm nhanh công việc cần nhớ hôm nay..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-sky-200 focus:border-sky-300 transition-all text-slate-700"
            />
            <button
              type="submit"
              className="p-1.5 px-3 bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              Lưu
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center italic">Chưa có ghi chú nào. Hãy thêm ghi chú ở trên!</p>
          ) : (
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start justify-between gap-2 p-2 bg-gradient-to-r from-teal-50/10 to-sky-50/20 rounded-lg hover:from-sky-50/30 transition-colors group">
                  <div className="space-y-0.5 max-w-[85%]">
                    <p className="text-xs text-slate-700 leading-relaxed break-words">{note.content}</p>
                    <span className="text-[10px] text-slate-400 block font-mono">{note.createdAt}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Xóa ghi chú"
                  >
                    <LucideIcon name="Trash2" size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-sky-50">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                <LucideIcon name="Compass" size={18} />
              </span>
              <h3 className="font-display font-semibold text-slate-800">Liên kết thường dùng khác</h3>
            </div>
            <button
              onClick={() => setShowAddQl(!showAddQl)}
              className="p-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <LucideIcon name={showAddQl ? 'X' : 'Plus'} size={14} />
              {showAddQl ? 'Đóng' : 'Thêm'}
            </button>
          </div>

          {showAddQl && (
            <form onSubmit={handleAddQuickLink} className="p-2.5 bg-slate-50 rounded-xl space-y-2 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Tên web (vd: Canva)"
                  value={qlTitle}
                  onChange={(e) => setQlTitle(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Địa chỉ URL"
                  value={qlUrl}
                  onChange={(e) => setQlUrl(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Xác nhận thêm
              </button>
            </form>
          )}

          {quickLinks.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center italic">Chưa có liên kết phụ nào.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {quickLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2.5 bg-sky-50/15 border border-sky-100/50 rounded-xl hover:bg-sky-50/40 hover:border-sky-200 transition-all group"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-slate-700 hover:text-sky-600 truncate flex-1 block mr-1"
                    title={link.title}
                  >
                    {link.title}
                  </a>
                  <div className="flex items-center gap-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-sky-600 p-0.5 transition-colors"
                      title="Mở liên kết"
                    >
                      <LucideIcon name="ExternalLink" size={12} />
                    </a>
                    <button
                      onClick={() => handleDeleteQuickLink(link.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5 transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <LucideIcon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

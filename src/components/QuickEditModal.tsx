import React, { useState, useEffect } from 'react';
import { SachiSection, SachiMinorSection } from '../types';
import LucideIcon from './LucideIcon';

interface QuickEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SachiSection | null;
  minorSection: SachiMinorSection | null;
  onSaveSection: (updated: SachiSection) => void;
  onSaveMinorSection: (oldId: string, updated: SachiMinorSection) => void;
}

export default function QuickEditModal({
  isOpen,
  onClose,
  section,
  minorSection,
  onSaveSection,
  onSaveMinorSection,
}: QuickEditModalProps) {
  // Major section edit fields
  const [secName, setSecName] = useState('');
  const [secTitle, setSecTitle] = useState('');
  const [secUrl, setSecUrl] = useState('');
  const [secBadge, setSecBadge] = useState('');
  const [secDescription, setSecDescription] = useState('');

  // Minor section edit fields
  const [minorId, setMinorId] = useState('');
  const [minorTitle, setMinorTitle] = useState('');
  const [minorUrl, setMinorUrl] = useState('');

  useEffect(() => {
    if (section) {
      setSecName(section.name);
      setSecTitle(section.title);
      setSecUrl(section.url || '');
      setSecBadge(section.badge || '');
      setSecDescription(section.description || '');
    }
  }, [section, isOpen]);

  useEffect(() => {
    if (minorSection) {
      setMinorId(minorSection.id);
      setMinorTitle(minorSection.title);
      setMinorUrl(minorSection.url || '');
    }
  }, [minorSection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (section) {
      onSaveSection({
        ...section,
        name: secName.trim(),
        title: secTitle.trim(),
        url: secUrl.trim() || undefined,
        badge: secBadge.trim() || undefined,
        description: secDescription.trim(),
      });
    } else if (minorSection) {
      onSaveMinorSection(minorSection.id, {
        ...minorSection,
        id: minorId.trim(),
        title: minorTitle.trim(),
        url: minorUrl.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-sky-50 via-white to-emerald-50/20 border-b border-sky-100/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
              <LucideIcon name="Edit3" size={18} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-800">
                {section ? 'Sửa thông tin Mục lớn' : 'Sửa thông tin Mục nhỏ'}
              </h3>
              <p className="text-xs text-slate-400">Thay đổi tên gọi, cấu hình và đường dẫn lưu trữ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <LucideIcon name="X" size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {section && (
            <>
              {/* Heading Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên mục lớn *</label>
                <input
                  type="text"
                  required
                  value={secName}
                  onChange={(e) => setSecName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 font-semibold text-slate-800"
                  placeholder="Vd: Báo cáo và kế hoạch"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Heading code/no */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mã/Số *</label>
                  <input
                    type="text"
                    required
                    value={secTitle}
                    onChange={(e) => setSecTitle(e.target.value)}
                    className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 font-bold text-slate-700 text-center"
                    placeholder="Vd: 1"
                  />
                </div>

                {/* Badge text */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nhãn phụ / Badge</label>
                  <input
                    type="text"
                    value={secBadge}
                    onChange={(e) => setSecBadge(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 text-slate-600"
                    placeholder="Vd: Sachi S_Team"
                  />
                </div>
              </div>

              {/* Master Link */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Link liên kết tổng quan (Google Drive...)</label>
                <input
                  type="url"
                  value={secUrl}
                  onChange={(e) => setSecUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 font-mono text-sky-700"
                  placeholder="https://docs.google.com/..."
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={secDescription}
                  onChange={(e) => setSecDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 text-slate-500"
                  placeholder="Nhập mô tả tóm tắt cho mục lớn..."
                />
              </div>
            </>
          )}

          {minorSection && (
            <>
              {/* Minor heading / Group title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên mục nhỏ / Nhóm mới *</label>
                <input
                  type="text"
                  required
                  value={minorId}
                  onChange={(e) => setMinorId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-100 font-bold text-slate-800"
                  placeholder="Vd: Booking KOC"
                />
              </div>

              {/* Minor title code */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mã hiệu / Số thứ tự *</label>
                <input
                  type="text"
                  required
                  value={minorTitle}
                  onChange={(e) => setMinorTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-100 font-bold text-slate-700"
                  placeholder="Vd: 1"
                />
              </div>

              {/* Minor link */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Link liên kết tổng quan mục nhỏ (Tùy chọn)</label>
                <input
                  type="url"
                  value={minorUrl}
                  onChange={(e) => setMinorUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-100 font-mono text-sky-700"
                  placeholder="https://docs.google.com/..."
                />
              </div>
            </>
          )}

          {/* Prompt warning for ID change */}
          {minorSection && minorSection.id !== minorId && (
            <div className="p-2.5 bg-amber-50 rounded-xl text-[10px] text-amber-800 leading-relaxed border border-amber-100">
              ⚠️ <strong>Lưu ý:</strong> Thay đổi tên nhóm mục nhỏ sẽ tự động cập nhật lại nhãn tiêu đề thuộc tính nhóm của tất cả các liên kết liên quan để tránh thất lạc dữ liệu.
            </div>
          )}

          {/* Footer controls */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 text-xs font-semibold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <LucideIcon name="Check" size={14} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

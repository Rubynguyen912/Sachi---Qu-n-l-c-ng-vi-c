import React, { useState } from 'react';
import { SachiSection, SachiMinorSection } from '../types';
import LucideIcon from './LucideIcon';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SachiSection[];
  minorSections: SachiMinorSection[];
  onSaveSections: (sections: SachiSection[]) => void;
  onSaveMinorSections: (minorSections: SachiMinorSection[]) => void;
}

export default function SectionEditorModal({
  isOpen,
  onClose,
  sections,
  minorSections,
  onSaveSections,
  onSaveMinorSections,
}: SectionEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'major' | 'minor'>('major');
  
  // Local editable copies of states
  const [localSections, setLocalSections] = useState<SachiSection[]>([]);
  const [localMinorSections, setLocalMinorSections] = useState<SachiMinorSection[]>([]);

  // Sync edits on open
  React.useEffect(() => {
    if (isOpen) {
      setLocalSections(JSON.parse(JSON.stringify(sections)));
      setLocalMinorSections(JSON.parse(JSON.stringify(minorSections)));
    }
  }, [isOpen, sections, minorSections]);

  if (!isOpen) return null;

  // Handlers for Sections
  const handleUpdateSection = (index: number, key: keyof SachiSection, value: string) => {
    const updated = [...localSections];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setLocalSections(updated);
  };

  const handleAddSection = () => {
    const newId = `custom-section-${Date.now()}`;
    const newSection: SachiSection = {
      id: newId,
      title: (localSections.length + 1).toString(),
      name: `Mục lớn mới ${localSections.length + 1}`,
      description: 'Mô tả tóm tắt vai trò và danh mục tài nguyên của mục lớn này...',
      badge: 'Công cụ mới',
    };
    setLocalSections([...localSections, newSection]);
  };

  const handleDeleteSection = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục lớn này? Các liên kết thuộc mục lớn này sẽ hiển thị ở nhóm "Khác".')) {
      setLocalSections(localSections.filter(s => s.id !== id));
    }
  };

  // Handlers for Minor Sections
  const handleUpdateMinorSection = (index: number, key: keyof SachiMinorSection, value: string) => {
    const updated = [...localMinorSections];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setLocalMinorSections(updated);
  };

  const handleAddMinorSection = () => {
    const newMinor: SachiMinorSection = {
      id: `Nhóm mới ${localMinorSections.length + 1}`,
      title: (localMinorSections.length + 1).toString(),
      url: '',
    };
    setLocalMinorSections([...localMinorSections, newMinor]);
  };

  const handleDeleteMinorSection = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục nhỏ này khỏi cấu hình hiển thị?')) {
      setLocalMinorSections(localMinorSections.filter(m => m.id !== id));
    }
  };

  const handleSaveAll = () => {
    onSaveSections(localSections);
    onSaveMinorSections(localMinorSections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-3xl overflow-hidden bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col max-h-[85vh]" style={{ fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-sky-50 via-white to-emerald-50/20 border-b border-sky-100/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 text-sky-600 rounded-2xl">
              <LucideIcon name="Settings" size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">Cấu hình Mục Lớn & Mục Nhỏ</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh tiêu đề số hiệu, đổi tên, thêm link tổng quản hoặc tạo các danh mục mới</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <LucideIcon name="X" size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('major')}
            className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'major'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LucideIcon name="Layers" size={14} />
            Mục Lớn (Danh Mục)
          </button>
          <button
            onClick={() => setActiveTab('minor')}
            className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'minor'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LucideIcon name="FolderOpen" size={14} />
            Mục Nhỏ (Nhóm Tài Liệu)
          </button>
        </div>

        {/* List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'major' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Danh Sách Mục Lớn ({localSections.length})</span>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LucideIcon name="Plus" size={14} />
                  Thêm Mục Lớn Mới
                </button>
              </div>

              {localSections.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50 border border-slate-100/50 rounded-2xl">
                  Chưa có mục lớn nào được thiết lập. Vui lòng bấm thêm mới!
                </div>
              ) : (
                <div className="space-y-4">
                  {localSections.map((sec, idx) => (
                    <div 
                      key={sec.id} 
                      className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl relative space-y-3 hover:border-sky-200/65 hover:bg-slate-50 transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(sec.id)}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa mục lớn"
                      >
                        <LucideIcon name="Trash2" size={14} />
                      </button>

                      <div className="grid grid-cols-12 gap-3">
                        {/* Title Code */}
                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mã/Số *</label>
                          <input
                            type="text"
                            required
                            value={sec.title}
                            onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 text-center font-bold text-slate-700"
                            placeholder="Vd: 1"
                          />
                        </div>

                        {/* Name */}
                        <div className="col-span-9 sm:col-span-6">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tên mục lớn *</label>
                          <input
                            type="text"
                            required
                            value={sec.name}
                            onChange={(e) => handleUpdateSection(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 font-semibold text-slate-800"
                            placeholder="Mục lớn 1: Báo Cáo Marketing"
                          />
                        </div>

                        {/* Badge / Tag */}
                        <div className="col-span-12 sm:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nhãn phụ / Badge</label>
                          <input
                            type="text"
                            value={sec.badge || ''}
                            onChange={(e) => handleUpdateSection(idx, 'badge', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 text-slate-600"
                            placeholder="Sachi S_Team"
                          />
                        </div>

                        {/* URL */}
                        <div className="col-span-12 md:col-span-7">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Link liên kết tổng quan (Google Drive, Excel...)</label>
                          <input
                            type="url"
                            value={sec.url || ''}
                            onChange={(e) => handleUpdateSection(idx, 'url', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 font-mono text-sky-700"
                            placeholder="https://docs.google.com/..."
                          />
                        </div>

                        {/* Description */}
                        <div className="col-span-12 md:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mô tả ngắn</label>
                          <input
                            type="text"
                            value={sec.description}
                            onChange={(e) => handleUpdateSection(idx, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-100 text-slate-500"
                            placeholder="Bảng theo dõi báo cáo, chỉ tiêu KPI..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cấu Hình Chỉ Số / Số Mục Nhỏ ({localMinorSections.length})</span>
                <button
                  type="button"
                  onClick={handleAddMinorSection}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LucideIcon name="Plus" size={14} />
                  Thêm Mục Nhỏ Mới
                </button>
              </div>

              <div className="bg-amber-50/70 border border-amber-100/50 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed max-w-full">
                💡 <strong>Góp ý:</strong> Tên nhóm (ID) của mục nhỏ phải trùng khớp với phần "Mục nhỏ / Group" trong mục liên kết (Ví dụ: <strong>Booking KOC</strong>, <strong>Inhouse TikTok</strong> hoặc nhóm nhỏ khác bạn tự khai báo) để hệ thống tự động gán nhãn và số hiệu hiển thị chuẩn xác!
              </div>

              {localMinorSections.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50 border border-slate-100/50 rounded-2xl">
                  Chưa có cấu hình mục nhỏ nào. Vui lòng bấm thêm mới!
                </div>
              ) : (
                <div className="space-y-3">
                  {localMinorSections.map((ms, idx) => (
                    <div 
                      key={ms.id + idx} 
                      className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl relative space-y-3 hover:border-teal-200 hover:bg-slate-50 transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteMinorSection(ms.id)}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa cấu hình mục nhỏ"
                      >
                        <LucideIcon name="Trash2" size={14} />
                      </button>

                      <div className="grid grid-cols-12 gap-3.5">
                        {/* Num title */}
                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mã/Số *</label>
                          <input
                            type="text"
                            required
                            value={ms.title}
                            onChange={(e) => handleUpdateMinorSection(idx, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-100 text-center font-bold text-slate-700"
                            placeholder="Vd: 1"
                          />
                        </div>

                        {/* ID Group name */}
                        <div className="col-span-9 sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tên Nhóm / GroupTitle *</label>
                          <input
                            type="text"
                            required
                            value={ms.id}
                            onChange={(e) => handleUpdateMinorSection(idx, 'id', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-100 font-bold text-slate-800"
                            placeholder="Ví dụ: Booking KOC"
                          />
                        </div>

                        {/* Link */}
                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Link liên kết tổng quan mục nhỏ (Tùy chọn)</label>
                          <input
                            type="url"
                            value={ms.url || ''}
                            onChange={(e) => handleUpdateMinorSection(idx, 'url', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-100 font-mono text-sky-700"
                            placeholder="https://docs.google.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 font-semibold text-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white select-none hover:from-sky-600 hover:to-sky-700 shadow-sm active:scale-[0.98] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LucideIcon name="Check" size={17} />
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { DashboardLink } from '../types';
import LucideIcon from './LucideIcon';

interface LinkEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: DashboardLink) => void;
  linkToEdit: DashboardLink | null;
}

const AVAILABLE_ICONS = [
  'LineChart', 'CalendarDays', 'Target', 'Users', 'Sparkles', 
  'Droplet', 'Layers', 'Briefcase', 'Activity', 'Clock', 
  'FileSpreadsheet', 'Video', 'Compass', 'FolderOpen', 'BookOpen', 
  'FileText', 'Smartphone', 'HelpCircle'
];

export default function LinkEditorModal({ isOpen, onClose, onSave, linkToEdit }: LinkEditorModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('Báo cáo và kế hoạch');
  const [groupTitle, setGroupTitle] = useState('');
  const [subGroupTitle, setSubGroupTitle] = useState('');
  const [iconName, setIconName] = useState('FileSpreadsheet');
  const [section, setSection] = useState<'reports_plans' | 'booking_tiktok' | 'training'>('reports_plans');

  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setUrl(linkToEdit.url || '');
      setDescription(linkToEdit.description || '');
      setCategoryTitle(linkToEdit.categoryTitle);
      setGroupTitle(linkToEdit.groupTitle);
      setSubGroupTitle(linkToEdit.subGroupTitle || '');
      setIconName(linkToEdit.iconName);
      setSection(linkToEdit.section);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setCategoryTitle('Báo cáo và kế hoạch');
      setGroupTitle('');
      setSubGroupTitle('');
      setIconName('FileSpreadsheet');
      setSection('reports_plans');
    }
  }, [linkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryMapping: Record<string, 'reports_plans' | 'booking_tiktok' | 'training'> = {
      'Báo cáo và kế hoạch': 'reports_plans',
      'Booking & TikTok': 'booking_tiktok',
      'Đào tạo': 'training'
    };

    const targetSection = categoryMapping[categoryTitle] || 'reports_plans';

    const updatedLink: DashboardLink = {
      id: linkToEdit ? linkToEdit.id : `custom-${Date.now()}`,
      section: targetSection,
      categoryTitle,
      groupTitle: groupTitle.trim() || 'Khác',
      subGroupTitle: subGroupTitle.trim() || undefined,
      title: title.trim() || 'Tài liệu không tên',
      description: description.trim() || 'Không có mô tả sản phẩm/tài liệu.',
      url: url.trim() || undefined,
      iconName: iconName
    };
    onSave(updatedLink);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-xl border border-sky-100 flex flex-col max-h-[90vh]" style={{ fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-sky-50 to-emerald-50/40 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
              <LucideIcon name={linkToEdit ? 'Edit3' : 'Plus'} size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-800">
                {linkToEdit ? 'Chỉnh sửa liên kết Sachi' : 'Thêm tài liệu / link mới'}
              </h3>
              <p className="text-xs text-slate-500">
                {linkToEdit ? 'Cập nhật link báo cáo hoặc kịch bản' : 'Thêm tài liệu vận hành thương hiệu'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/80 transition-colors"
          >
            <LucideIcon name="X" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Mục lớn đại diện *</label>
            <select
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all text-slate-700"
            >
              <option value="Báo cáo và kế hoạch">Báo cáo và kế hoạch (Reports & Plans)</option>
              <option value="Booking & TikTok">Booking & TikTok (KOC & Channels)</option>
              <option value="Đào tạo">Đào tạo (Guideline & Resources)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Group Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Mục nhỏ / Group *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Booking KOC, Báo cáo"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              />
            </div>

            {/* Subgroup Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Mục con / Subgroup (Tùy chọn)</label>
              <input
                type="text"
                placeholder="Ví dụ: We Win, Chăm sóc bé yêu"
                value={subGroupTitle}
                onChange={(e) => setSubGroupTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Tên mục / File *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Kịch bản Chăm sóc bé yêu, Báo cáo Digital..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all font-medium text-slate-800"
            />
          </div>

          {/* URL */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Đường dẫn Google Sheets / Drive / TikTok</label>
              <span className="text-[10px] text-slate-400">Bỏ trống nếu chưa có (Đang cập nhật)</span>
            </div>
            <input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all font-mono text-xs text-sky-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Mô tả tóm tắt nội dung</label>
            <textarea
              rows={2}
              placeholder="Mô tả ngắn gọn vai trò của file này trong chiến dịch Sachi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
            />
          </div>

          {/* Icon Chooser */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Chọn Icon hiển thị</label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl max-h-[105px] overflow-y-auto">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setIconName(icon)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                    iconName === icon
                      ? 'bg-sky-100 text-sky-600 ring-2 ring-sky-300'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                  title={icon}
                >
                  <LucideIcon name={icon} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200/80 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl shadow-xs hover:from-sky-600 hover:to-sky-700 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LucideIcon name="Check" size={16} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

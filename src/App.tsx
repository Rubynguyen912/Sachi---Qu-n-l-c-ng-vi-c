import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLink, SectionId } from './types';
import { DEFAULT_SACHI_LINKS } from './data';
import LucideIcon from './components/LucideIcon';
import QuickNotes from './components/QuickNotes';
import LinkEditorModal from './components/LinkEditorModal';

// Professional SVG representation of Sachi Logo "Chăm sóc bé yêu" matching the provided image
function SachiLogo({ className = "h-14" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 320 180" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sachiHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA000" /> {/* vibrant warm amber-500 */}
            <stop offset="50%" stopColor="#FFC107" /> {/* bright golden-500 */}
            <stop offset="100%" stopColor="#FF8F00" /> {/* solid orange-600 */}
          </linearGradient>
        </defs>
        
        {/* Main "Sachi" Brandname text using a clean, thick, rounded aesthetic resembling the uploaded brand logo */}
        <text
          x="160"
          y="105"
          fill="#1C4EB1" /* Authentic Sachi Royal Blue shade */
          textAnchor="middle"
          style={{
            fontFamily: '"Outfit", "Inter", "Segoe UI", sans-serif',
            fontWeight: '800',
            fontSize: '85px',
            letterSpacing: '-2px'
          }}
        >
          Sachi
        </text>
        
        {/* Yellow-orange heart mother & child icon on the top right, replacing/dotting the letter 'i' */}
        {/* Centered around x=254, y=25 in scale context */}
        <g transform="translate(254, 25)">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#sachiHeartGrad)"
            transform="scale(1.5)"
          />
          {/* Stylized mother and child face figures in absolute brand negative space */}
          <circle cx="15" cy="11.5" r="2.5" fill="#FFFFFF" />
          <circle cx="21" cy="14" r="1.5" fill="#FFFFFF" />
          <path
            d="M10 17.5c2-1 4-1 5 .2s3 1 3-.5c0-1.5-1.5-2.5-3.5-2.2c-1 .2-2 .8-2.5.5c-.5-.3-.7-1-1.5-.8"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        
        {/* Subtitle "CHĂM SÓC BÉ YÊU" centered underneath */}
        <text
          x="160"
          y="155"
          fill="#0B3C9B" /* Matching darker blue for high legibility */
          textAnchor="middle"
          style={{
            fontFamily: '"Inter", "Segoe UI", sans-serif',
            fontWeight: '900',
            fontSize: '22px',
            letterSpacing: '3px'
          }}
        >
          CHĂM SÓC BÉ YÊU
        </text>
      </svg>
    </div>
  );
}

export default function App() {
  // Application Data & State
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<SectionId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'attached' | 'updating'>('all');
  
  // Collapsed states for main groups/accordions of cards
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'Báo cáo và kế hoạch': false,
    'Booking KOC': false,
    'Inhouse TikTok': false,
    'Đào tạo': false,
  });

  // Time & Greeting states
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive link creation / editing
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<DashboardLink | null>(null);

  // Mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Success Notification banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Load initial settings
  useEffect(() => {
    // Load links
    const savedLinks = localStorage.getItem('sachi_custom_links');
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        setLinks(DEFAULT_SACHI_LINKS);
      }
    } else {
      setLinks(DEFAULT_SACHI_LINKS);
      localStorage.setItem('sachi_custom_links', JSON.stringify(DEFAULT_SACHI_LINKS));
    }

    // Load favorites
    const savedFavs = localStorage.getItem('sachi_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        setFavorites([]);
      }
    } else {
      const initialFavs = ['rp-digital', 'rp-booking-content-plan', 'tr-brand-guideline'];
      setFavorites(initialFavs);
      localStorage.setItem('sachi_favorites', JSON.stringify(initialFavs));
    }

    // Interval for dynamic clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show auto-dismiss notification
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Persist Favorites change
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
      triggerNotification('Đã gỡ khỏi Danh sách Yêu thích', 'info');
    } else {
      updated = [...favorites, id];
      triggerNotification('Đã thêm vào Danh sách Yêu thích', 'success');
    }
    setFavorites(updated);
    localStorage.setItem('sachi_favorites', JSON.stringify(updated));
  };

  // Restore defaults function
  const handleRestoreDefaults = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu liên kết nguyên bản của Sachi? Các liên kết tự thiết lập thêm sẽ được làm sạch.')) {
      setLinks(DEFAULT_SACHI_LINKS);
      localStorage.setItem('sachi_custom_links', JSON.stringify(DEFAULT_SACHI_LINKS));
      
      const defaultFavs = ['rp-digital', 'rp-booking-content-plan', 'tr-brand-guideline'];
      setFavorites(defaultFavs);
      localStorage.setItem('sachi_favorites', JSON.stringify(defaultFavs));
      
      triggerNotification('Đã khôi phục hoàn chỉnh cấu trúc liên kết Sachi!', 'success');
    }
  };

  // Toggle individual subgroup/accordion collapse state
  const toggleAccordion = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Save/Create a link
  const handleSaveLink = (savedLink: DashboardLink) => {
    let updatedLinks: DashboardLink[] = [];
    const exists = links.some(l => l.id === savedLink.id);

    if (exists) {
      updatedLinks = links.map(l => l.id === savedLink.id ? savedLink : l);
      triggerNotification(`Đã cập nhật mục "${savedLink.title}" thành công!`);
    } else {
      updatedLinks = [...links, savedLink];
      triggerNotification(`Đã thêm mới tài liệu "${savedLink.title}" thành công!`);
    }

    setLinks(updatedLinks);
    localStorage.setItem('sachi_custom_links', JSON.stringify(updatedLinks));
  };

  // Delete custom link
  const handleDeleteLink = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn muốn xóa liên kết "${title}" ra khỏi danh sách?`)) {
      const updated = links.filter(l => l.id !== id);
      setLinks(updated);
      localStorage.setItem('sachi_custom_links', JSON.stringify(updated));
      
      // Also remove from favorites if exists
      if (favorites.includes(id)) {
        const updatedFavs = favorites.filter(favId => favId !== id);
        setFavorites(updatedFavs);
        localStorage.setItem('sachi_favorites', JSON.stringify(updatedFavs));
      }

      triggerNotification('Đã xóa bỏ liên kết!', 'info');
    }
  };

  // Initialize and open Editor Model for new
  const handleCreateNewClick = () => {
    setLinkToEdit(null);
    setIsEditorOpen(true);
  };

  // Initialize and open Editor Model for edit
  const handleEditClick = (link: DashboardLink, e: React.MouseEvent) => {
    e.stopPropagation();
    setLinkToEdit(link);
    setIsEditorOpen(true);
  };

  // Computed Greeting
  const greeting = useMemo(() => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Buổi sáng vui vẻ nhé Anh Ruby!';
    if (hours < 18) return 'Buổi chiều năng suất nhé!';
    return 'Buổi tối ấm áp nhé!';
  }, [currentTime]);

  // Sachi Stats summary metrics
  const stats = useMemo(() => {
    const total = links.length;
    const attached = links.filter(l => !!l.url).length;
    const pending = total - attached;
    const favCount = favorites.length;
    return { total, attached, pending, favCount };
  }, [links, favorites]);

  // Filter & Search Logic
  const processedLinks = useMemo(() => {
    return links.filter(link => {
      // 1. Sidebar Section navigation filter
      if (selectedSection === 'reports_plans' && link.section !== 'reports_plans') return false;
      if (selectedSection === 'booking_tiktok' && link.section !== 'booking_tiktok') return false;
      if (selectedSection === 'training' && link.section !== 'training') return false;
      if (selectedSection === 'favorites' && !favorites.includes(link.id)) return false;

      // 2. Head Filter Type (Attached vs Updating)
      if (filterType === 'attached' && !link.url) return false;
      if (filterType === 'updating' && !!link.url) return false;

      // 3. Search Query filter (matches title, description, agency sub-group, or group)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = link.title.toLowerCase().includes(query);
        const matchesDesc = (link.description || '').toLowerCase().includes(query);
        const matchesGroup = link.groupTitle.toLowerCase().includes(query);
        const matchesSubGroup = link.subGroupTitle ? link.subGroupTitle.toLowerCase().includes(query) : false;
        const matchesCategory = link.categoryTitle.toLowerCase().includes(query);

        return matchesTitle || matchesDesc || matchesGroup || matchesSubGroup || matchesCategory;
      }

      return true;
    });
  }, [links, favorites, selectedSection, filterType, searchQuery]);

  // Structural Groupings for UI layout
  const groupedData = useMemo(() => {
    // Categorize processed links into structured sections
    const reports = processedLinks.filter(l => l.section === 'reports_plans');
    const bookingAndTiktok = processedLinks.filter(l => l.section === 'booking_tiktok');
    const training = processedLinks.filter(l => l.section === 'training');

    return {
      reports,
      bookingAndTiktok,
      training
    };
  }, [processedLinks]);

  // Under bookingAndTiktok, separate Booking KOC from Inhouse TikTok
  const partitionedBookingTikTok = useMemo(() => {
    const items = groupedData.bookingAndTiktok;
    const kocList = items.filter(l => l.groupTitle === 'Booking KOC');
    const tiktokList = items.filter(l => l.groupTitle === 'Inhouse TikTok');
    return { kocList, tiktokList };
  }, [groupedData]);

  // Group Booking KOC items by Agency/Subgroup (We Win, Onetone, Lê Gia, DHC, SIA, TND, Inhouse)
  const bookingKocByAgency = useMemo(() => {
    const map: Record<string, DashboardLink[]> = {};
    partitionedBookingTikTok.kocList.forEach(item => {
      const idx = item.subGroupTitle || 'Khác';
      if (!map[idx]) {
        map[idx] = [];
      }
      map[idx].push(item);
    });
    return map;
  }, [partitionedBookingTikTok.kocList]);

  // Group Inhouse TikTok items by Channel Name (Chăm sóc bé yêu, Sachi Baby, etc.)
  const tiktokByChannel = useMemo(() => {
    const map: Record<string, DashboardLink[]> = {};
    partitionedBookingTikTok.tiktokList.forEach(item => {
      const idx = item.subGroupTitle || 'Khác';
      if (!map[idx]) {
        map[idx] = [];
      }
      map[idx].push(item);
    });
    return map;
  }, [partitionedBookingTikTok.tiktokList]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex" style={{ fontFamily: 'var(--font-sans)' }}>
      
      {/* 1. Sidebar - Desktop view */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-sky-100 p-6 shrink-0 relative transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center border-b border-sky-100/50 pb-6 mb-6">
          <SachiLogo className="h-20 w-auto" />
          <p className="text-[10px] text-sky-500 font-bold tracking-widest uppercase mt-2">ABM Workspace</p>
        </div>

        {/* Brand Slogan Ribbon */}
        <div className="p-3.5 mb-6 rounded-2xl bg-gradient-to-r from-sky-50/70 to-emerald-50/40 border border-sky-100/40 flex items-center gap-2.5">
          <span className="text-xl">💝</span>
          <div>
            <p className="text-[11px] font-semibold text-slate-700 leading-tight">Yêu con khoa học</p>
            <p className="text-[9px] text-slate-400">Chăm sóc bé yêu dịu lành</p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="space-y-1.5 flex-1 select-none">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Bảng điều khiển</p>
          
          <button
            onClick={() => { setSelectedSection('all'); setSelectedSection('all'); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              selectedSection === 'all'
                ? 'bg-sky-50 text-sky-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LucideIcon name="Layers" size={17} className={selectedSection === 'all' ? 'text-sky-600' : 'text-slate-400'} />
              <span>Tất cả tài liệu</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedSection === 'all' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {links.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedSection('reports_plans')}
            className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              selectedSection === 'reports_plans'
                ? 'bg-sky-50 text-sky-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LucideIcon name="LineChart" size={17} className={selectedSection === 'reports_plans' ? 'text-sky-600' : 'text-slate-400'} />
              <span>Báo cáo & Kế hoạch</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {links.filter(l => l.section === 'reports_plans').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedSection('booking_tiktok')}
            className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              selectedSection === 'booking_tiktok'
                ? 'bg-indigo-50/60 text-sky-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LucideIcon name="Video" size={17} className={selectedSection === 'booking_tiktok' ? 'text-sky-600' : 'text-slate-400'} />
              <span>Booking & TikTok</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {links.filter(l => l.section === 'booking_tiktok').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedSection('training')}
            className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              selectedSection === 'training'
                ? 'bg-emerald-50/60 text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LucideIcon name="BookOpen" size={17} className={selectedSection === 'training' ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Tài liệu Đào tạo</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {links.filter(l => l.section === 'training').length}
            </span>
          </button>

          <div className="h-px bg-slate-100/80 my-4" />

          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Ưu tiên hàng đầu</p>

          <button
            onClick={() => setSelectedSection('favorites')}
            className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              selectedSection === 'favorites'
                ? 'bg-amber-50 text-amber-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LucideIcon name="Star" size={17} className={selectedSection === 'favorites' ? 'text-amber-500 fill-amber-300' : 'text-amber-400'} />
              <span>Mục Yêu thích</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedSection === 'favorites' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {favorites.length}
            </span>
          </button>
        </div>

        {/* Sidebar Footer with system info & clock */}
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-2 text-center">
          <div className="text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Nhãn S_Baby Việt Nam
          </div>
          <button 
            onClick={handleRestoreDefaults}
            className="w-full text-center py-2 text-[10px] font-medium text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all cursor-pointer"
          >
            Khôi phục dữ liệu gốc
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Row */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 px-5 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Hamburg Button on Mobile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-950 rounded-lg bg-sky-50 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              <LucideIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
            
            <div className="lg:hidden flex items-center">
              <SachiLogo className="h-10 w-auto" />
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-600">ABM Workspace</span>
              <LucideIcon name="ChevronRight" size={11} />
              <span>Dashboard tác vụ</span>
              {selectedSection !== 'all' && (
                <>
                  <LucideIcon name="ChevronRight" size={11} />
                  <span className="text-sky-600 font-medium capitalize">{selectedSection === 'reports_plans' ? 'Báo cáo & Kế hoạch' : selectedSection === 'booking_tiktok' ? 'Booking & TikTok' : selectedSection === 'training' ? 'Đào tạo' : 'Yêu thích'}</span>
                </>
              )}
            </div>
          </div>

          {/* Clock Widget */}
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 bg-sky-50/70 border border-sky-100 rounded-2xl">
            <span className="inline-block text-base">⏰</span>
            <div className="text-right">
              <p className="text-xs font-bold text-sky-800 font-mono tracking-tight">
                {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[9px] text-slate-400">Giờ Hà Nội (GMT+7)</p>
            </div>
          </div>

          {/* Action buttons and profile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCreateNewClick}
              className="p-2 sm:px-4 sm:py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LucideIcon name="Plus" size={16} />
              <span className="hidden sm:inline">Thêm file mới</span>
            </button>

            <div className="w-[1px] h-6 bg-slate-200" />

            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-1.5 pr-3 rounded-full border border-emerald-50">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-display font-bold text-sm flex items-center justify-center">
                S
              </div>
              <div className="hidden md:block text-left text-[10px]">
                <p className="font-bold text-slate-700 leading-tight">Sachi Admin</p>
                <p className="text-[9px] text-slate-400">luongganh6@..</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-sky-100 p-4 space-y-2 select-none shadow-md">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-1">Mục Lớn</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelectedSection('all'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                  selectedSection === 'all' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LucideIcon name="Layers" size={14} /> Tất cả ({links.length})
              </button>
              <button
                onClick={() => { setSelectedSection('reports_plans'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                  selectedSection === 'reports_plans' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LucideIcon name="LineChart" size={14} /> Báo cáo & KH
              </button>
              <button
                onClick={() => { setSelectedSection('booking_tiktok'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                  selectedSection === 'booking_tiktok' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LucideIcon name="Video" size={14} /> Booking/TikTok
              </button>
              <button
                onClick={() => { setSelectedSection('training'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                  selectedSection === 'training' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LucideIcon name="BookOpen" size={14} /> Đào tạo
              </button>
              <button
                onClick={() => { setSelectedSection('favorites'); setIsMobileMenuOpen(false); }}
                className={`col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                  selectedSection === 'favorites' ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LucideIcon name="Star" size={14} className="text-amber-500 fill-amber-300" />
                <span>Danh mục yêu thích ({favorites.length})</span>
              </button>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
              <span>Định vị: Sản phẩm mẹ & bé Sachi</span>
              <button onClick={handleRestoreDefaults} className="text-sky-600 font-bold">Khôi phục gốc</button>
            </div>
          </div>
        )}

        {/* Global Floating Toast Alert */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-55 max-w-sm flex items-center gap-3 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 animate-slide-up">
            <span className="p-1 bg-emerald-500 text-white rounded-lg">
              <LucideIcon name={notification.type === 'success' ? 'Check' : 'Info'} size={16} />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold leading-relaxed">{notification.message}</p>
            </div>
          </div>
        )}

        {/* MAIN BODY SCROLL VIEW */}
        <main className="p-5 lg:p-8 space-y-6 flex-1 max-w-[1550px] w-full mx-auto">
          
          {/* Welcome Banner Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-sky-400/10 via-emerald-50/40 to-sky-100/30 border border-sky-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xs">
            
            {/* Soft decorative elements inside the background */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 right-20 w-32 h-32 bg-emerald-200/25 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-1.5 z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-700 rounded-full text-xs font-medium">
                <span>🧸 Sachi Baby Brand</span>
              </div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-slate-800 tracking-tight">
                {greeting}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Quản lý tối ưu tiến độ, hiệu suất Digital, danh sách đối tác KOC, kịch bản kênh inhouse và brand guideline chính thức.
              </p>
            </div>

            {/* Micro Stats summary on the banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white/70 backdrop-blur-xs p-3.5 rounded-2xl border border-sky-100/60 z-10">
              <div className="text-center px-4 py-1.5 border-r border-slate-100/80">
                <p className="text-[10px] text-slate-400 font-medium">Tổng File</p>
                <p className="text-lg font-bold text-slate-800 font-mono">{stats.total}</p>
              </div>
              <div className="text-center px-4 py-1.5 md:border-r border-slate-100/80">
                <p className="text-[10px] text-emerald-600 font-semibold">Đã Gắn Link</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-lg font-bold text-emerald-600 font-mono">{stats.attached}</p>
                </div>
              </div>
              <div className="text-center px-4 py-1.5 border-r border-slate-100/80">
                <p className="text-[10px] text-amber-500 font-semibold">Chờ Nạp Link</p>
                <p className="text-lg font-bold text-amber-500 font-mono">{stats.pending}</p>
              </div>
              <div className="text-center px-4 py-1.5">
                <p className="text-[10px] text-red-500 font-semibold">Yêu Thích</p>
                <p className="text-lg font-bold text-red-500 font-mono">{stats.favCount}</p>
              </div>
            </div>
          </div>

          {/* Search, Filter Toolbar & Tags */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-xs space-y-4">
            
            {/* Search Input and Filter state */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <LucideIcon name="Search" size={17} />
                </span>
                <input
                  type="text"
                  placeholder="Lọc nhanh theo tên kịch bản, đại sứ KOC, tên agency hoặc tài liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <LucideIcon name="X" size={16} />
                  </button>
                )}
              </div>

              {/* Advanced Filter option segments */}
              <div className="flex overflow-x-auto gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                    filterType === 'all'
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tất cả liên kết
                </button>
                <button
                  onClick={() => setFilterType('attached')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    filterType === 'attached'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Đã gắn link ({links.filter(l => !!l.url).length})
                </button>
                <button
                  onClick={() => setFilterType('updating')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    filterType === 'updating'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Đang cập nhật ({links.filter(l => !l.url).length})
                </button>
              </div>
            </div>

            {/* Quick Keyword tags to fast click search */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100/70 text-xs">
              <span className="text-slate-400 font-medium">Gợi ý từ khóa:</span>
              {[
                { label: 'We Win', query: 'We Win' },
                { label: 'Onetone', query: 'Onetone' },
                { label: 'Lê Gia', query: 'Lê Gia' },
                { label: 'Kịch bản', query: 'Kịch bản' },
                { label: 'Chỉ tiêu MKT', query: 'Chỉ tiêu MKT' },
                { label: 'TikTok', query: 'TikTok' },
                { label: 'Bọt đánh răng', query: 'Bọt đánh răng' },
                { label: 'Brand Guideline', query: 'Guideline' }
              ].map(tag => (
                <button
                  key={tag.label}
                  onClick={() => setSearchQuery(tag.query)}
                  className="px-2.5 py-1 bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100/50 rounded-lg transition-all text-[11px] cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flat search results view (triggered if search query is active) */}
          {searchQuery.trim() !== '' ? (
            <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-50">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                    <LucideIcon name="Search" size={18} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-slate-800">
                      Kết quả tìm kiếm cho: "{searchQuery}"
                    </h3>
                    <p className="text-[11px] text-slate-400">Có {processedLinks.length} kết quả phù hợp với tiêu chí của bạn</p>
                  </div>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold"
                >
                  Xóa tìm kiếm
                </button>
              </div>

              {processedLinks.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <span className="text-3xl">🧩</span>
                  <p className="text-sm font-semibold text-slate-600">Không tìm thấy tài liệu nào khớp</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Kiểm tra lại từ khóa hoặc đảm bảo file liên kết không thuộc chế độ lọc bị giới hạn.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedLinks.map(link => (
                    <div
                      key={link.id}
                      className="group bg-slate-50 hover:bg-gradient-to-br hover:from-white hover:to-sky-50/20 border border-slate-100 hover:border-sky-200 rounded-2xl p-4.5 transition-all duration-300 shadow-collapse hover:shadow-md relative"
                    >
                      <button
                        onClick={(e) => toggleFavorite(link.id, e)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/80 border border-slate-100 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-500 transition-all text-slate-400 z-10"
                        title={favorites.includes(link.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                      >
                        <LucideIcon name="Star" size={14} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-400' : ''} />
                      </button>

                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-white text-sky-600 rounded-xl border border-sky-100/40">
                          <LucideIcon name={link.iconName} size={18} />
                        </div>
                        <div className="space-y-1 pr-6 flex-1">
                          <span className="text-[9px] font-bold text-sky-600 uppercase tracking-widest block">
                            {link.categoryTitle}
                          </span>
                          <h4 className="font-display font-bold text-slate-800 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                            {link.title}
                          </h4>
                          {link.subGroupTitle && (
                            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                              {link.subGroupTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-200/50 flex items-center justify-between">
                        {link.url ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Báo cáo sẵn sàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            Đang cập nhật
                          </span>
                        )}

                        <div className="flex gap-2.5">
                          <button
                            onClick={(e) => handleEditClick(link, e)}
                            className="p-1 px-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1"
                            title="Sửa"
                          >
                            <LucideIcon name="Edit3" size={12} /> Sửa
                          </button>
                          
                          {link.id.startsWith('custom-') && (
                            <button
                              onClick={(e) => handleDeleteLink(link.id, link.title, e)}
                              className="p-1 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer"
                              title="Xóa khách hàng"
                            >
                              Xóa
                            </button>
                          )}

                          {link.url ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 px-3 bg-sky-500 hover:bg-sky-600 text-white select-none rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5"
                            >
                              Truy cập
                              <LucideIcon name="ExternalLink" size={11} />
                            </a>
                          ) : (
                            <button
                              disabled
                              className="p-1 px-3 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold tracking-tight cursor-not-allowed"
                              title="Link đang được cập nhật"
                            >
                              Đang đợi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Full Grouped Structured UI (Regular Dashboard)
            <div className="space-y-8">

              {/* ======================= MỤC LỚN 1: BÁO CÁO VÀ KẾ HOẠCH ======================= */}
              {(selectedSection === 'all' || selectedSection === 'reports_plans' || (selectedSection === 'favorites' && groupedData.reports.length > 0)) && (
                <section className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-400/5 to-emerald-50/10 border-b border-sky-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <LucideIcon name="LineChart" size={22} className="stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-slate-800">
                            1
                          </h3>
                          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">Sachi S_Team</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Bảng tổng hợp báo cáo Digital định kỳ, kế hoạch phân phối nội dung & vận động nhóm chỉ tiêu Marketing hàng tuần
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        Số lượng: {groupedData.reports.length}
                      </span>
                      <button
                        onClick={() => toggleAccordion('Báo cáo và kế hoạch')}
                        className="p-1.5 bg-slate-100/80 hover:bg-slate-200/50 text-slate-500 rounded-lg transition-colors cursor-pointer"
                        title={collapsedGroups['Báo cáo và kế hoạch'] ? 'Mở rộng' : 'Thu hẹp'}
                      >
                        <LucideIcon name="ChevronRight" className={`transition-transform duration-300 ${!collapsedGroups['Báo cáo và kế hoạch'] ? 'rotate-90' : ''}`} size={16} />
                      </button>
                    </div>
                  </div>

                  {!collapsedGroups['Báo cáo và kế hoạch'] && (
                    <div className="p-5 sm:p-6">
                      {groupedData.reports.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center italic py-4">Chưa có liên kết báo cáo nào phù hợp bộ lọc.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {/* Loop through direct non-grouped items like Báo cáo Digital & Kế hoạch Booking */}
                          {groupedData.reports.map(link => {
                            // Render individual reports
                            return (
                              <div
                                key={link.id}
                                className="group bg-gradient-to-br from-slate-50/80 to-white hover:to-sky-50/15 border border-slate-100 hover:border-sky-200/80 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
                              >
                                <div>
                                  {/* Fav Star Button */}
                                  <button
                                    onClick={(e) => toggleFavorite(link.id, e)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border border-slate-100 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-500 transition-all text-slate-400 z-10 cursor-pointer"
                                    title={favorites.includes(link.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                  >
                                    <LucideIcon name="Star" size={13} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-400' : ''} />
                                  </button>

                                  <div className="flex gap-3 mb-2.5">
                                    <div className="p-2.5 bg-white text-sky-600 rounded-xl border border-sky-100/50">
                                      <LucideIcon name={link.iconName} size={18} />
                                    </div>
                                    <div className="pr-4 flex-1">
                                      {link.subGroupTitle && (
                                        <span className="text-[9px] font-bold text-sky-600 bg-sky-50 border border-sky-100/50 px-2 py-0.5 rounded-md mb-1 inline-block">
                                          {link.subGroupTitle}
                                        </span>
                                      )}
                                      <h4 className="font-display font-semibold text-slate-800 text-sm group-hover:text-sky-700 transition-colors">
                                        {link.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                  {link.url ? (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md max-w-max">
                                      Đã gắn link
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md max-w-max">
                                      Đang cập nhật
                                    </span>
                                  )}

                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => handleEditClick(link, e)}
                                      className="p-1 text-slate-400 hover:text-sky-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                      title="Sửa file"
                                    >
                                      Sửa
                                    </button>

                                    {link.id.startsWith('custom-') && (
                                      <button
                                        onClick={(e) => handleDeleteLink(link.id, link.title, e)}
                                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-1 rounded-lg text-xs"
                                        title="Xóa"
                                      >
                                        Xóa
                                      </button>
                                    )}

                                    {link.url ? (
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1 px-3 bg-sky-500 hover:bg-sky-600 text-white select-none rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5"
                                      >
                                        Mở file
                                        <LucideIcon name="ExternalLink" size={11} />
                                      </a>
                                    ) : (
                                      <button
                                        disabled
                                        className="p-1 px-3 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold tracking-tight cursor-not-allowed"
                                        title="Sẽ khả dụng sau khi gắn link"
                                      >
                                        Mở file
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}


              {/* ======================= MỤC LỚN 2: BOOKING & TIKTOK ======================= */}
              {(selectedSection === 'all' || selectedSection === 'booking_tiktok' || (selectedSection === 'favorites' && groupedData.bookingAndTiktok.length > 0)) && (
                <section className="bg-white rounded-3xl border border-teal-100 shadow-xs overflow-hidden">
                  
                  {/* Category Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50/40 via-sky-50/10 to-teal-50/10 border-b border-teal-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">
                        <LucideIcon name="Video" size={22} className="stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-slate-800">
                            2
                          </h3>
                          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase">KOC & TikTok</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Theo dõi tiến độ booking các đối tác Agency (We Win, Onetone, Lê Gia...) và kịch bản/kênh TikTok inhouse Sachi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        Số lượng: {groupedData.bookingAndTiktok.length}
                      </span>
                      <button
                        onClick={() => toggleAccordion('Booking KOC')}
                        className="p-1.5 bg-slate-100/80 hover:bg-slate-200/50 text-slate-500 rounded-lg transition-colors cursor-pointer"
                        title={collapsedGroups['Booking KOC'] ? 'Mở rộng' : 'Thu hẹp'}
                      >
                        <LucideIcon name="ChevronRight" className={`transition-transform duration-300 ${!collapsedGroups['Booking KOC'] ? 'rotate-90' : ''}`} size={16} />
                      </button>
                    </div>
                  </div>

                  {!collapsedGroups['Booking KOC'] && (
                    <div className="p-5 sm:p-6 space-y-8">
                      
                      {/* SUB-SECTION 2.1: Booking KOC */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-sky-100/55">
                          <span className="text-lg">📊</span>
                          <h4 className="font-display font-semibold text-slate-700 text-sm tracking-wide">1</h4>
                        </div>

                        {partitionedBookingTikTok.kocList.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-3 text-center">Không có agency booking nào khớp bộ lọc.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Object.entries(bookingKocByAgency).map(([agencyName, linksData]) => {
                              const agencyLinks = linksData as DashboardLink[];
                              return (
                                <div
                                  key={agencyName}
                                  className="bg-slate-50/70 border border-slate-100/90 rounded-2xl p-4.5 hover:shadow-xs transition-all flex flex-col justify-between"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs">🏢</span>
                                        <h5 className="font-display font-bold text-slate-800 text-sm">{agencyName}</h5>
                                      </div>
                                      <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                                        {agencyLinks.length} tài liệu
                                      </span>
                                    </div>

                                    <div className="space-y-2 pt-1">
                                      {agencyLinks.map(link => (
                                      <div
                                        key={link.id}
                                        className="p-3 bg-white border border-sky-100/30 rounded-xl hover:border-sky-300 hover:shadow-xs transition-all relative group/item"
                                      >
                                        <div className="flex items-start justify-between gap-1">
                                          <div className="max-w-[80%]">
                                            <p className="text-xs font-semibold text-slate-700 leading-tight truncate-2-lines">{link.title}</p>
                                          </div>

                                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            {/* Stars Favorite */}
                                            <button
                                              onClick={(e) => toggleFavorite(link.id, e)}
                                              className="p-0.5 hover:text-amber-500 text-slate-300 transition-colors cursor-pointer"
                                              title={favorites.includes(link.id) ? 'Yêu thích' : 'Không có'}
                                            >
                                              <LucideIcon name="Star" size={12} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-300' : ''} />
                                            </button>
                                            
                                            <button
                                              onClick={(e) => handleEditClick(link, e)}
                                              className="p-0.5 text-slate-300 hover:text-sky-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                              title="Sửa URL"
                                            >
                                              <LucideIcon name="Edit3" size={11} />
                                            </button>
                                          </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                          {link.url ? (
                                            <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                              Đáo hạn
                                            </span>
                                          ) : (
                                            <span className="text-[9px] text-amber-500 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md">
                                              Cập nhật
                                            </span>
                                          )}

                                          {link.url ? (
                                            <a
                                              href={link.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
                                            >
                                              Mở file
                                              <LucideIcon name="ExternalLink" size={10} />
                                            </a>
                                          ) : (
                                            <span className="text-[10px] text-slate-400 italic">Chờ link</span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* SUB-SECTION 2.2: Inhouse TikTok */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-sky-100/55">
                          <span className="text-lg">🎬</span>
                          <h4 className="font-display font-semibold text-slate-700 text-sm tracking-wide">2</h4>
                        </div>

                        {partitionedBookingTikTok.tiktokList.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-3 text-center">Không có kênh TikTok inhouse nào khớp bộ lọc.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Object.entries(tiktokByChannel).map(([channelName, linksData]) => {
                              const channelLinks = linksData as DashboardLink[];
                              return (
                                <div
                                  key={channelName}
                                  className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4.5 hover:shadow-xs transition-all flex flex-col justify-between"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <span className="p-1 px-1.5 bg-sky-100 text-sky-600 rounded-lg text-[10px]">TikTok</span>
                                        <h5 className="font-display font-bold text-slate-800 text-sm">{channelName}</h5>
                                      </div>
                                      <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                                        {channelLinks.length} mục
                                      </span>
                                    </div>

                                    <div className="space-y-2 pt-1">
                                      {channelLinks.map(link => (
                                      <div
                                        key={link.id}
                                        className="p-3 bg-white border border-slate-100 rounded-xl hover:border-teal-200 transition-all relative group/item"
                                      >
                                        <div className="flex items-start justify-between gap-1">
                                          <div className="max-w-[85%]">
                                            <p className="text-xs font-semibold text-slate-700 leading-tight">{link.title}</p>
                                          </div>
                                          
                                          <div className="flex flex-col items-end gap-1 shrink-0">
                                            {/* Stars Favorite */}
                                            <button
                                              onClick={(e) => toggleFavorite(link.id, e)}
                                              className="p-0.5 text-slate-300 hover:text-amber-500 transition-colors pointer-events-auto"
                                            >
                                              <LucideIcon name="Star" size={11} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-300' : ''} />
                                            </button>
                                            
                                            <button
                                              onClick={(e) => handleEditClick(link, e)}
                                              className="p-0.5 text-slate-300 opacity-0 group-hover/item:opacity-100 hover:text-sky-600 transition-opacity"
                                              title="Sửa link"
                                            >
                                              <LucideIcon name="Edit3" size={11} />
                                            </button>
                                          </div>
                                        </div>

                                        <div className="mt-3.5 flex items-center justify-between pt-1 border-t border-slate-50">
                                          {link.url ? (
                                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                              Đã gắn link
                                            </span>
                                          ) : (
                                            <span className="text-[9px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                                              Đang cập nhật
                                            </span>
                                          )}

                                          {link.url ? (
                                            <a
                                              href={link.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-[10px] text-sky-600 font-semibold hover:text-sky-700 inline-flex items-center gap-0.5"
                                            >
                                              Truy cập
                                              <LucideIcon name="ExternalLink" size={10} />
                                            </a>
                                          ) : (
                                            <span className="text-[10px] text-slate-400 italic">Trống</span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </section>
              )}


              {/* ======================= MỤC LỚN 3: ĐÀO TẠO ======================= */}
              {(selectedSection === 'all' || selectedSection === 'training' || (selectedSection === 'favorites' && groupedData.training.length > 0)) && (
                <section className="bg-white rounded-3xl border border-emerald-100 shadow-xs overflow-hidden">
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-400/5 to-sky-50/10 border-b border-emerald-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <LucideIcon name="BookOpen" size={22} className="stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-slate-800">
                            3
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Kế Thừa</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Các tài nguyên đào tạo, cẩm nang Brand Guideline, nguyên liệu hình ảnh, video raw trong drive phục vụ thương bá Sachi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        Số lượng: {groupedData.training.length}
                      </span>
                      <button
                        onClick={() => toggleAccordion('Đào tạo')}
                        className="p-1.5 bg-slate-100/80 hover:bg-slate-200/50 text-slate-500 rounded-lg transition-colors cursor-pointer"
                        title={collapsedGroups['Đào tạo'] ? 'Mở rộng' : 'Thu hẹp'}
                      >
                        <LucideIcon name="ChevronRight" className={`transition-transform duration-300 ${!collapsedGroups['Đào tạo'] ? 'rotate-90' : ''}`} size={16} />
                      </button>
                    </div>
                  </div>

                  {!collapsedGroups['Đào tạo'] && (
                    <div className="p-5 sm:p-6">
                      {groupedData.training.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center italic py-4">Chưa có tài liệu đào tạo nào khớp bộ lọc.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {groupedData.training.map(link => (
                            <div
                              key={link.id}
                              className="group bg-gradient-to-br from-slate-50/80 to-white hover:to-emerald-50/15 border border-slate-100 hover:border-emerald-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
                            >
                              <div>
                                {/* Fav Star Button */}
                                <button
                                  onClick={(e) => toggleFavorite(link.id, e)}
                                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border border-slate-100 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-500 transition-all text-slate-400 z-10 cursor-pointer"
                                  title={favorites.includes(link.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                >
                                  <LucideIcon name="Star" size={13} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-400' : ''} />
                                </button>

                                <div className="flex gap-3 mb-2.5">
                                  <div className="p-2.5 bg-white text-emerald-600 rounded-xl border border-emerald-100/55">
                                    <LucideIcon name={link.iconName} size={18} />
                                  </div>
                                  <div className="pr-4">
                                    <h4 className="font-display font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                                      {link.title}
                                    </h4>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                {link.url ? (
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                                    Đã liên kết
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
                                    Đang bận
                                  </span>
                                )}

                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => handleEditClick(link, e)}
                                    className="p-1 px-2 text-slate-400 hover:text-sky-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                  >
                                    Cập nhật
                                  </button>
                                  
                                  {link.id.startsWith('custom-') && (
                                    <button
                                      onClick={(e) => handleDeleteLink(link.id, link.title, e)}
                                      className="p-1 text-rose-500 hover:text-rose-700 px-1 rounded-lg text-xs"
                                      title="Xóa"
                                    >
                                      Xóa
                                    </button>
                                  )}

                                  {link.url ? (
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white select-none rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5"
                                    >
                                      Truy cập
                                      <LucideIcon name="ExternalLink" size={11} />
                                    </a>
                                  ) : (
                                    <button
                                      disabled
                                      className="p-1 px-3.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold tracking-tight cursor-not-allowed"
                                    >
                                      Đang đợi
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

            </div>
          )}

          {/* Collateral Widgets Area: Sachi Memo Book & Quick Shortcuts */}
          <div className="mt-8 pt-4 border-t border-sky-100/50">
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-4">🧸 Góc Tổ Chức Công Việc Sachi Brand Manager</h4>
            <QuickNotes />
          </div>

        </main>

        {/* Dynamic Link Creator/Updater Popup Dialog */}
        <LinkEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveLink}
          linkToEdit={linkToEdit}
        />

        {/* Footer Area */}
        <footer className="bg-white border-t border-sky-100/50 py-6 px-8 text-center text-xs text-slate-400 mt-20">
          <p className="font-display text-slate-500">Sachi Work Management Dashboard © 2026</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Không gian làm việc trực tuyến và cổng kết nối dữ liệu dành cho Assistant Brand Manager nhãn hàng mẹ và bé Sachi.
          </p>
        </footer>

      </div>
    </div>
  );
}

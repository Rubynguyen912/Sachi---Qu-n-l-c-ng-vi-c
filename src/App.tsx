import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLink, SectionId, SachiSection, SachiMinorSection } from './types';
import { DEFAULT_SACHI_LINKS } from './data';
import LucideIcon from './components/LucideIcon';
import QuickNotes from './components/QuickNotes';
import LinkEditorModal from './components/LinkEditorModal';
import SectionEditorModal from './components/SectionEditorModal';
import QuickEditModal from './components/QuickEditModal';
import LoginScreen from './components/LoginScreen';

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

const DEFAULT_SECTIONS: SachiSection[] = [
  {
    id: 'reports_plans',
    title: '1',
    name: 'Báo cáo và kế hoạch',
    description: 'Bảng tổng hợp báo cáo Digital định kỳ, kế hoạch phân phối nội dung & vận động nhóm chỉ tiêu Marketing hàng tuần',
    badge: 'Sachi S_Team',
  },
  {
    id: 'booking_tiktok',
    title: '2',
    name: 'Booking & TikTok',
    description: 'Theo dõi tiến độ booking các đối tác Agency (We Win, Onetone, Lê Gia...) và kịch bản/kênh TikTok inhouse Sachi',
    badge: 'KOC & TikTok',
  },
  {
    id: 'training',
    title: '3',
    name: 'Đào tạo',
    description: 'Các tài nguyên đào tạo, cẩm nang Brand Guideline, nguyên liệu hình ảnh, video raw trong drive phục vụ thương bá Sachi',
    badge: 'Kế Thừa',
  }
];

const DEFAULT_MINOR_SECTIONS: SachiMinorSection[] = [
  { id: 'Booking KOC', title: '1' },
  { id: 'Inhouse TikTok', title: '2' },
];

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('sachi_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('sachi_current_user') || '';
  });

  const handleLogout = () => {
    localStorage.removeItem('sachi_logged_in');
    localStorage.removeItem('sachi_current_user');
    setIsLoggedIn(false);
    setCurrentUser('');
    setIsMobileMenuOpen(false);
  };

  // Application Data & State
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<SectionId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'attached' | 'updating'>('all');
  
  // Dynamic categories/sections configuration state
  const [sections, setSections] = useState<SachiSection[]>([]);
  const [minorSections, setMinorSections] = useState<SachiMinorSection[]>([]);
  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);

  // Quick Edit Modal States
  const [editingSection, setEditingSection] = useState<SachiSection | null>(null);
  const [editingMinorSection, setEditingMinorSection] = useState<SachiMinorSection | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);

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
    // Load sections
    const savedSections = localStorage.getItem('sachi_sections');
    if (savedSections) {
      try {
        setSections(JSON.parse(savedSections));
      } catch (e) {
        setSections(DEFAULT_SECTIONS);
      }
    } else {
      setSections(DEFAULT_SECTIONS);
      localStorage.setItem('sachi_sections', JSON.stringify(DEFAULT_SECTIONS));
    }

    // Load minor sections
    const savedMinorSections = localStorage.getItem('sachi_minor_sections');
    if (savedMinorSections) {
      try {
        setMinorSections(JSON.parse(savedMinorSections));
      } catch (e) {
        setMinorSections(DEFAULT_MINOR_SECTIONS);
      }
    } else {
      setMinorSections(DEFAULT_MINOR_SECTIONS);
      localStorage.setItem('sachi_minor_sections', JSON.stringify(DEFAULT_MINOR_SECTIONS));
    }

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
    if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu liên kết và danh mục nguyên bản của Sachi? Các thiết lập thêm sẽ được làm sạch.')) {
      setLinks(DEFAULT_SACHI_LINKS);
      localStorage.setItem('sachi_custom_links', JSON.stringify(DEFAULT_SACHI_LINKS));
      
      setSections(DEFAULT_SECTIONS);
      localStorage.setItem('sachi_sections', JSON.stringify(DEFAULT_SECTIONS));

      setMinorSections(DEFAULT_MINOR_SECTIONS);
      localStorage.setItem('sachi_minor_sections', JSON.stringify(DEFAULT_MINOR_SECTIONS));

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

  // Save updated major sections structure from section editor modal
  const handleSaveSections = (updated: SachiSection[]) => {
    setSections(updated);
    localStorage.setItem('sachi_sections', JSON.stringify(updated));
    triggerNotification('Đã thay đổi cấu trúc mục lớn thành công!', 'success');
  };

  // Save updated minor sections structure from section editor modal
  const handleSaveMinorSections = (updated: SachiMinorSection[]) => {
    setMinorSections(updated);
    localStorage.setItem('sachi_minor_sections', JSON.stringify(updated));
    triggerNotification('Đã thay đổi cấu trúc mục nhỏ thành công!', 'success');
  };

  // Quick save for edited major section from QuickEditModal
  const handleSaveSectionQuick = (updatedSec: SachiSection) => {
    const updated = sections.map(s => s.id === updatedSec.id ? updatedSec : s);
    setSections(updated);
    localStorage.setItem('sachi_sections', JSON.stringify(updated));
    triggerNotification(`Đã lưu thay đổi mục lớn "${updatedSec.name}"`, 'success');
  };

  // Quick save for edited minor section from QuickEditModal, including cascading link group titles rename
  const handleSaveMinorSectionQuick = (oldId: string, updatedMinor: SachiMinorSection) => {
    // 1. Update minor sections state and localStorage
    const updatedMs = minorSections.map(m => m.id === oldId ? updatedMinor : m);
    setMinorSections(updatedMs);
    localStorage.setItem('sachi_minor_sections', JSON.stringify(updatedMs));

    // 2. Cascade rename matching links' groupTitle
    if (oldId !== updatedMinor.id) {
      const updatedLinks = links.map(link => {
        if (link.groupTitle === oldId) {
          return {
            ...link,
            groupTitle: updatedMinor.id,
          };
        }
        return link;
      });
      setLinks(updatedLinks);
      localStorage.setItem('sachi_custom_links', JSON.stringify(updatedLinks));
    }
    
    triggerNotification(`Đã lưu thay đổi mục nhỏ "${updatedMinor.id}"`, 'success');
  };

  // Direct actions to add other sections
  const handleAddNewMajorSection = () => {
    const titles = sections.map(s => parseInt(s.title)).filter(n => !isNaN(n));
    const nextNum = titles.length > 0 ? Math.max(...titles) + 1 : sections.length + 1;
    
    const newId = `custom_section_${Date.now()}`;
    const newSection: SachiSection = {
      id: newId,
      title: nextNum.toString(),
      name: `Mục ${nextNum}`,
      description: 'Nhập mô tả tóm tắt vai trò và danh mục tài nguyên của mục lớn này...',
      badge: 'SACHI',
    };
    
    const updated = [...sections, newSection];
    setSections(updated);
    localStorage.setItem('sachi_sections', JSON.stringify(updated));
    
    setEditingSection(newSection);
    setEditingMinorSection(null);
    setIsQuickEditOpen(true);
    triggerNotification('Đã tạo mục lớn mới. Hãy cấu hình tên và link của mục!', 'success');
  };

  const handleAddNewMinorSection = () => {
    const titles = minorSections.map(s => parseInt(s.title)).filter(n => !isNaN(n));
    const nextNum = titles.length > 0 ? Math.max(...titles) + 1 : minorSections.length + 1;
    
    const defaultName = `Mục nhỏ ${nextNum}`;
    const newMinorSection: SachiMinorSection = {
      id: defaultName,
      title: nextNum.toString(),
      url: '',
    };
    
    const updated = [...minorSections, newMinorSection];
    setMinorSections(updated);
    localStorage.setItem('sachi_minor_sections', JSON.stringify(updated));
    
    setEditingSection(null);
    setEditingMinorSection(newMinorSection);
    setIsQuickEditOpen(true);
    triggerNotification('Đã tạo mục nhỏ mới. Hãy cấu hình tên và link của mục!', 'success');
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
      if (selectedSection !== 'all' && selectedSection !== 'favorites' && link.section !== selectedSection) return false;
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

  const getSectionStyle = (secId: string) => {
    switch (secId) {
      case 'reports_plans':
        return {
          icon: 'LineChart',
          borderClass: 'border-sky-100',
          headerClass: 'bg-gradient-to-r from-sky-400/5 to-emerald-50/10 border-b border-sky-100/50',
          iconBgClass: 'bg-sky-100 text-sky-600',
          badgeColorClass: 'text-sky-600 bg-sky-50',
          cardGradient: 'from-slate-50/80 to-white hover:to-sky-50/15 border border-slate-100 hover:border-sky-200/80',
          accentColor: 'sky',
        };
      case 'booking_tiktok':
        return {
          icon: 'Video',
          borderClass: 'border-teal-100',
          headerClass: 'bg-gradient-to-r from-emerald-50/40 via-sky-50/10 to-teal-50/10 border-b border-teal-100/50',
          iconBgClass: 'bg-teal-100 text-teal-600',
          badgeColorClass: 'text-teal-600 bg-teal-100/65',
          cardGradient: 'from-slate-50/80 to-white hover:to-teal-50/15 border border-slate-100 hover:border-teal-200/80',
          accentColor: 'teal',
        };
      case 'training':
        return {
          icon: 'BookOpen',
          borderClass: 'border-emerald-100',
          headerClass: 'bg-gradient-to-r from-emerald-400/5 to-sky-50/10 border-b border-emerald-100/50',
          iconBgClass: 'bg-emerald-100 text-emerald-600',
          badgeColorClass: 'text-emerald-600 bg-emerald-50',
          cardGradient: 'from-slate-50/80 to-white hover:to-emerald-50/15 border border-slate-100 hover:border-emerald-200',
          accentColor: 'emerald',
        };
      default:
        return {
          icon: 'FolderOpen',
          borderClass: 'border-purple-100',
          headerClass: 'bg-gradient-to-r from-purple-500/5 via-white to-pink-500/5 border-b border-purple-100/50',
          iconBgClass: 'bg-purple-100 text-purple-600',
          badgeColorClass: 'text-purple-600 bg-purple-50',
          cardGradient: 'from-slate-50/80 to-white hover:to-purple-50/15 border border-slate-100 hover:border-purple-200',
          accentColor: 'purple',
        };
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={(username) => {
          localStorage.setItem('sachi_logged_in', 'true');
          localStorage.setItem('sachi_current_user', username);
          setIsLoggedIn(true);
          setCurrentUser(username);
          setNotification({ message: `Chào mừng ${username} quay trở lại hệ thống Sachi!`, type: 'success' });
          setTimeout(() => setNotification(null), 4000);
        }}
      />
    );
  }

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

          {sections.map(sec => {
            const isSelected = selectedSection === sec.id;
            const getIcon = () => {
              if (sec.id === 'reports_plans') return 'LineChart';
              if (sec.id === 'booking_tiktok') return 'Video';
              if (sec.id === 'training') return 'BookOpen';
              return 'FolderOpen';
            };
            const getColors = () => {
              if (!isSelected) return 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';
              if (sec.id === 'reports_plans') return 'bg-sky-50 text-sky-700 shadow-xs';
              if (sec.id === 'booking_tiktok') return 'bg-indigo-50/60 text-sky-700 shadow-xs';
              if (sec.id === 'training') return 'bg-emerald-50/60 text-emerald-700 shadow-xs';
              return 'bg-purple-50/60 text-purple-700 shadow-xs';
            };
            const getIconColor = () => {
              if (!isSelected) return 'text-slate-400';
              if (sec.id === 'reports_plans') return 'text-sky-600';
              if (sec.id === 'booking_tiktok') return 'text-indigo-600';
              if (sec.id === 'training') return 'text-emerald-600';
              return 'text-purple-600';
            };

            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${getColors()}`}
              >
                <div className="flex items-center gap-2.5">
                  <LucideIcon name={getIcon()} size={17} className={getIconColor()} />
                  <span>{sec.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {links.filter(l => l.section === sec.id).length}
                </span>
              </button>
            );
          })}

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

            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-1.5 pr-3 rounded-full border border-emerald-50/85">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-display font-bold text-xs flex items-center justify-center shadow-xs">
                  {currentUser.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left text-[10px]">
                  <p className="font-bold text-slate-700 leading-tight">{currentUser}</p>
                  <p className="text-[9px] text-emerald-600 font-medium">Đã đăng nhập</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-rose-100"
                title="Đăng xuất khỏi hệ thống"
              >
                <LucideIcon name="LogOut" size={16} />
                <span className="hidden sm:inline text-xs font-semibold">Đăng xuất</span>
              </button>
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
              
              {sections.map(sec => {
                const isSelected = selectedSection === sec.id;
                const getIcon = () => {
                  if (sec.id === 'reports_plans') return 'LineChart';
                  if (sec.id === 'booking_tiktok') return 'Video';
                  if (sec.id === 'training') return 'BookOpen';
                  return 'FolderOpen';
                };
                return (
                  <button
                    key={sec.id}
                    onClick={() => { setSelectedSection(sec.id); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer truncate ${
                      isSelected ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LucideIcon name={getIcon()} size={14} /> {sec.name}
                  </button>
                );
              })}

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
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 py-1 px-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-700">{currentUser}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleRestoreDefaults} className="text-sky-600 font-bold">Khôi phục gốc</button>
                <button onClick={handleLogout} className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg">Đăng xuất</button>
              </div>
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
              <div className="flex flex-wrap md:flex-nowrap gap-2 items-center shrink-0">
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

                <button
                  type="button"
                  onClick={() => setIsSectionEditorOpen(true)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  title="Cấu hình số hiệu, tên mục lớn, mục nhỏ và thêm mục mới"
                >
                  <LucideIcon name="Settings" size={13} className="text-slate-400 animate-spin-hover" />
                  <span>Cấu hình</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddNewMajorSection}
                  className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 border border-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-xs hover:shadow-sm"
                  title="Thêm mục lớn mới vào bảng điều khiển"
                >
                  <LucideIcon name="FolderPlus" size={13} className="stroke-[2.5]" />
                  <span>Mục lớn ➕</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddNewMinorSection}
                  className="px-3.5 py-2 bg-teal-500 hover:bg-teal-600 border border-teal-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-xs hover:shadow-sm"
                  title="Thêm mục nhỏ mới"
                >
                  <LucideIcon name="Plus" size={13} className="stroke-[2.5]" />
                  <span>Mục nhỏ ➕</span>
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
              {sections.map(sec => {
                const secLinks = processedLinks.filter(l => l.section === sec.id);
                
                // Decide if we should render this section based on selection and contents
                const shouldRender = 
                  selectedSection === 'all' || 
                  selectedSection === sec.id || 
                  (selectedSection === 'favorites' && secLinks.length > 0);
                  
                if (!shouldRender) return null;

                const styles = getSectionStyle(sec.id);
                const isCollapsed = collapsedGroups[sec.id] || false;
                
                // Find minor sections associated with links in this major section
                const secMinorSecs = minorSections.filter(ms => secLinks.some(l => l.groupTitle === ms.id));

                return (
                  <section 
                    key={sec.id} 
                    className={`bg-white rounded-3xl border ${styles.borderClass} shadow-xs overflow-hidden transition-all duration-300`}
                  >
                    {/* Section Header */}
                    <div className={`p-5 sm:p-6 ${styles.headerClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl ${styles.iconBgClass} flex items-center justify-center`}>
                          <LucideIcon name={styles.icon} size={22} className="stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display font-bold text-lg text-slate-800">
                              {sec.title}
                            </h3>
                            <span className="font-display font-bold text-base text-slate-800">. {sec.name}</span>
                            {sec.badge && (
                              <span className={`text-[10px] font-bold ${styles.badgeColorClass} px-2 py-0.5 rounded-full uppercase ml-1.5`}>
                                {sec.badge}
                              </span>
                            )}
                          </div>
                          {sec.description && (
                            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                              {sec.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        <span className="text-xs text-slate-400 font-mono font-semibold bg-slate-50 border border-slate-150 rounded-lg px-2 py-1">
                          Số lượng: {secLinks.length}
                        </span>

                        {/* General master link button */}
                        {sec.url && (
                          <a
                            href={sec.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl transition-all flex items-center gap-1 border border-sky-100/60"
                            title="Mở thư mục/link tổng quan của mục lớn này"
                          >
                            <LucideIcon name="ExternalLink" size={11} />
                            <span className="hidden sm:inline">Mở link mục</span>
                          </a>
                        )}

                        {/* Edit Section Title/Link Button */}
                        <button
                          onClick={() => {
                            setEditingSection(sec);
                            setEditingMinorSection(null);
                            setIsQuickEditOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-sky-600 font-semibold text-xs rounded-xl transition-all flex items-center gap-1 border border-slate-150 cursor-pointer"
                          title="Sửa nhanh tên gọi và link của mục lớn này"
                        >
                          <LucideIcon name="Edit3" size={11} />
                          <span className="hidden sm:inline">Sửa mục lớn</span>
                        </button>

                        {/* Accordion toggle */}
                        <button
                          onClick={() => setCollapsedGroups(prev => ({ ...prev, [sec.id]: !prev[sec.id] }))}
                          className="p-1.5 bg-slate-100/85 hover:bg-slate-200/50 text-slate-500 rounded-lg transition-colors cursor-pointer"
                          title={isCollapsed ? 'Mở rộng' : 'Thu hẹp'}
                        >
                          <LucideIcon 
                            name="ChevronRight" 
                            className={`transition-transform duration-300 ${!isCollapsed ? 'rotate-90' : ''}`} 
                            size={16} 
                          />
                        </button>
                      </div>
                    </div>

                    {/* Section Body (if not collapsed) */}
                    {!isCollapsed && (
                      <div className="p-5 sm:p-6">
                        {secLinks.length === 0 ? (
                          <div className="text-center py-8">
                            <span className="text-2xl block mb-1">📁</span>
                            <p className="text-xs text-slate-400 italic">Chưa có liên kết hoặc tài liệu nào được hiển thị cho mục này.</p>
                          </div>
                        ) : secMinorSecs.length > 0 ? (
                          /* Render as STACKED SUBGROUPS (e.g. Booking KOC, Inhouse TikTok style) */
                          <div className="space-y-8">
                            {secMinorSecs.map(ms => {
                              const msLinks = secLinks.filter(l => l.groupTitle === ms.id);
                              
                              // Group links under this minor section by their subGroupTitle
                              const subGroupMap: Record<string, DashboardLink[]> = {};
                              msLinks.forEach(item => {
                                const subKey = item.subGroupTitle || 'Yêu cầu & Chung';
                                if (!subGroupMap[subKey]) subGroupMap[subKey] = [];
                                subGroupMap[subKey].push(item);
                              });

                              return (
                                <div key={ms.id} className="space-y-4">
                                  {/* Subgroup header block with dynamic line and inline edit triggers */}
                                  <div className="flex items-center justify-between pb-2 border-b border-sky-100/60 gap-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-lg">
                                        {ms.id.toLowerCase().includes('tiktok') ? '🎬' : '📊'}
                                      </span>
                                      <h4 className="font-display font-semibold text-slate-700 text-sm tracking-wide">
                                        Nhóm {ms.title}: {ms.id}
                                      </h4>
                                      {ms.url && (
                                        <a
                                          href={ms.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-2 py-0.5 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[10px] rounded-lg border border-teal-100 flex items-center gap-1 transition-all"
                                          title="Mở link tổng quan"
                                        >
                                          <LucideIcon name="ExternalLink" size={9} />
                                          <span>Link</span>
                                        </a>
                                      )}
                                    </div>

                                    {/* Direct Edit Button of Minor Section inside header */}
                                    <button
                                      onClick={() => {
                                        setEditingSection(null);
                                        setEditingMinorSection(ms);
                                        setIsQuickEditOpen(true);
                                      }}
                                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-teal-600 rounded-lg border border-slate-150 text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                      title="Sửa tên hoặc gắn link cho nhóm/mục nhỏ này"
                                    >
                                      <LucideIcon name="Edit3" size={11} />
                                      <span>Sửa mục nhỏ</span>
                                    </button>
                                  </div>

                                  {msLinks.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic py-2 text-center">Chưa có liên kết nào nhóm này.</p>
                                  ) : (
                                    /* Grid of subGroup cards, e.g. Agency Cards */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                      {Object.entries(subGroupMap).map(([sgName, sgLinks]) => (
                                        <div 
                                          key={sgName}
                                          className="bg-slate-50/70 border border-slate-100/90 rounded-2xl p-4.5 hover:shadow-xs hover:bg-slate-50 transition-all flex flex-col justify-between"
                                        >
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs">
                                                  {ms.id.toLowerCase().includes('tiktok') ? '📱' : '🏢'}
                                                </span>
                                                <h5 className="font-display font-bold text-slate-800 text-sm">{sgName}</h5>
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {sgLinks.length} tài liệu
                                              </span>
                                            </div>

                                            {/* Sub item links list */}
                                            <div className="space-y-2 pt-1">
                                              {sgLinks.map(link => (
                                                <div 
                                                  key={link.id}
                                                  className="p-3 bg-white border border-slate-100/55 rounded-xl hover:border-sky-300 hover:shadow-xs transition-colors relative group/item"
                                                >
                                                  <div className="flex items-start justify-between gap-1">
                                                    <div className="max-w-[85%]">
                                                      <p className="text-xs font-semibold text-slate-700 leading-tight truncate-2-lines" title={link.description}>
                                                        {link.title}
                                                      </p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                                      {/* Favorite button */}
                                                      <button 
                                                        onClick={(e) => toggleFavorite(link.id, e)}
                                                        className="p-0.5 text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                                                        title="Độ ưu tiên"
                                                      >
                                                        <LucideIcon name="Star" size={11} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-300' : ''} />
                                                      </button>

                                                      {/* Edit Click */}
                                                      <button
                                                        onClick={(e) => handleEditClick(link, e)}
                                                        className="p-0.5 text-slate-300 opacity-0 group-hover/item:opacity-100 hover:text-sky-600 transition-opacity cursor-pointer"
                                                        title="Sửa liên kết"
                                                      >
                                                        <LucideIcon name="Edit3" size={11} />
                                                      </button>
                                                    </div>
                                                  </div>

                                                  {link.description && (
                                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-snug">
                                                      {link.description}
                                                    </p>
                                                  )}

                                                  {/* Bottom layout */}
                                                  <div className="mt-3 flex items-center justify-between pt-1 border-t border-slate-50">
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
                                                        Mở file
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
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Render as FLAT GRID (Section 1 or 3 style) */
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {secLinks.map(link => (
                              <div
                                key={link.id}
                                className={`group bg-gradient-to-br 	ext-slate-800 ${styles.cardGradient} rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between`}
                              >
                                <div>
                                  {/* Star Button */}
                                  <button
                                    onClick={(e) => toggleFavorite(link.id, e)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border border-slate-100 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-500 transition-all text-slate-400 z-10 cursor-pointer"
                                    title={favorites.includes(link.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                  >
                                    <LucideIcon name="Star" size={13} className={favorites.includes(link.id) ? 'text-amber-500 fill-amber-400' : ''} />
                                  </button>

                                  <div className="flex gap-3 mb-2.5">
                                    <div className={`p-2.5 bg-white text-${styles.accentColor}-600 rounded-xl border border-${styles.accentColor}-100/55`}>
                                      <LucideIcon name={link.iconName} size={18} />
                                    </div>
                                    <div className="pr-4 flex-1">
                                      <h4 className={`font-display font-semibold text-slate-800 text-sm group-hover:text-${styles.accentColor}-700 transition-colors`}>
                                        {link.title}
                                      </h4>
                                      {link.subGroupTitle && (
                                        <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                                          {link.subGroupTitle}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <p className="text-xs text-slate-500 min-h-[40px] leading-relaxed line-clamp-2 mt-1">
                                    {link.description}
                                  </p>
                                </div>

                                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                  {link.url ? (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                                      Báo cáo sẵn sàng
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
                                      Chưa cập nhật
                                    </span>
                                  )}

                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => handleEditClick(link, e)}
                                      className="p-1 px-2 text-slate-400 hover:text-sky-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                    >
                                      Sửa
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
                                        className="p-1 px-3.5 bg-sky-500 hover:bg-sky-600 text-white select-none rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 pb-1"
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
                );
              })}
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
          sections={sections}
        />

        {/* Section Structure Config Modal */}
        <SectionEditorModal
          isOpen={isSectionEditorOpen}
          onClose={() => setIsSectionEditorOpen(false)}
          sections={sections}
          minorSections={minorSections}
          onSaveSections={handleSaveSections}
          onSaveMinorSections={handleSaveMinorSections}
        />

        {/* Quick Edit Popup Modal for Major & Minor sections */}
        <QuickEditModal
          isOpen={isQuickEditOpen}
          onClose={() => setIsQuickEditOpen(false)}
          section={editingSection}
          minorSection={editingMinorSection}
          onSaveSection={handleSaveSectionQuick}
          onSaveMinorSection={handleSaveMinorSectionQuick}
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

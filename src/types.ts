export type SectionId = 'reports_plans' | 'booking_tiktok' | 'training' | 'favorites';

export interface DashboardLink {
  id: string;
  section: 'reports_plans' | 'booking_tiktok' | 'training';
  categoryTitle: string;   // E.g., "Báo cáo và kế hoạch", "Booking & TikTok", "Đào tạo"
  groupTitle: string;      // E.g., "Báo cáo Digital", "Booking KOC", "Inhouse TikTok"
  subGroupTitle?: string;  // E.g., "We Win", "Chăm sóc bé yêu" (if any)
  title: string;           // E.g., "Báo cáo Digital", "Bọt đánh răng", "Kịch bản", "Kênh TikTok"
  description: string;     // Short helpful description for Sachi Assistant Brand Manager
  url?: string;            // The destination URL, empty means "Đang cập nhật"
  iconName: string;        // Lucide icon name string
}

export interface NoteItem {
  id: string;
  content: string;
  createdAt: string;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
}

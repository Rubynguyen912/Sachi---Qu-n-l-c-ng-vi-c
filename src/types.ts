export type SectionId = string;

export interface DashboardLink {
  id: string;
  section: string;         // E.g., "reports_plans", "booking_tiktok", "training" or custom section IDs
  categoryTitle: string;   // E.g., "Báo cáo và kế hoạch", "Booking & TikTok", "Đào tạo"
  groupTitle: string;      // E.g., "Báo cáo Digital", "Booking KOC", "Inhouse TikTok"
  subGroupTitle?: string;  // E.g., "We Win", "Chăm sóc bé yêu" (if any)
  title: string;           // E.g., "Báo cáo Digital", "Bọt đánh răng", "Kịch bản", "Kênh TikTok"
  description: string;     // Short helpful description for Sachi Assistant Brand Manager
  url?: string;            // The destination URL, empty means "Đang cập nhật"
  iconName: string;        // Lucide icon name string
}

export interface SachiSection {
  id: string;
  title: string;           // Display number or short text, e.g. "1", "2", "3" or custom
  name: string;            // Full display name, e.g., "Báo cáo và kế hoạch"
  description: string;     // Section description line
  url?: string;            // Optional direct master link for the section
  badge?: string;          // Optional badge text like "Sachi S_Team"
}

export interface SachiMinorSection {
  id: string;              // Matches groupTitle, e.g., "Booking KOC"
  title: string;           // Display number or short text, e.g. "1", "2"
  url?: string;            // Optional direct master link for the subsection
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

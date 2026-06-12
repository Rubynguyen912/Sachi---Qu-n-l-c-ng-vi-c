import { DashboardLink } from './types';

export const DEFAULT_SACHI_LINKS: DashboardLink[] = [
  // SECTION 1: BÁO CÁO VÀ KẾ HOẠCH
  {
    id: 'rp-digital',
    section: 'reports_plans',
    categoryTitle: 'Báo cáo và kế hoạch',
    groupTitle: 'Báo cáo Digital',
    title: 'Báo cáo Digital',
    description: 'Theo dõi tổng quan số liệu digital, hiệu suất quảng cáo và tương tác trên các nền tảng số của Sachi.',
    url: 'https://docs.google.com/spreadsheets/d/1bxUUQdTgUtTvHm2HbaawGeojJfT5_lkIN_dc3hQihNY/edit?gid=387025014#gid=387025014',
    iconName: 'LineChart'
  },
  {
    id: 'rp-booking-content-plan',
    section: 'reports_plans',
    categoryTitle: 'Báo cáo và kế hoạch',
    groupTitle: 'Kế hoạch Booking và Nội dung',
    title: 'Kế hoạch Booking và Nội dung',
    description: 'Lịch trình booking KOC, kịch bản chi tiết và timeline phân phối nội dung truyền thông thương hiệu.',
    url: 'https://docs.google.com/spreadsheets/d/1zuwkTNneImOVvIBRjzSgUUMcqLVsV2vo/edit?gid=1851401193#gid=1851401193',
    iconName: 'CalendarDays'
  },
  {
    id: 'rp-mkt-target',
    section: 'reports_plans',
    categoryTitle: 'Báo cáo và kế hoạch',
    groupTitle: 'Báo cáo',
    subGroupTitle: 'Chỉ tiêu MKT',
    title: 'Chỉ tiêu MKT (Vận động KPIs)',
    description: 'Bảng theo dõi mục tiêu, chỉ tiêu marketing của quý/tháng, tỷ lệ hoàn thành KPI thực tế của team.',
    url: 'https://docs.google.com/spreadsheets/d/1Bo5u3nBazP7MB1p5ioTMZxiF2jdMic2l/edit?gid=2023994340#gid=2023994340',
    iconName: 'Target'
  },
  {
    id: 'rp-social-stats',
    section: 'reports_plans',
    categoryTitle: 'Báo cáo và kế hoạch',
    groupTitle: 'Báo cáo',
    subGroupTitle: 'Thống kê Social',
    title: 'Thống kê Social',
    description: 'Phân tích định kỳ lượng tiếp cận, tương tác, mức độ nhận diện thương hiệu trên các kênh MXH.',
    url: 'https://docs.google.com/spreadsheets/d/1AqANhLq75SB7YEI1z7ggPMLNIf05r6cJ_hWNwR977qA/edit?pli=1&gid=1985930739#gid=1985930739',
    iconName: 'Users'
  },

  // SECTION 2: BOOKING & TIKTOK
  // Sub Category: Booking KOC
  {
    id: 'bk-wewin-toothpaste',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'We Win',
    title: 'Bọt đánh răng (We Win)',
    description: 'Chiến dịch booking KOC quảng bá dòng sản phẩm Bọt đánh răng Sachi cho bé ngừa sâu răng.',
    url: 'https://docs.google.com/spreadsheets/d/16vfoDbo6O5EuhbhAdQcrL74hxAtIO_pq0s3p5dqzg4g/edit?usp=sharing',
    iconName: 'Sparkles'
  },
  {
    id: 'bk-wewin-bath',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'We Win',
    title: 'Nước tắm (We Win)',
    description: 'Chiến dịch booking KOC cho dòng sản phẩm nước tắm thảo dược làm dịu, phòng rôm sảy Sachi Baby.',
    url: 'https://docs.google.com/spreadsheets/d/1IX4ecoQXAtJ1nan3pDZUjn_QBVKd51wLqA3rw44cfuU/edit?gid=0#gid=0',
    iconName: 'Droplet'
  },
  {
    id: 'bk-onetone',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'Onetone',
    title: 'Onetone Agency',
    description: 'File quản lý booking và kế hoạch hợp tác sản xuất nội dung với Agency Onetone.',
    url: 'https://docs.google.com/spreadsheets/d/1J_73Dqv-kNOkrxGs13mRJc6dUsHAmouKbzWNcVo4GpU/edit',
    iconName: 'Layers'
  },
  {
    id: 'bk-legia',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'Lê Gia',
    title: 'Lê Gia Agency',
    description: 'Theo dõi tiến độ duyệt bài viết, duyệt video và chi phí thanh toán booking từ Agency Lê Gia.',
    url: 'https://docs.google.com/spreadsheets/d/1OFvYlDSYx4IHyfQF6I07Lv1Emi1P8HchEVRT7lo6Tog/edit?usp=sharing',
    iconName: 'Briefcase'
  },
  {
    id: 'bk-dhc',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'DHC',
    title: 'DHC Agency',
    description: 'Dữ liệu booking KOC, theo dõi lượt view, chuyển đổi bán hàng từ đối tác DHC.',
    url: 'https://docs.google.com/spreadsheets/d/1ViMmUnsi6Cw9UJHVmA4clQ39itLdqYupE0kZDMGQ4jI/edit?gid=126573843#gid=126573843',
    iconName: 'Activity'
  },
  {
    id: 'bk-sia',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'SIA',
    title: 'SIA Agency',
    description: 'Chiến dịch booking KOC của SIA Agency đang được xây dựng kế hoạch.',
    url: '', // Đang cập nhật
    iconName: 'Clock'
  },
  {
    id: 'bk-tnd',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'TND',
    title: 'TND Agency',
    description: 'Chiến dịch booking KOC của TND Agency đang được cập nhật kế hoạch triển khai.',
    url: '', // Đang cập nhật
    iconName: 'Clock'
  },
  {
    id: 'bk-inhouse',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Booking KOC',
    subGroupTitle: 'Inhouse',
    title: 'Inhouse Booking',
    description: 'Kênh booking tự vận hành trực tiếp bởi Sachi Brand Team, ưu tiên các hạt giống KOC chất lượng.',
    url: '', // Đang cập nhật
    iconName: 'Clock'
  },

  // Sub Category: Inhouse TikTok
  {
    id: 'tk-chamsoc-script',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'Chăm sóc bé yêu',
    title: 'Kịch bản (Chăm sóc bé yêu)',
    description: 'Kho kịch bản video ngắn, ý tưởng sáng tạo cho kênh TikTok Chăm sóc bé yêu.',
    url: 'https://docs.google.com/spreadsheets/d/1GcvnYEw29gKSt9eghPyh8uzwjNXwAlJmNinJknWMY-0/edit?gid=13390823#gid=13390823',
    iconName: 'FileSpreadsheet'
  },
  {
    id: 'tk-chamsoc-channel',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'Chăm sóc bé yêu',
    title: 'Kênh TikTok (Chăm sóc bé yêu)',
    description: 'Trang chủ kênh TikTok chính thức chia sẻ kinh nghiệm chăm sóc bé khoa học.',
    url: 'https://www.tiktok.com/@sachi_chamsocbeyeu',
    iconName: 'Video'
  },
  {
    id: 'tk-sachibaby-script',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'Sachi Baby',
    title: 'Kịch bản (Sachi Baby)',
    description: 'Tổng hợp kịch bản quay dựng giới thiệu sản phẩm Sachi Baby sắp ra mắt.',
    url: '', // Đang cập nhật
    iconName: 'Clock'
  },
  {
    id: 'tk-sachibaby-channel',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'Sachi Baby',
    title: 'Kênh TikTok (Sachi Baby)',
    description: 'Trang chủ giới thiệu thương hiệu và các chương trình ưu đãi độc quyền cho mẹ và bé.',
    url: 'https://www.tiktok.com/@sachibaby.vn',
    iconName: 'Video'
  },
  {
    id: 'tk-chamcon-script',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'AI Chăm con khoa học',
    title: 'Kịch bản (AI Chăm con khoa học)',
    description: 'Hệ thống kịch bản xây dựng nội dung AI, tips chăm sóc sức đề kháng và dinh dưỡng.',
    url: 'https://docs.google.com/spreadsheets/d/15-tf0Agga1pI5h9dVO_8fbqm3xO30oGX/edit?gid=392404851#gid=392404851',
    iconName: 'FileSpreadsheet'
  },
  {
    id: 'tk-chamcon-channel',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'AI Chăm con khoa học',
    title: 'Kênh TikTok (AI Chăm con khoa học)',
    description: 'Kênh chia sẻ kiến thức y khoa, thực dưỡng cho trẻ sơ sinh và trẻ nhỏ sử dụng công nghệ AI.',
    url: 'https://www.tiktok.com/@sachibaby952',
    iconName: 'Video'
  },
  {
    id: 'tk-thaoduoc-script',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'AI Tiệm thảo dược cho bé',
    title: 'Kịch bản (AI Tiệm thảo dược cho bé)',
    description: 'Tổng hợp kịch bản giới thiệu các loại lá tắm thảo mộc, bọt bôi và kinh nghiệm dân gian.',
    url: 'https://docs.google.com/spreadsheets/d/1d0zttLg87TeeJpAF_v7yU3m2P9kgGqbfzwdsCqaCKEc/edit?gid=2037167357#gid=2037167357',
    iconName: 'FileSpreadsheet'
  },
  {
    id: 'tk-thaoduoc-channel',
    section: 'booking_tiktok',
    categoryTitle: 'Booking & TikTok',
    groupTitle: 'Inhouse TikTok',
    subGroupTitle: 'AI Tiệm thảo dược cho bé',
    title: 'Kênh TikTok (AI Tiệm thảo dược cho bé)',
    description: 'Kênh TikTok định vị cổ truyền, dược chất thiên nhiên an toàn tuyệt đối cho bé.',
    url: 'https://www.tiktok.com/@tiemthaoduocchobe',
    iconName: 'Video'
  },

  // SECTION 3: ĐÀO TẠO
  {
    id: 'tr-brand-guideline',
    section: 'training',
    categoryTitle: 'Đào tạo',
    groupTitle: 'Brand Guideline',
    title: 'Brand Guideline',
    description: 'Cẩm nang thương hiệu, quy chuẩn logo, font chữ, màu sắc, tone-of-voice chính thức phục vụ thiết kế và định hướng content.',
    url: 'https://rubynguyen912.github.io/Sachi-brand-guideline/',
    iconName: 'Compass'
  },
  {
    id: 'tr-content-doc',
    section: 'training',
    categoryTitle: 'Đào tạo',
    groupTitle: 'Tài liệu nội dung',
    title: 'Tài liệu nội dung',
    description: 'Thư mục Google Drive lưu trữ content mẫu, hình ảnh sản phẩm Sachi, video raw và tài liệu tham khảo.',
    url: 'https://drive.google.com/drive/folders/1gLqKZJFCMwHSCpLoraQezY93R6aD25ck?usp=drive_link',
    iconName: 'FolderOpen'
  }
];

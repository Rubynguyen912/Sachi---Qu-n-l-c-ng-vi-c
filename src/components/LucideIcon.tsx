import React from 'react';
import {
  LineChart,
  CalendarDays,
  Target,
  Users,
  Sparkles,
  Droplet,
  Layers,
  Briefcase,
  Activity,
  Clock,
  FileSpreadsheet,
  Video,
  Compass,
  FolderOpen,
  Heart,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  Menu,
  X,
  Edit3,
  RotateCcw,
  Smartphone,
  ExternalLink,
  BookOpen,
  HelpCircle,
  FileText,
  Star,
  Check,
  AlertCircle,
  SlidersHorizontal,
  PlusCircle,
  FileDown,
  Info
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  LineChart,
  CalendarDays,
  Target,
  Users,
  Sparkles,
  Droplet,
  Layers,
  Briefcase,
  Activity,
  Clock,
  FileSpreadsheet,
  Video,
  Compass,
  FolderOpen,
  Heart,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  Menu,
  X,
  Edit3,
  RotateCcw,
  Smartphone,
  ExternalLink,
  BookOpen,
  HelpCircle,
  FileText,
  Star,
  Check,
  AlertCircle,
  SlidersHorizontal,
  PlusCircle,
  FileDown,
  Info
};

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 20 }: LucideIconProps) {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent className={className} size={size} />;
}

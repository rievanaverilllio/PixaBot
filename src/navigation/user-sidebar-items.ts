import {
  Banknote,
  Calendar,
  ChartBar,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  Settings,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
  FileText,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "PixaChat",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Token Dashboard",
        url: "/token-dashboard",
        icon: Banknote,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Beli Token",
        url: "/buy-token",
        icon: Banknote,
      },
      {
        title: "Top-up / Pembayaran",
        url: "/payments",
        icon: ReceiptText,
      },
      {
        title: "Riwayat & Tagihan",
        url: "/history",
        icon: FileText,
      },
      {
        title: "API & Kunci",
        url: "/api-keys",
        icon: Fingerprint,
      },
      {
        title: "Bantuan & Dokumentasi",
        url: "/help",
        icon: FileText,
      },
      {
        title: "Kebijakan Privasi",
        url: "/privacy",
        icon: Lock,
      },
      {
        title: "Pengaturan Akun",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
  {
    id: 3,
    label: "Misc",
    items: [
      {
        title: "Others",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
    ],
  },
];

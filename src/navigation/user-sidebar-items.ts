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
        url: "/dashboard/pixachat",
        icon: LayoutDashboard,
      },
      // {
      //   title: "Token Dashboard",
      //   url: "/dashboard/token-dashboard",
      //   icon: Banknote,
      // },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Beli Token",
        url: "/dashboard/buy-token",
        icon: Banknote,
      },
      {
        title: "Top-up / Pembayaran",
        url: "/dashboard/payments",
        icon: ReceiptText,
      },
      {
        title: "Riwayat & Tagihan",
        url: "/dashboard/history",
        icon: FileText,
      },
      {
        title: "API & Kunci",
        url: "/dashboard/api-keys",
        icon: Fingerprint,
      },
      {
        title: "Bantuan & Dokumentasi",
        url: "/dashboard/help",
        icon: FileText,
      },
      {
        title: "Kebijakan Privasi",
        url: "/dashboard/privacy",
        icon: Lock,
      },
      {
        title: "Pengaturan Akun",
        url: "/dashboard/settings",
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

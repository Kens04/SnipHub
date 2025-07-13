import { MdOutlineDashboard } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { TbBooks } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";

export const SidebarItems = [
  {
    id: 1,
    href: "/dashboard",
    icon: <MdOutlineDashboard />,
    link: "ダッシュボード",
  },
  {
    id: 2,
    href: "/dashboard/snippets/new",
    icon: <FiPlus />,
    link: "スニペット作成",
  },
  {
    id: 3,
    href: "/dashboard/snippets",
    icon: <TbBooks />,
    link: "スニペット一覧",
  },
  {
    id: 4,
    href: "/dashboard/snippets/favorite",
    icon: <FaRegStar />,
    link: "お気に入り",
  },
];

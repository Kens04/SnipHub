import Link from "next/link";
import { SidebarItems } from "../_components/SidebarItems";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { useDataFetch } from "../_hooks/useDataFetch";
import { User } from "../_types/user";
import avatar from "../public/images/avatar.png";
import Image from "next/image";

export const Sidebar = () => {
  const { token, session } = useSupabaseSession();
  const { data, error, isLoading } = useDataFetch<User>(
    session?.user.id ? `/api/user/${session?.user.id}` : null
  );
  if (error) return <div>ユーザー情報の読み込みに失敗しました</div>;
  return (
    <aside className="hidden md:block fixed bg-white w-[280px] left-0 bottom-0 top-[88px]">
      {token && (
        <div className="flex items-center gap-4 p-4 border-t">
          {isLoading ? (
            <Image
              className="w-[40px] h-[40px] rounded-full"
              src={avatar}
              width={40}
              height={40}
              alt="avatar"
            />
          ) : (
            <>
              <Image
                className="w-[40px] h-[40px] rounded-full"
                src={data?.iconUrl || avatar}
                width={40}
                height={40}
                alt="avatar"
              />
              <span>{data?.userName}</span>
            </>
          )}
        </div>
      )}
      {SidebarItems.map((SidebarItem) => {
        return (
          <Link
            key={SidebarItem.id}
            href={SidebarItem.href}
            className="p-4 flex gap-2 items-center hover:bg-gray-100 border-t"
          >
            {SidebarItem.icon}
            {SidebarItem.link}
          </Link>
        );
      })}
    </aside>
  );
};

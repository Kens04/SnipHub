import Link from "next/link";
import { ReactNode } from "react";

interface LinkMenuProps {
  snippetType: string;
  targetType: string;
  href: string;
  children: ReactNode;
}

const LinkMenu: React.FC<LinkMenuProps> = ({
  snippetType,
  targetType,
  href,
  children,
}) => {
  const isActive = snippetType === targetType;

  return (
    <Link
      className={
        isActive
          ? "text-color-primary hover:text-color-primary-hover relative top-[2px] text-base md:text-xl md:leading-loose font-semibold border-b-2 border-color-primary"
          : "font-semibold text-base md:text-xl relative top-[2px] md:leading-loose"
      }
      href={href}
    >
      {children}
    </Link>
  );
};

export default LinkMenu;

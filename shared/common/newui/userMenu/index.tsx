import {JSX, PropsWithChildren, useEffect, useRef, useState} from "react";

import cn from "@edgedb/common/utils/classNames";

import {SignOutIcon} from "../icons";
import {LoadingSkeleton} from "../loadingSkeleton";

import styles from "./userMenu.module.scss";

export function UserMenuSkeleton() {
  return <LoadingSkeleton className={styles.userMenuSkeleton} />;
}

export type ActionOrLink =
  | {
      action: () => void;
    }
  | {
      link: (props: PropsWithChildren<{className?: string}>) => JSX.Element;
    };

export interface UserMenuProps {
  avatarUrl: string;
  name?: string | null;
  email?: string | null;
  signout: ActionOrLink;
  menuItems?: MenuItemProps[][];
}

export function UserMenu(props: UserMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen) {
      const listener = (e: MouseEvent) => {
        if (!menuRef.current?.contains(e.target as Node)) closeMenu();
      };

      window.addEventListener("click", listener, {capture: true});

      return () => {
        window.removeEventListener("click", listener, {capture: true});
      };
    }
  }, [menuOpen]);

  return (
    <div ref={menuRef} className={styles.userMenu}>
      <div
        className={styles.menuButton}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <UserAvatar avatarUrl={props.avatarUrl} />
      </div>

      {menuOpen ? (
        <UserMenuContent
          className={styles.menuDropdown}
          closeMenu={closeMenu}
          {...props}
        />
      ) : null}
    </div>
  );
}

export function UserMenuContent({
  className,
  closeMenu,
  signout,
  menuItems,
  ...user
}: UserMenuProps & {
  className?: string;
  closeMenu?: () => void;
}) {
  return (
    <div className={cn(styles.menuContent, className)}>
      <div className={styles.userCard}>
        <UserAvatar avatarUrl={user.avatarUrl} />
        <div className={styles.info}>
          <div className={styles.name}>{user.name ?? user.email}</div>
          {user.name && user.email ? (
            <div className={styles.subtitle}>{user.email}</div>
          ) : null}
        </div>
      </div>

      {menuItems
        ? menuItems.map((g, i) => (
            <div key={`menuGroup-${i}`} className={styles.menuItemsList}>
              {g.map((item, i) => (
                <MenuItem key={`menuItem-${i}`} {...item} />
              ))}
            </div>
          ))
        : null}
      <div className={styles.menuItemsList}>
        <MenuItem label="Sign out" icon={<SignOutIcon />} {...signout} />
      </div>
    </div>
  );
}

export type MenuItemProps = {
  icon: JSX.Element;
  label: string;
} & (ActionOrLink | {});

function MenuItem({icon, label, ...rest}: MenuItemProps) {
  const El = "link" in rest ? rest.link : "div";
  return (
    <El
      className={cn(styles.menuItem, {
        [styles.hasAction]: "action" in rest || "link" in rest,
      })}
      onClick={"action" in rest ? rest.action : undefined}
    >
      <span>{label}</span>
      {icon}
    </El>
  );
}

function UserAvatar({avatarUrl}: {avatarUrl: string}) {
  return (
    <div
      className={styles.avatar}
      style={{
        backgroundImage: `url(${avatarUrl})`,
      }}
    />
  );
}

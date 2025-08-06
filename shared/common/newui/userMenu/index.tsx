import {JSX, useEffect, useRef, useState} from "react";

import cn from "@edgedb/common/utils/classNames";

import {Button, LinkButton} from "../button";
import {SignOutIcon} from "../icons";
import {LoadingSkeleton} from "../loadingSkeleton";

import styles from "./userMenu.module.scss";

export function UserMenuSkeleton() {
  return <LoadingSkeleton className={styles.userMenuSkeleton} />;
}

export interface UserMenuProps {
  avatarUrl: string;
  name?: string | null;
  email?: string | null;
  signout: string | (() => void);
  menuItems?: MenuItemProps[];
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
        <>
          <div className={styles.info}>
            <div className={styles.name}>{user.name ?? user.email}</div>
            {user.name && user.email ? (
              <div className={styles.subtitle}>{user.email}</div>
            ) : null}
          </div>
          <SignoutButton signout={signout} />
        </>
      </div>

      {menuItems ? (
        <div className={styles.menuItemsList}>
          {menuItems.map((item, i) => (
            <MenuItem key={i} {...item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface MenuItemProps {
  action: () => void;
  icon: JSX.Element;
  label: string;
}

function MenuItem({action, icon, label}: MenuItemProps) {
  return (
    <div className={styles.menuItem} onClick={action}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function SignoutButton({signout}: Pick<UserMenuProps, "signout">) {
  const props = {
    className: styles.signout,
    rightIcon: <SignOutIcon />,
    children: "Sign out",
  };
  return typeof signout === "string" ? (
    <LinkButton {...props} href={signout} />
  ) : (
    <Button {...props} onClick={signout} />
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

import {Key} from "react";

import cn from "@edgedb/common/utils/classNames";

import styles from "./pillTabs.module.scss";

export interface PillTab<T> {
  value: T;
  label: string;
}

export interface PillTabsProps<T> {
  className?: string;
  tabs: PillTab<T>[];
  selected: T;
  onChange: (value: T) => void;
}

export function PillTabs<T extends Key>({
  className,
  tabs,
  selected,
  onChange,
}: PillTabsProps<T>) {
  return (
    <div className={cn(styles.tabs, className)}>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          className={cn(styles.tab, {
            [styles.selected]: selected === tab.value,
          })}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}

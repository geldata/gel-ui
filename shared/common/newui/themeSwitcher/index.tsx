import {Theme, useTheme} from "../../hooks/useTheme";
import cn from "../../utils/classNames";

import {DarkThemeIcon, LightThemeIcon, SystemThemeIcon} from "./icons";

import styles from "./themeSwitcher.module.scss";

const themes = [Theme.light, Theme.system, Theme.dark];

const themeIcons = {
  [Theme.light]: <LightThemeIcon />,
  [Theme.system]: <SystemThemeIcon />,
  [Theme.dark]: <DarkThemeIcon />,
};

export function ThemeSwitcher({className}: {className?: string}) {
  const [theme, _, setTheme] = useTheme();

  return (
    <div className={cn(styles.themeSwitcher, className)}>
      <div
        className={styles.selectedMarker}
        style={{transform: `translateX(${themes.indexOf(theme) * 30}px)`}}
      />

      {themes.map((t) => (
        <div
          key={t}
          className={cn(styles.option, {
            [styles.selected]: theme === t,
          })}
          onClick={() => setTheme(t)}
        >
          {themeIcons[t]}
        </div>
      ))}
    </div>
  );
}

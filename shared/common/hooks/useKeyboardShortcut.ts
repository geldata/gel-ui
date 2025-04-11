import {useEffect} from "react";

export function useKeyboardShortcut(key: string, callback: Function) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isKeyPressed = event.key === key;

      if (
        (isMac && event.metaKey && isKeyPressed) ||
        (!isMac && event.ctrlKey && isKeyPressed)
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback]);
}

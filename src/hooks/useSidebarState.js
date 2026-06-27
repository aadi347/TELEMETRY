import { useState, useCallback } from "react";

/**
 * Custom hook to manage sidebar collapse/expand state.
 * @param {boolean} initialCollapsed - Initial collapsed state (default: false)
 * @returns {{ isCollapsed: boolean, toggle: Function, open: Function, close: Function }}
 */
export function useSidebarState(initialCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggle = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const open = useCallback(() => setIsCollapsed(false), []);
  const close = useCallback(() => setIsCollapsed(true), []);

  return { isCollapsed, toggle, open, close };
}

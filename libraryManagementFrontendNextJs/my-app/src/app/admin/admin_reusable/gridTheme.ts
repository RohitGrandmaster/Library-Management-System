// admin/admin_reusable_components/gridTheme.ts
// ⚠️ NO hardcoded values here — all values come from admin.css
import { themeQuartz } from 'ag-grid-community';

const v = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
};

export const gridTheme = themeQuartz.withParams({
  backgroundColor:       v('--ag-bg', '#1A1A2E'),
  foregroundColor:       v('--ag-fg', '#E2E8F0'),
  headerBackgroundColor: v('--ag-header-bg', '#0F172A'),
  headerTextColor:       v('--ag-header-text', '#94A3B8'),
  borderColor:           v('--ag-border', '#334155'),
  rowBorder:             true,
  oddRowBackgroundColor: v('--ag-odd-row-bg', '#1E293B'),
  rowHoverColor:         v('--ag-row-hover', '#334155'),
  fontFamily:            v('--ag-font', 'inherit'),
  fontSize:              13,
  wrapperBorder:         false,
  wrapperBorderRadius:   0,
});

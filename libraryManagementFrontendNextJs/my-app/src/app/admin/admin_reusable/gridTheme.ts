// admin/admin_reusable_components/gridTheme.ts
// ⚠️ NO hardcoded values here — all values come from admin.css
import { themeQuartz } from 'ag-grid-community';

export const gridTheme = themeQuartz.withParams({
  backgroundColor:       '#0F0F1A',
  foregroundColor:       '#F0F0FF',
  headerBackgroundColor: '#16162A',
  headerTextColor:       '#94A3B8',
  borderColor:           '#2A2A3E',
  rowBorder:             true,
  oddRowBackgroundColor: '#12121F',
  rowHoverColor:         'rgba(99, 102, 241, 0.08)',
  fontFamily:            "'Inter', sans-serif",
  fontSize:              13,
  wrapperBorder:         false,
  wrapperBorderRadius:   0,
});

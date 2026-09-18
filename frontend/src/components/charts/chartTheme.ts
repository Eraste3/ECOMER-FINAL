export function chartTooltipStyle(tone: 'light' | 'dark') {
  return {
    contentStyle: {
      borderRadius: 10,
      border: tone === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(148,197,234,0.18)',
      background: tone === 'light' ? '#ffffff' : '#071b2e',
      boxShadow: '0 12px 32px -12px rgba(4,16,28,0.4)',
      fontSize: 12,
      color: tone === 'light' ? '#0f172a' : '#e2e8f0'
    },
    labelStyle: {
      color: tone === 'light' ? '#64748b' : '#94a3b8',
      fontSize: 11,
      marginBottom: 4
    },
    itemStyle: { fontSize: 12 }
  } as const;
}
import Icon from '@/components/ui/icon';

type Tab = 'scanner' | 'security' | 'knowledge' | 'checklist' | 'sos';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  isDark?: boolean;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'scanner', label: 'Сканер', icon: 'ShieldSearch' },
  { id: 'security', label: 'Безопасность', icon: 'Lock' },
  { id: 'knowledge', label: 'Знания', icon: 'BookOpen' },
  { id: 'checklist', label: 'Чек-лист', icon: 'CheckCircle' },
  { id: 'sos', label: 'SOS', icon: 'Siren' },
];

export default function BottomNav({ active, onChange, isDark = true }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 z-50 flex items-center justify-around px-2 py-2 transition-all duration-300"
      style={{
        background: isDark ? 'hsl(220, 30%, 11%)' : '#ffffff',
        borderTop: isDark ? '1px solid hsl(220, 26%, 22%)' : '1px solid rgba(0,0,0,0.08)',
        maxWidth: 430,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const isSos = tab.id === 'sos';
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
            style={{ minWidth: 56 }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
              style={
                isActive
                  ? isSos
                    ? { background: 'hsla(0,72%,51%,0.15)', color: 'hsl(0,72%,60%)' }
                    : { background: 'hsla(328,80%,50%,0.15)', color: '#e91e8c' }
                  : { color: isDark ? 'hsl(215, 20%, 45%)' : 'rgba(0,0,0,0.35)' }
              }
            >
              <Icon name={tab.icon} fallback="Circle" size={18} />
            </div>
            <span
              className="text-[10px] font-medium transition-colors duration-200"
              style={
                isActive
                  ? isSos
                    ? { color: 'hsl(0,72%,60%)' }
                    : { color: '#e91e8c' }
                  : { color: isDark ? 'hsl(215, 20%, 45%)' : 'rgba(0,0,0,0.35)' }
              }
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

import Icon from '@/components/ui/icon';

type Tab = 'scanner' | 'security' | 'knowledge' | 'checklist' | 'sos';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'scanner', label: 'Сканер', icon: 'ShieldSearch' },
  { id: 'security', label: 'Безопасность', icon: 'Lock' },
  { id: 'knowledge', label: 'Знания', icon: 'BookOpen' },
  { id: 'checklist', label: 'Чек-лист', icon: 'CheckCircle' },
  { id: 'sos', label: 'SOS', icon: 'Siren' },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: 'hsl(220, 30%, 11%)', borderTop: '1px solid hsl(220, 26%, 22%)' }}
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
                    ? { background: 'hsl(var(--danger))', color: '#fff' }
                    : { background: 'hsl(var(--primary))', color: '#fff' }
                  : { color: 'hsl(215, 20%, 45%)' }
              }
            >
              <Icon name={tab.icon} fallback="Circle" size={18} />
            </div>
            <span
              className="text-[10px] font-medium transition-colors duration-200"
              style={
                isActive
                  ? isSos
                    ? { color: 'hsl(var(--danger))' }
                    : { color: 'hsl(var(--primary))' }
                  : { color: 'hsl(215, 20%, 45%)' }
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

import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import ScannerTab from "@/components/tabs/ScannerTab"
import SecurityTab from "@/components/tabs/SecurityTab"
import KnowledgeTab from "@/components/tabs/KnowledgeTab"
import ChecklistTab from "@/components/tabs/ChecklistTab"
import SOSTab from "@/components/tabs/SOSTab"
import Icon from "@/components/ui/icon"
import { useTheme } from "@/hooks/useTheme"

type Tab = 'scanner' | 'security' | 'knowledge' | 'checklist' | 'sos'

const darkBg = '#0d1424'
const lightBg = '#f0f4ff'

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('scanner')
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100dvh',
        maxWidth: 430,
        margin: '0 auto',
        background: isDark ? darkBg : lightBg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        color: isDark ? '#f0f4ff' : '#0d1424',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{
          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
          maxWidth: 430,
          right: 'calc(50% - 215px + 16px)',
        }}
      >
        <Icon name={isDark ? "Sun" : "Moon"} size={18} />
      </button>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 80,
        }}
      >
        {activeTab === 'scanner' && <ScannerTab isDark={isDark} />}
        {activeTab === 'security' && <SecurityTab isDark={isDark} />}
        {activeTab === 'knowledge' && <KnowledgeTab isDark={isDark} />}
        {activeTab === 'checklist' && <ChecklistTab isDark={isDark} />}
        {activeTab === 'sos' && <SOSTab isDark={isDark} />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} isDark={isDark} />
    </div>
  )
}

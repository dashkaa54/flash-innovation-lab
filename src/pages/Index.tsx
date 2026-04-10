import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import ScannerTab from "@/components/tabs/ScannerTab"
import SecurityTab from "@/components/tabs/SecurityTab"
import KnowledgeTab from "@/components/tabs/KnowledgeTab"
import ChecklistTab from "@/components/tabs/ChecklistTab"
import SOSTab from "@/components/tabs/SOSTab"

type Tab = 'scanner' | 'security' | 'knowledge' | 'checklist' | 'sos'

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('scanner')

  return (
    <div
      style={{
        minHeight: '100dvh',
        maxWidth: 430,
        margin: '0 auto',
        background: '#0d1424',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 80,
        }}
      >
        {activeTab === 'scanner' && <ScannerTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'knowledge' && <KnowledgeTab />}
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'sos' && <SOSTab />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

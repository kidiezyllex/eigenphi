import { motion } from 'framer-motion'
import { useState } from 'react'

interface TabItem {
  id: string
  type: string
  value: string
}

const defaultTabs: TabItem[] = [
  { type: 'Home', value: 'home', id: 'home' },
  { type: 'Docs', value: 'docs', id: 'docs' },
]

interface TabProps {
  tab: TabItem
  selected: boolean
  setSelected: (value: string) => void
}

const Tab = ({ tab, selected, setSelected }: TabProps) => {
  return (
    <button
      onClick={() => setSelected(tab.value)}
      className={` relative rounded-md px-3 py-1 text-sm text-mainGrayV1 font-medium transition-colors`}
    >
      <div className="flex flex-col items-center rounded-sm justify-start">
        <span className="relative z-10 text-sm font-medium">{tab.type}</span>
        <span className="relative z-10 text-base font-bold opacity-70 text-mainActiveV1">{tab.value}</span>
      </div>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: 'spring', duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-md bg-mainActiveV1/10"
        ></motion.span>
      )}
    </button>
  )
}

interface CustomTabsProps {
  tabs?: TabItem[]
  defaultSelected?: string
  onChange?: (value: string) => void
}

const CustomTabs = ({ tabs = defaultTabs, defaultSelected, onChange }: CustomTabsProps) => {
  const [selected, setSelected] = useState<string>(defaultSelected || tabs[0]?.value || '')
  
  const handleSelect = (value: string) => {
    setSelected(value)
    if (onChange) {
      onChange(value)
    }
  }
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Tab
          tab={tab}
          selected={selected === tab.value}
          setSelected={handleSelect}
          key={tab.id}
        />
      ))}
    </div>
  )
}

export default CustomTabs
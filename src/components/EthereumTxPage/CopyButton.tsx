import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string
  copied: boolean
  onCopy: (text: string) => void
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, copied, onCopy }) => {
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6 bg-transparent hover:bg-mainCardV1" onClick={() => onCopy(text)}>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3 w-3 text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3 w-3 text-mainGrayV1 hover:text-mainActiveV1 " />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

export default CopyButton 
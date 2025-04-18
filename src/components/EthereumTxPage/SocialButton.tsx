import React from 'react'

interface SocialButtonProps {
  icon: string
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
  const getIconColor = () => {
    switch (icon) {
      case "twitter":
        return "#00aced"
      case "telegram":
        return "#37aee2"
      case "reddit":
        return "#ff4500"
      default:
        return "#000000"
    }
  }

  return (
    <button className="p-1 rounded-full hover:bg-accent/50" aria-label={icon}>
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: getIconColor() }}
      >
        <i className={`iconfont icon-${icon}`} style={{ fontSize: "10px", color: "white" }} />
      </div>
    </button>
  )
}

export default SocialButton 
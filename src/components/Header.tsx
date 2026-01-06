import './Header.css'

interface HeaderProps {
  title: string
  onMailPress?: () => void
  onCalendarPress?: () => void
}

const Header = ({ title, onMailPress, onCalendarPress }: HeaderProps) => {
  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="header-icon" onClick={onMailPress} aria-label="Mail">
          ✉️
        </button>
        <button className="header-icon" onClick={onCalendarPress} aria-label="Calendar">
          📅
        </button>
      </div>
    </div>
  )
}

export default Header


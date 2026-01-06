import './DailyContent.css'

interface DailyCard {
  day: string
  emoji?: string
  isAdd?: boolean
}

const dailyCards: DailyCard[] = [
  { day: 'Mon', emoji: '📋' },
  { day: 'Tue', emoji: '✏️' },
  { day: 'Wed', emoji: '🎨' },
  { day: '', isAdd: true },
]

const DailyContent = () => {
  return (
    <div className="daily-section">
      <div className="daily-scroll">
        {dailyCards.map((card, index) => (
          <div key={index} className="daily-card">
            {card.isAdd ? (
              <div className="daily-card-placeholder">
                <span className="plus-sign">+</span>
              </div>
            ) : (
              <div className="daily-card-image">{card.emoji}</div>
            )}
            <div className="daily-card-label">
              <span className="daily-card-text">{card.day}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyContent


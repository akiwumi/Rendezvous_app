import './ColorPalette.css'

interface ColorSwatch {
  name: string
  hex: string
  cssVar: string
  textColor?: string
}

const colors: ColorSwatch[] = [
  { name: 'Gold', hex: '#D4AF37', cssVar: 'var(--color-gold)' },
  { name: 'Olive', hex: '#556B2F', cssVar: 'var(--color-olive)' },
  { name: 'Interactive Blue', hex: '#007AFF', cssVar: 'var(--interactive-blue)' },
  { name: 'Notification Red', hex: '#FF3B30', cssVar: 'var(--interactive-red)' },
  { name: 'Gold Light', hex: '#E5C158', cssVar: 'var(--color-gold-light)' },
  { name: 'Olive Light', hex: '#6B8E3A', cssVar: 'var(--color-olive-light)' },
]

const ColorPalette = () => {
  return (
    <div className="color-palette">
      <h2 className="section-title">Color Palette</h2>
      <div className="color-grid">
        {colors.map((color, index) => (
          <div key={index} className="color-swatch">
            <div 
              className="color-swatch-color" 
              style={{ 
                backgroundColor: color.cssVar,
                color: color.textColor || 'var(--text-inverse)'
              }}
            >
              {color.name}
            </div>
            <div className="color-swatch-info">
              <div className="color-swatch-name">{color.name}</div>
              <div className="color-swatch-hex">{color.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColorPalette


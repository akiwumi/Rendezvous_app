import './TypographyShowcase.css'

const TypographyShowcase = () => {
  return (
    <div className="typography-section">
      <h2 className="section-title">Typography</h2>
      
      <div className="typography-sample">
        <div className="typography-label">Heading 1</div>
        <h1 className="text-h1">Rendezvous Social Club</h1>
      </div>
      
      <div className="typography-sample">
        <div className="typography-label">Heading 2</div>
        <h2 className="text-h2">Week 29</h2>
      </div>
      
      <div className="typography-sample">
        <div className="typography-label">Heading 3</div>
        <h3 className="text-h3">Daily Content</h3>
      </div>
      
      <div className="typography-sample">
        <div className="typography-label">Body Text</div>
        <p className="text-body">
          This is body text used for regular content throughout the app. 
          It provides good readability and maintains consistency.
        </p>
      </div>
      
      <div className="typography-sample">
        <div className="typography-label">Caption</div>
        <p className="text-caption">
          This is caption text for metadata, timestamps, and secondary information.
        </p>
      </div>
    </div>
  )
}

export default TypographyShowcase


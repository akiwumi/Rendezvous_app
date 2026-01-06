import './AppHeader.css';

const AppHeader = () => {
  return (
    <header className="app-header">
      <img 
        src="/penilla-logo-3.png" 
        alt="Rendezvous Logo" 
        className="app-logo"
        onError={(e) => {
          // Fallback if image doesn't exist
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'logo-fallback';
          fallback.textContent = 'Rendezvous';
          target.parentElement?.appendChild(fallback);
        }}
      />
    </header>
  );
};

export default AppHeader;


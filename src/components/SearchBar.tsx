import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './SearchBar.css';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  date?: string;
  location?: string;
  time?: string;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const { isSearchOpen, closeSearch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    date: '',
    location: '',
    time: '',
  });

  useEffect(() => {
    if (isSearchOpen) {
      // Lock body scroll
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Reset advanced search when modal closes
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        setShowAdvanced(false);
      };
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, filters);
    }
    // In a real app, this would trigger search functionality
    console.log('Search:', searchQuery, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ date: '', location: '', time: '' });
    setSearchQuery('');
  };

  if (!isSearchOpen) return null;

  return (
    <>
      <div className="search-overlay" onClick={closeSearch}></div>
      <div className="search-bar-container">
        <div className="search-header">
          <h2>Search</h2>
          <button
            type="button"
            className="search-close-btn"
            onClick={closeSearch}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>
        <form className="search-bar-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search events, posts, members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="search-submit-btn" title="Search">
            🔍
          </button>
        </form>

        <button
          type="button"
          className={`advanced-search-btn ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼' : '▶'} Advanced Search
        </button>

        {showAdvanced && (
          <div className="search-filters">
            <div className="filter-group">
              <label className="filter-label">Date</label>
              <input
                type="date"
                className="filter-input"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Time</label>
              <input
                type="time"
                className="filter-input"
                value={filters.time}
                onChange={(e) => handleFilterChange('time', e.target.value)}
              />
            </div>
            <button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;


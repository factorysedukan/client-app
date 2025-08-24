import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import './SearchBarStyles.css';

const SearchBar = ({ data = [], onSelect }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter suggestions based on query
  const suggestions = query
    ? data.filter(item =>
        (item.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (item.nameHindi || '').toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const goToSearch = () => {
    if (!location.pathname.includes('/search')) {
      navigate('/search');
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    goToSearch();
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    goToSearch();
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    if (onSelect) onSelect(item);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="searchbar-container">
      <TextField
        inputRef={inputRef}
        className="searchbar-input"
        size="small"
        fullWidth
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: '#e4572e' }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <CloseIcon fontSize="small" style={{ color: '#e4572e' }} />
              </IconButton>
            </InputAdornment>
          ),
          style: { borderRadius: 18, background: '#fff' }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '18px',
            background: '#fff',
            fontWeight: 500,
            fontSize: '0.87em',
            paddingRight: 0,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e4572e',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e4572e',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e4572e',
            boxShadow: '0 4px 16px rgba(228,87,46,0.13)',
          },
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <Paper className="searchbar-suggestions" elevation={3}>
          {suggestions.map((item, idx) => (
            <div
              key={item._id || idx}
              className="searchbar-suggestion"
              onClick={() => handleSelect(item)}
            >
              {item.name}
              {item.nameHindi ? <span className="searchbar-suggestion-hindi"> ({item.nameHindi})</span> : null}
            </div>
          ))}
        </Paper>
      )}
    </div>
  );
};

export default SearchBar;

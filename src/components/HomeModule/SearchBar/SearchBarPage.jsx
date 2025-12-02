import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Box, Paper, Typography, IconButton, InputAdornment, TextField } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchProductV2Mutation } from '../../../redux/Apis/ProductApi';
import { useNavigate } from 'react-router-dom';
import './SearchBarPage.css';
import ProductListing1 from '../ProductListing/ProductListing1';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation, Trans } from 'react-i18next';

const RECENT_KEY = 'recentSearches_v1';

function useDebouncedCallback(callback, delay) {

  const timeoutRef = useRef();
  const debounced = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
  return debounced;
}

const SearchBarPage = () => {
  const { t } = useTranslation();

  const [query, setQuery] = useState(() => sessionStorage.getItem('searchQuery') || '');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchProductV2, { isLoading }] = useSearchProductV2Mutation();
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  const listRef = useRef();

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback(async (q, pageNum = 1) => {
    if (q && q.trim().length > 0) {
      const res = await searchProductV2({ q, page: pageNum, limit: 20 });
      if (pageNum === 1) {
        setResults(res.data?.data || []);
      } else {
        setResults(prev => [...prev, ...(res.data?.data || [])]);
      }
      setHasMore((res.data?.data?.length || 0) === 20);
      setLoadingMore(false);
    } else {
      setResults([]);
      setHasMore(false);
      setLoadingMore(false);
    }
  }, 400);

  // Handle search input and fetch results
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    sessionStorage.setItem('searchQuery', val); // Save to sessionStorage
    setShowSuggestions(true);
    setPage(1);
    debouncedSearch(val, 1);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setQuery('');
    sessionStorage.removeItem('searchQuery'); // Remove from sessionStorage
    setShowSuggestions(false);
    setResults([]);
    setPage(1);
    setHasMore(false);
    inputRef.current?.focus();
  };

  const saveRecent = (item) => {
    if (!item || !item.name) return;
    try {
      const minimal = { _id: item._id, name: item.name, nameHindi: item.nameHindi || '' };
      setRecentSearches(prev => {
        const filtered = prev.filter(r => (r._id && r._id === minimal._id) || (r.name === minimal.name) ? false : true);
        const next = [minimal, ...filtered].slice(0, 6);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      // ignore
    }
  };

  const handleSelect = (item) => {
    saveRecent(item);
    setQuery(item.name);
    sessionStorage.setItem('searchQuery', item.name); // Save selected value to sessionStorage
    setShowSuggestions(false);
    setResults([item]);
    inputRef.current?.blur();
  };

  const handleChipClick = (item) => {
    if (!item) return;
    saveRecent(item); // move to front
    setQuery(item.name);
    setPage(1);
    setShowSuggestions(false);
    // trigger immediate search (not waiting for debounce)
    (async () => {
      try {
        const res = await searchProductV2({ q: item.name, page: 1, limit: 20 });
        setResults(res.data?.data || []);
        setHasMore((res.data?.data?.length || 0) === 20);
      } catch (err) {
        setResults([]);
      }
    })();
  };

  // Blur input on Enter key and close suggestions/results
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      setShowSuggestions(false);
    }
  };

  // Infinite scroll handler for results
  const handleScroll = useCallback(() => {
    if (!hasMore || loadingMore || isLoading || !listRef.current) return;
    if (
      listRef.current.scrollTop + listRef.current.clientHeight >= listRef.current.scrollHeight - 200
    ) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [hasMore, loadingMore, isLoading]);

  // Attach scroll event to results container
  useEffect(() => {
    const currentRef = listRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Fetch more results when page changes (but not on first load)
  useEffect(() => {
    if (page > 1 && query.trim()) {
      debouncedSearch(query, page);
    }
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (sessionStorage.getItem('searchQuery')) {
      debouncedSearch(sessionStorage.getItem('searchQuery'), 1);
    }
  }, [])

  // Suggestions for dropdown
  const suggestions = query
    ? results.filter(item =>
      (item.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.nameHindi || '').toLowerCase().includes(query.toLowerCase())
    )
    : [];

  // Blur on click outside or scroll
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !document.querySelector('.searchbarpage-suggestions')?.contains(event.target)
      ) {
        inputRef.current.blur();
        setShowSuggestions(false);
      }
    }
    function handleWindowScroll() {
      inputRef.current?.blur();
      setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleWindowScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleWindowScroll, true);
    };
  }, []);

  return (
    // <div className="searchbarpage-root">
    <>
      <AppBar position="sticky" color="inherit" elevation={1} className="searchbarpage-appbar">
        <Toolbar className="searchbarpage-toolbar">
          <IconButton onClick={() => navigate(-1)} className="searchbarpage-back-btn">
            <ArrowBackIosNewIcon fontSize="small" sx={{ color: '#e4572e' }} />
          </IconButton>

          <Box className="searchbarpage-searchbar-wrap" >
            <TextField
              inputRef={inputRef}
              className="searchbarpage-input"
              size="small"
              fullWidth
              placeholder={t('SEARCH_PRODUCTS_PLACEHOLDER')}
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
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
                '& input': {
                  fontSize: '16px', // 👈 ensures input text is 16px+
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '18px',
                  background: '#fff',
                  fontWeight: 500,
                  fontSize: '0.97em',
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
              autoFocus
            />
            {showSuggestions && suggestions.length > 0 && (
              <Paper className="searchbarpage-suggestions" elevation={3}>
                {suggestions.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="searchbarpage-suggestion"
                    onMouseDown={() => {
                      handleSelect(item);
                      setShowSuggestions(false);
                    }}
                  >
                    {item.name}
                    {item.nameHindi ? <span className="searchbarpage-suggestion-hindi"> ({item.nameHindi})</span> : null}
                  </div>
                ))}
              </Paper>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* recent chips - shows up to 6 */}
      {recentSearches && recentSearches.length > 0 && (
        <Box className="searchbarpage-recent-chips-wrap" sx={{ px: 2, mt: 1 }}>
          <div className="searchbarpage-recent-chips">
            {recentSearches.map((r, i) => (
              <button
                key={r._id || `${r.name}-${i}`}
                className="searchbarpage-recent-chip"
                onClick={() => handleChipClick(r)}
                title={r.name}
              >
                {r.name}
              </button>
            ))}
          </div>
        </Box>
      )}

      <div
        ref={listRef}
        style={{
          height: '100%',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative'
        }}
        elevation={0}
        className="searchbarpage-results"
      >
        <ProductListing1 loading={isLoading && page === 1} data={results} />
        {loadingMore && page > 1 && (
          <div className="product-listing-grid">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="product-card">
                <Skeleton variant="rectangular" width="100%" height={120} className="product-image" style={{ borderRadius: 12 }} />
                <div className="product-details">
                  <Skeleton variant="text" width="70%" height={24} className="product-title" style={{ margin: '8px 0 0 0' }} />
                  <Skeleton variant="text" width="90%" height={18} className="product-desc-home" style={{ margin: '6px 0 0 0' }} />
                  <Skeleton variant="text" width="40%" height={16} className="product-size" style={{ margin: '8px 0 0 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, justifyContent: 'space-between', width: '100%' }}>
                    <Skeleton variant="text" width={60} height={20} />
                    <Skeleton variant="rectangular" width={60} height={28} style={{ borderRadius: 6 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && results.length === 0 && query && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            {t('NO_RESULTS_FOUND')}
          </Typography>
        )}
        {!isLoading && results.length === 0 && !query && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            {t('OTHER_PRODUCTS')}
          </Typography>
        )}
      </div>
    </>
  );
};

export default SearchBarPage;

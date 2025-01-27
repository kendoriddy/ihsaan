import { useState } from 'react';
import { TextField, IconButton, Grow } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

const SearchComponent = ({ onChange, name, searchTerm, placeholder }) => {
  const [isSearchOpen, setSearchOpen] = useState(true);

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (onChange) {
      onChange(value); 
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {isSearchOpen ? (
        <Grow style={{ transformOrigin: '0 0 0' }} timeout={1000} in={isSearchOpen} mountOnEnter unmountOnExit>
          <TextField
            sx={{ '& .MuiInputBase-root': { borderRadius: '0.5rem', padding:'0.5rem' } }}
            variant="outlined"
            placeholder={placeholder ? placeholder : 'Search...'}
            size="small"
            name={name ?? ''}
            color="primary"
            fullWidth
            InputProps={{
              startAdornment: (
                <IconButton onClick={toggleSearch} edge="start">
                  <SearchOutlined />
                </IconButton>
              ),
            }}
            onChange={onChange ? onChange : handleInputChange}
            value={searchTerm || ''}
          />
        </Grow>
      ) : (
        <IconButton onClick={toggleSearch}>
          <SearchOutlined />
        </IconButton>
      )}
    </div>
  );
};

export default SearchComponent;

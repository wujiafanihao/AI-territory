import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDataFetching } from '../hooks/useDataFetching';
import '../style/HackNew.css'; 

const HackNew = () => {
  const [fade, setFade] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const itemsPerPage = 30;

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;

  const { data, loading, error } = useDataFetching(`${import.meta.env.VITE_API_BASE_URL}/v1/api/hacker`);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const filteredItems = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, currentPage]);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredItems.length) {
      setFade(true);
      setTimeout(() => navigate(`/hack-new?page=${currentPage + 1}`), 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => navigate(`/hack-new?page=${currentPage - 1}`), 500);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    navigate('/hack-new?page=1');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="hacknew-container">
      <div className={`hacknew-search-bar ${showSearch ? 'show' : ''}`}>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        <button>Search</button>
      </div>
      <div className="hacknew-content">
        <div className="hacknew-left-column"></div>
        <div className={`hacknew-middle-column ${fade ? 'fade-out' : 'fade-in'}`}>
          {currentItems.map((item, index) => (
            <div key={item.id} className="hacknew-title-frame">
              <span>{(currentPage - 1) * itemsPerPage + index + 1}. </span>
              <a href={item.url} target='_blank' rel='noopener noreferrer'>{item.title}</a>
            </div>
          ))}
          <div className="hacknew-pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
            <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= filteredItems.length}>Next</button>
          </div>
        </div>
        <div className="hacknew-right-column"></div>
      </div>
      <div className={`hacknew-search-toggle ${showSearch ? 'active' : ''}`} onClick={toggleSearch}>
        🔍
      </div>
    </div>
  );
};

export default HackNew;
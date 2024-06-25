// Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDataFetching } from '../hooks/useDataFetching';
import '../style/Home.css'; 

const Home = () => {
  const [fade, setFade] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;

  const { data, loading, error } = useDataFetching(`${import.meta.env.VITE_API_BASE_URL}/v1/api/new`);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const filteredItems = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) 
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
      setTimeout(() => navigate(`/?page=${currentPage + 1}`), 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => navigate(`/?page=${currentPage - 1}`), 500);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    navigate('/?page=1');
  };

  const formatDate = (dateString) => dateString.split('T')[0];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-container">
      <div className="home-left-column"></div>
      <div className={`home-middle-column ${fade ? 'fade-out' : 'fade-in'}`}>
        {currentItems.map(item => (
          <div key={item.id} className="home-content-frame">
            <h2><a href={item.url} target='_blank' rel="noopener noreferrer">{item.title}</a></h2>
            <a href={item.url} target='_blank' rel="noopener noreferrer"><img src={item.image} alt={item.title} /></a>
            <p className="summary" title={item.summary}>{item.summary}</p>
            <p className="date">{formatDate(item.lastEditedDate)}</p>
          </div>
        ))}
        <div className="home-pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= filteredItems.length}>Next</button>
        </div>
      </div>
      <div className="home-right-column">
        <div className="home-search-bar">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
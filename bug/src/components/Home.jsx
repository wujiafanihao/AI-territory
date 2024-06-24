import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/Home.css'; 

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false); 
  const itemsPerPage = 6; 

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.6:1551/v1/api/new?api_key=Wjf251605@');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => {
      setFade(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (indexOfLastItem < data.length) {
      setFade(true);
      setTimeout(() => {
        navigate(`/?page=${currentPage + 1}`);
      }, 500); 
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => {
        navigate(`/?page=${currentPage - 1}`);
      }, 500); 
    }
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-left-column"></div>
      <div className={`home-middle-column ${fade ? 'fade-out' : 'fade-in'}`}>
        {currentItems.map(item => (
          <div key={item.id} className="home-content-frame">
            <h2><a href={item.url} target='_blank'>{item.title}</a></h2>
            <a href={item.url} target='_blank'><img src={item.image} alt={item.title} /></a>
            <p className="summary" title={item.summary}>{item.summary}</p>
            <p className="date">{formatDate(item.lastEditedDate)}</p>
          </div>
        ))}
        <div className="home-pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={indexOfLastItem >= data.length}>Next</button>
        </div>
      </div>
      <div className="home-right-column">
        <div className="home-search-bar">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Home;

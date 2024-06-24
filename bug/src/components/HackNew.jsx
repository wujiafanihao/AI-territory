import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/HackNew.css'; 

const HackNew = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false); 
  const itemsPerPage = 30; 

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:1551/v1/api/hacker?api_key=Wjf251605@');
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
        navigate(`/hack-new?page=${currentPage + 1}`);
      }, 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => {
        navigate(`/hack-new?page=${currentPage - 1}`);
      }, 500); 
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hacknew-container">
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
          <button onClick={handleNextPage} disabled={indexOfLastItem >= data.length}>Next</button>
        </div>
      </div>
      <div className="hacknew-right-column"></div>
    </div>
  );
};

export default HackNew;

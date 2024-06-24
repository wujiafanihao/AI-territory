import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/AI-tools.css'; 

const AITool = () => {
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
        const response = await fetch('http://127.0.0.1:1551/v1/api/tools_info?api_key=Wjf251605@');
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
        navigate(`/ai-tool?page=${currentPage + 1}`);
      }, 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => {
        navigate(`/ai-tool?page=${currentPage - 1}`);
      }, 500); 
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="AItools-container">
      <div className="AItools-left-column"></div>
      <div className={`AItools-middle-column ${fade ? 'fade-out' : 'fade-in'}`}>
        {currentItems.map(item => (
          <div key={item.id} className="AItools-content-frame">
            <h2><a href={item.url} target='_blank' rel='noopener noreferrer'>{item.title}</a></h2>
            <a href={item.url} target='_blank' rel='noopener noreferrer'><img src={item.img} alt={item.title} /></a>
            <p className="introduce" title={item.content}>{item.introduce}</p>
            <p className="tag">{item.tags}</p>
          </div>
        ))}
        <div className="AItools-pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={indexOfLastItem >= data.length}>Next</button>
        </div>
      </div>
      <div className="AItools-right-column">
        <div className="AItools-search-bar">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default AITool;

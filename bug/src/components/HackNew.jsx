import React, { useState, useEffect } from 'react';
import '../style/HackNew.css'; 

const HackNew = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.6:1551/v1/api/hacker?api_key=Wjf251605@');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (indexOfLastItem < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="hacknew-container">
      <div className="hacknew-left-column"></div>
      <div className="hacknew-middle-column">
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

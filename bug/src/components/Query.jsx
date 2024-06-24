import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';
import '../style/Query.css'; 

const Query = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false); 
  const itemsPerPage = 10; 
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:1551/v1/api/conversation?api_key=Wjf251605@');
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
        navigate(`/query?page=${currentPage + 1}`);
      }, 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => {
        navigate(`/query?page=${currentPage - 1}`);
      }, 500); 
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTitleClick = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const filteredItems = currentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className="query-container">
      <div className="query-left-column"></div>
      <div className={`query-middle-column ${fade ? 'fade-out' : 'fade-in'}`}>
        {filteredItems.map((item, index) => (
          <div key={item.id} className="query-frame">
            <span>{(currentPage - 1) * itemsPerPage + index + 1}. </span>
            <a onClick={() => handleTitleClick(item)}>{item.title}</a>
            <p className="query-response" title={item.response}>
              {item.response.length > 100 ? item.response.substring(0, 100) + '...' : item.response}
            </p>
            <p className="query-date">{formatDate(item.date)}</p>
          </div>
        ))}
        <div className="query-pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={indexOfLastItem >= data.length}>Next</button>
        </div>
      </div>
      <div className="query-right-column">
        <div className="query-search-bar">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
          <button>Search</button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Query Detail"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedItem && (
          <div>
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.date}</p>
            <ReactMarkdown className={'content'}>{selectedItem.response}</ReactMarkdown>
            <button onClick={() => setModalIsOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Query;
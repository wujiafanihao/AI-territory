// Query.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';
import { useDataFetching } from '../hooks/useDataFetching';
import '../style/Query.css';

const Query = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;
  const itemsPerPage = 10;

  const { data, loading, error } = useDataFetching(`${import.meta.env.VITE_API_BASE_URL}/v1/api/conversation`);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const filteredItems = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      setTimeout(() => navigate(`/query?page=${currentPage + 1}`), 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => navigate(`/query?page=${currentPage - 1}`), 500);
    }
  };

  const handleTitleClick = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    navigate('/query?page=1');
  };

  const formatDate = (dateString) => dateString.split('T')[0];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="query-container">
      <div className="query-left-column"></div>
      <div className={`query-middle-column ${fade ? 'fade-out' : 'fade-in'}`}>
        {currentItems.map((item, index) => (
          <div key={item.id} className="query-frame">
            <span>{(currentPage - 1) * itemsPerPage + index + 1}. </span>
            <a onClick={() => handleTitleClick(item)}>{item.title}</a>
            <p className="query-response" title={item.response}>
              {item.response.length > 100 ? `${item.response.substring(0, 100)}...` : item.response}
            </p>
            <p className="query-date">{formatDate(item.date)}</p>
          </div>
        ))}
        <div className="query-pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= filteredItems.length}>Next</button>
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
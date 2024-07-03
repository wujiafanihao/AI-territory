import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDataFetching } from '../hooks/useDataFetching';
import '../style/AI-tools.css';

const AITool = () => {
  const [fade, setFade] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;

  const { data, loading, error } = useDataFetching(`${import.meta.env.VITE_API_BASE_URL}/v1/api/tools_info`);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const allTags = useMemo(() => {
    if (!data) return [];
    const tags = new Set();
    data.forEach(item => {
      item.tags.split(',').forEach(tag => {
        if (tag.trim()) {
          tags.add(tag.trim());
        }
      });
    });
    return Array.from(tags);
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const tagMatch = selectedTag ? item.tags.split(',').map(tag => tag.trim()).includes(selectedTag) : true;
      const searchMatch = (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.introduce && item.introduce.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.tags && item.tags.toLowerCase().includes(searchTerm.toLowerCase()));
      return tagMatch && searchMatch;
    });
  }, [data, searchTerm, selectedTag]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, currentPage]);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredItems.length) {
      setFade(true);
      setTimeout(() => navigate(`/ai-tool?page=${currentPage + 1}`), 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFade(true);
      setTimeout(() => navigate(`/ai-tool?page=${currentPage - 1}`), 500);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    navigate('/ai-tool?page=1');
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === '全部' ? null : tag);
    navigate('/ai-tool?page=1');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="AItools-container">
      <div className="AItools-top-row">
        <div className="AItools-left-column">
          <div className="tags-container">
            <button 
              onClick={() => handleTagClick('全部')} 
              className={selectedTag === null ? 'active' : ''}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => handleTagClick(tag)} 
                className={selectedTag === tag ? 'active' : ''}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={`AItools-search-bar ${showSearch ? 'show' : ''}`}>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        <button>Search</button>
      </div>
      <div className={`AItools-content ${fade ? 'fade-out' : 'fade-in'}`}>
        {currentItems.map(item => (
          <div key={item.id} className="AItools-content-frame">
            <h2><a href={item.url} target='_blank' rel='noopener noreferrer'>{item.title}</a></h2>
            <a href={item.url} target='_blank' rel='noopener noreferrer'><img src={item.img} alt={item.title} /></a>
            <p className="introduce" title={item.content}>{item.introduce}</p>
            <p className="tag">{item.tags}</p>
          </div>
        ))}
      </div>
      <div className="AItools-pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= filteredItems.length}>Next</button>
      </div>
      <div className={`AItools-search-toggle ${showSearch ? 'active' : ''}`} onClick={toggleSearch}>
        🔍
      </div>
    </div>
  );
};

export default AITool;

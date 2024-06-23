import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Query.css'; // 引入CSS文件

const Query = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 每页显示的项目数
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.6:1551/v1/api/conversation?api_key=Wjf251605@');
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

  // 计算当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // 处理下一页按钮点击事件
  const handleNextPage = () => {
    if (indexOfLastItem < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 处理上一页按钮点击事件
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTitleClick = (item) => {
    navigate(`/query-detail/${item.id}`, { state: { item } });
  };

  const filteredItems = currentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 格式化日期
  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className="query-container">
      <div className="query-left-column"></div>
      <div className="query-middle-column">
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
    </div>
  );
};

export default Query;

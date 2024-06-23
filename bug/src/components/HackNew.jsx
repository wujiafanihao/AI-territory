import React, { useState, useEffect } from 'react';
import '../style/HackNew.css'; // 引入CSS文件

const HackNew = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // 每页显示的项目数

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

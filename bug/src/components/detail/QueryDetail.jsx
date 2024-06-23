import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../../style/QueryDetail.css'; 

const QueryDetail = () => {
  const location = useLocation();
  const { item } = location.state;

  return (
    <div className="query-detail-container">
      <h1>{item.title}</h1>
      <div className="query-detail-response">
        <ReactMarkdown>{item.response}</ReactMarkdown>
      </div>
      <p className="query-detail-date">{item.date.split('T')[0]}</p>
    </div>
  );
};

export default QueryDetail;

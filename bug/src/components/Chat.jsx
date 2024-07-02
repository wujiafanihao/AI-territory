import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../style/Chat.css';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const copyToClipboard = () => {
    console.log('Copy button clicked'); // 添加这行
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(children[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Fallback to document.execCommand('copy')
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNode(codeRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          alert('Failed to copy text.');
        } finally {
          window.getSelection().removeAllRanges();
        }
      }
    }
  };

  return !inline && match ? (
    <div className="code-block-wrapper">
      <button className="copy-button" onClick={copyToClipboard}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter
        ref={codeRef}
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustInputHeight();
  };

  const adjustInputHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 90)}px`;
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = { text: inputValue, isUser: true };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: inputValue }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiMessage = { text: '', isUser: false };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          aiMessage.text += chunk;
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = aiMessage;
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error occurred while fetching the response.', isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="chat-outer-container">
      <div className="chat-container">
        <div className="chat-content">
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                <div className="message-bubble">
                  {message.isUser ? (
                    message.text
                  ) : (
                    <ReactMarkdown
                      components={{
                        code: CodeBlock
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-bubble">Thinking...</div>
              </div>
            )}
          </div>
          <div className="input-area">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              className="message-input"
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} className="send-button" disabled={isLoading}>
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
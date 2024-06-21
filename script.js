const API_KEY = "Wjf251605@";

document.addEventListener('DOMContentLoaded', () => {
  loadhackerNews();
  loadKnowledge();
  loadContent();

  document.getElementById('loadMoreNews').addEventListener('click', () => {
    loadhackerNews();
  });

  document.getElementById('loadMoreKnowledge').addEventListener('click', () => {
    loadKnowledge();
  });

  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadContent();
    }
  });
});

function loadhackerNews() {
  fetch(`http://127.0.0.1:1551/v1/api/hacker?api_key=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const newsItems = document.getElementById('newsItems');
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.title;
        newsItems.appendChild(div);
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function loadKnowledge() {
  fetch(`http://127.0.0.1:1551/v1/api/conversation?api_key=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const knowledgeItems = document.getElementById('knowledgeItems');
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.title;
        knowledgeItems.appendChild(div);
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function loadContent() {
  fetch(`http://127.0.0.1:1551/v1/api/new?api_key=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const contentItems = document.getElementById('contentItems');
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="image"><img src="${item.image}" alt="${item.title}"></div>
          <a href="${item.url}" class="title">${item.title}</a>
          <div class="description" title="${item.summary}">${item.summary}</div>
          <div class="time">${item.lastEditedDate}</div>
        `;
        contentItems.appendChild(card);
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function navigateTo(page) {
  alert(`Navigating to ${page}`);
  // Here you can add your logic to navigate to different pages.
}

let newsPage = 1;
let knowledgePage = 1;

document.addEventListener('DOMContentLoaded', () => {
  loadNews();
  loadKnowledge();
  loadContent();

  document.getElementById('loadMoreNews').addEventListener('click', () => {
    newsPage++;
    loadNews();
  });

  document.getElementById('loadMoreKnowledge').addEventListener('click', () => {
    knowledgePage++;
    loadKnowledge();
  });

  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadContent();
    }
  });
});

function loadNews() {
  fetch(`https://api.example.com/news?page=${newsPage}`)
    .then(response => response.json())
    .then(data => {
      const newsItems = document.getElementById('newsItems');
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.title;
        newsItems.appendChild(div);
      });
    });
}

function loadKnowledge() {
  fetch(`http://127.0.0.1:8000/v1/api/conversation`)
    .then(response => response.json())
    .then(data => {
      const knowledgeItems = document.getElementById('knowledgeItems');
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.title;
        knowledgeItems.appendChild(div);
      });
    });
}

function loadContent() {
  const date = '20240417'; // 可以根据需要动态生成
  fetch(`http://127.0.0.1:8000/v1/api/new?date=${date}`)
    .then(response => response.json())
    .then(data => {
      const contentItems = document.getElementById('contentItems');
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="image"><img src="${item.image}" alt="${item.title}"></div>
          <div class="title">${item.title}</div>
          <div class="description">${item.summary}</div>
          <div class="time">${item.lastEditedDate}</div>
        `;
        contentItems.appendChild(card);
      });
    });
}

// function loadContent() {
//     fetch('http://127.0.0.1:8000/v1/api/new')
//       .then(response => response.json())
//       .then(data => {
//         const contentItems = document.getElementById('contentItems');
//         data.forEach(item => {
//           const card = document.createElement('div');
//           card.className = 'card';
//           card.innerHTML = `
//             <div class="image"><img src="${item.image}" alt="${item.title}"></div>
//             <a href="${item.url}" class="title">${item.title}</a>
//             <div class="description">${item.summary}</div>
//             <div class="time">${item.lastEditedDate}</div>
//           `;
//           contentItems.appendChild(card);
//         });
//       });
//   }

function navigateTo(page) {
  alert(`Navigating to ${page}`);
  // Here you can add your logic to navigate to different pages.
}

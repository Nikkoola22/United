import React, { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  content: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/news")
      .then((res) => res.json())
      .then(setNews);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📰 Dernières actualités</h1>
      {news.length === 0 && <p>Aucune actualité pour le moment.</p>}
      <ul>
        {news.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;

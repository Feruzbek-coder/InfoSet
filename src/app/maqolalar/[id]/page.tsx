"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HomeHeader from "../../components/HomeHeader";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

interface Comment {
  id: number;
  articleId: number;
  parentId?: number;
  author: string;
  text: string;
  date: string;
}

interface Like {
  articleId: number;
  date: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = Number(params.id);
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((a: Article) => a.id === articleId);
        setArticle(found || null);
      });
    fetch(`/api/comments?articleId=${articleId}`)
      .then((res) => res.json())
      .then(setComments);
    fetch(`/api/likes?articleId=${articleId}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes(data);
        // LocalStorage orqali user bir marta like bosganini tekshirish
        setLiked(!!window.localStorage.getItem(`liked_${articleId}`));
      });
  }, [articleId]);
  const handleLike = async () => {
    if (liked) return;
    setLikeLoading(true);
    await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    });
    setLiked(true);
    window.localStorage.setItem(`liked_${articleId}`, '1');
    // Refresh likes
    fetch(`/api/likes?articleId=${articleId}`)
      .then((res) => res.json())
      .then(setLikes);
    setLikeLoading(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !author.trim()) return;
    setLoading(true);
    const newComment: Comment = {
      id: Date.now(),
      articleId,
      parentId: replyTo || undefined,
      author,
      text: commentText,
      date: new Date().toISOString(),
    };
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });
    setCommentText("");
    setReplyTo(null);
    setLoading(false);
    // Refresh comments
    fetch(`/api/comments?articleId=${articleId}`)
      .then((res) => res.json())
      .then(setComments);
  };

  function renderComments(parentId: number | null = null, level = 0) {
    return comments
      .filter((c) => (parentId ? c.parentId === parentId : !c.parentId))
      .map((c) => (
        <div key={c.id} className={`mb-4 ml-${level * 6}`}>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-blue-700 text-base">{c.author}</span>
              <span className="text-sm text-gray-600 font-medium">{new Date(c.date).toLocaleString()}</span>
            </div>
            <div className="text-gray-900 mb-3 text-base leading-relaxed">{c.text}</div>
            <button
              className="text-sm text-blue-600 hover:underline font-semibold"
              onClick={() => setReplyTo(c.id)}
            >
              Javob berish
            </button>
          </div>
          {renderComments(c.id, level + 1)}
        </div>
      ));
  }

  if (!article) {
    return <div className="p-8 text-center">Maqola topilmadi.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{article.title}</h1>
      <div className="text-gray-700 mb-6 text-base font-medium flex flex-wrap items-center gap-4">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">{article.category}</span>
        <span>{article.date}</span>
        <span>Muallif: {article.author}</span>
        <button
          onClick={handleLike}
          disabled={liked || likeLoading}
          className={`flex items-center gap-1 px-3 py-1 rounded-full border ${liked ? 'bg-pink-100 border-pink-300 text-pink-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-pink-50 hover:text-pink-600'} transition font-medium`}
        >
          <svg className={`w-5 h-5 ${liked ? 'fill-pink-500' : 'fill-none'} stroke-pink-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.04 3 12.5 3.99 13.07 5.36C13.64 3.99 15.1 3 16.64 3C19.72 3 22.14 5.42 22.14 8.5C22.14 13.5 12 21 12 21Z"/></svg>
          <span className="font-semibold">{likes.length}</span>
          <span className="text-sm">Like</span>
        </button>
      </div>
      <div className="prose prose-lg mb-8 text-gray-900 leading-relaxed text-lg whitespace-pre-wrap">
        {article.content.split(/!\[([^\]]*)\]\(([^)]+)\)/).map((part, index) => {
          // Har 3-chi element rasm URL
          if (index % 3 === 2) {
            const altText = article.content.split(/!\[([^\]]*)\]\(([^)]+)\)/)[index - 1];
            return (
              <img
                key={index}
                src={part}
                alt={altText || 'Article image'}
                className="w-full rounded-lg shadow-md my-4"
              />
            );
          }
          // Har 3-chi element alt text (skip qilamiz)
          if (index % 3 === 1) {
            return null;
          }
          // Oddiy matn
          return <span key={index}>{part}</span>;
        })}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Izohlar</h2>
        <form onSubmit={handleComment} className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-3">
          {replyTo && (
            <div className="text-sm text-gray-700 mb-1 font-medium">
              Javob berilmoqda: #{replyTo} <button type="button" className="ml-2 text-red-600 font-semibold hover:underline" onClick={() => setReplyTo(null)}>Bekor qilish</button>
            </div>
          )}
          <input
            type="text"
            placeholder="Ismingiz"
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <textarea
            placeholder="Izoh yozing..."
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={3}
          />
          <button
            type="submit"
            className="self-end bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold text-base"
            disabled={loading}
          >
            {loading ? "Yuborilmoqda..." : replyTo ? "Javob berish" : "Izoh qoldirish"}
          </button>
        </form>
        <div>{renderComments()}</div>
        {comments.length === 0 && <div className="text-gray-600 text-base font-medium">Hozircha izohlar yo'q.</div>}
      </section>
      </div>
    </div>
  );
}

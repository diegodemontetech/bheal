import React from 'react';
import { useNewsStore } from '../store/newsStore';
import { formatDate } from '../utils/formatters';

export default function NewsSection() {
  const { latestNews } = useNewsStore();
  const firstNews = latestNews[0];

  if (!firstNews) return null;

  return (
    <article className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-10">
        <img
          src={firstNews.imageUrl}
          alt={firstNews.title}
          className="rounded-t-lg object-cover w-full h-64"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-medium text-gray-900 group-hover:text-indigo-600 transition-colors font-poppins">
          {firstNews.title}
        </h3>
        <p className="text-sm text-gray-500 font-poppins">
          {firstNews.excerpt}
        </p>
        <div className="flex items-center text-sm text-gray-500 font-poppins pt-4 border-t border-gray-100">
          <span className="font-medium text-gray-900">{firstNews.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={firstNews.publishedAt}>{formatDate(firstNews.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
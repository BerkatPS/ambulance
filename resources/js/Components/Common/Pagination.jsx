import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links, className = '' }) {
  // Return null if no pagination links (only 1 page)
  if (links.length <= 3) {
    return null;
  }

  return (
    <div className={`flex flex-wrap justify-center mt-6 gap-1 ${className}`}>
      {links.map((link, key) => {
        // Don't render "prev" text or "next" text links
        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
          return (
            <Link
              key={key}
              href={link.url || '#'}
              className={`px-3 py-2 rounded-md text-sm flex items-center transition-colors ${
                link.url 
                  ? 'text-medical-gray-600 hover:text-primary-600 hover:bg-primary-50' 
                  : 'text-medical-gray-400 cursor-default'
              }`}
              preserveScroll
              preserveState
            >
              {link.label === '&laquo; Previous' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Previous</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </Link>
          );
        }

        // Render page number links
        return (
          <Link
            key={key}
            href={link.url || '#'}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              link.active
                ? 'bg-primary text-white font-medium shadow-button'
                : link.url
                ? 'text-medical-gray-600 hover:bg-primary-50 hover:text-primary-600'
                : 'text-medical-gray-400 cursor-default'
            }`}
            preserveScroll
            preserveState
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        );
      })}
    </div>
  );
}

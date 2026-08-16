import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // convert backend (0-based) → UI (1-based)
  const uiPage = currentPage + 1

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="pagination">

      {/* Prev */}
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        Prev
      </button>

      {/* Pages */}
      {pages.map(page => (
        <button
          key={page}
          className={page === uiPage ? 'active' : ''}
          onClick={() => onPageChange(page - 1)}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>

    </div>
  )
}
// Must match backend Book.BookCondition enum exactly
export const BOOK_CONDITIONS = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE']

// Human-readable labels for display
export const CONDITION_LABELS = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  EXCELLENT: 'Excellent',
  VERY_GOOD: 'Very Good',
  GOOD: 'Good',
  ACCEPTABLE: 'Acceptable'
}

export const SORT_OPTIONS = [
  { value: 'id,desc', label: 'Newest' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' }
]

export const PAGE_SIZE = 6

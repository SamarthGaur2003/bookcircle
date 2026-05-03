import api from '../api/axios'

function normalizeBook(book) {
  if (!book) return null

  return {
    ...book,
    id: String(book.id),
    images: book.imageUrls || [],   // ✅ correct
    seller: book.seller || book.user || null
  }
}

function normalizePage(data) {
  const content = Array.isArray(data?.content)
    ? data.content.map(normalizeBook)
    : []

  return {
    content,
    page: data?.page ?? 0,
    size: data?.size ?? content.length,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? content.length,
    hasNext: Boolean(data?.hasNext),
    hasPrevious: Boolean(data?.hasPrevious)
  }
}

export const bookService = {

  async list(params = {}) {
    const data = await api.get('/book/filter', { params })
    return normalizePage(data)   // ✅ direct
  },

  async getById(id) {
    const data = await api.get(`/book/${id}`)
    return normalizeBook(data)   // ✅ direct
  },

  async create(formData) {
    const data = await api.post('/book/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeBook(data)
  },

  async update(id, formData) {
    const data = await api.put(`/book/update?id=${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeBook(data)
  },

  async myListings() {
    const data = await api.get('/book/mybooks')
    return data.map(normalizeBook)
  },

  async nearby({ lat, lon, radius = 5 }) {
    const data = await api.get('/book/nearby', { params: { lat, lon, radius } })
    return data.map(normalizeBook)
  }
}
import api from '../api/axios'

export const reviewService = {

  /**
   * Get AI-generated review summary for a seller.
   * Returns { averageRating, reviewCount, summary }
   */
  async getSellerSummary(sellerId) {
    return await api.get(`/review/seller/${sellerId}/summary`)
  }
}

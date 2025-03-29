import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getReviews, getReviewStats } from '../../api/review';
import type { Review } from '../../types/review';

const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ total_reviews: number; average_rating: number }>({
    total_reviews: 0,
    average_rating: 0,
  });
  const reviewsPerPage = 5;
  
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  // 현재 페이지의 리뷰만 가져오기
  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // 이름 마스킹 함수
  const maskName = (name: string) => {
    if (name.length <= 2) return name + '***';
    return name.slice(0, 2) + '*'.repeat(name.length - 2);
  };

  // 페이지 변경 시 스크롤 상단으로 이동하는 함수
  const handlePageChange = (pageNumber: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 공개된 리뷰만 가져오기
        const reviewsData = await getReviews({ is_visible: true });
        setReviews(reviewsData.items);
        
        // 리뷰 통계 가져오기
        const statsData = await getReviewStats();
        setStats(statsData);
      } catch (error) {
        console.error('리뷰 데이터 로딩 실패:', error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header isTransparent={false} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6 py-12">
          {/* 타이틀 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left mb-12"
          >
            <h1 className="text-6xl font-bold mb-4">고객 후기</h1>
            <p className="text-gray-600">실제 구매한 이용자들이 남긴 후기에요</p>
          </motion.div>

          {/* 통계 섹션 고급화 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-3xl shadow-2xl p-12 mb-16 overflow-hidden"
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-green-100 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-yellow-100 to-transparent rounded-full blur-2xl" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* 전체 리뷰 섹션 */}
              <div className="text-center md:text-left">
                <span className="inline-block text-green-800 bg-green-50 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  TOTAL REVIEWS
                </span>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div>
                    <h2 className="text-7xl font-bold bg-gradient-to-r from-green-800 to-green-600 text-transparent bg-clip-text">
                      {stats.total_reviews}
                    </h2>
                    <p className="text-gray-500 mt-2">등록된 리뷰</p>
                  </div>
                  <div className="h-16 w-px bg-gray-200 mx-4" />
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-800 font-semibold">98%</span>
                      <span className="text-sm text-gray-600">만족도</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-800 font-semibold">96%</span>
                      <span className="text-sm text-gray-600">재구매율</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 평균 평점 섹션 */}
              <div className="text-center md:text-left">
                <span className="inline-block text-green-800 bg-green-50 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  AVERAGE RATING
                </span>
                <div className="flex items-center justify-center md:justify-start">
                  <div className="mr-6">
                    <h2 className="text-7xl font-bold bg-gradient-to-r from-green-800 to-green-600 text-transparent bg-clip-text">
                      {stats.average_rating.toFixed(1)}
                    </h2>
                    <p className="text-gray-500 mt-2">평균 평점</p>
                  </div>
                  <div className="text-left">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar 
                          key={i}
                          className={i < Math.floor(stats.average_rating) 
                            ? "text-yellow-400" 
                            : "text-gray-200"}
                          size={28}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[5,4,3,2,1].map(rating => (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: rating }).map((_, i) => (
                              <FaStar key={i} className="text-yellow-400" size={12} />
                            ))}
                          </div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ 
                                width: `${(reviews.filter(r => r.rating === rating).length / reviews.length) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {((reviews.filter(r => r.rating === rating).length / reviews.length) * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 리뷰 목록 */}
          <div className="space-y-8">
            {currentReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                {/* 상단 메타 정보 */}
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar 
                        key={i}
                        className={i < review.rating ? "text-yellow-400" : "text-gray-200"}
                        size={20}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">{maskName(review.name)}</span>
                </div>

                {/* 리뷰 내용 */}
                <div className="py-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {review.content}
                  </p>
                </div>

                {/* 하단 정보 */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {review.images && review.images.map((image, i) => (
                        <img 
                          key={i}
                          src={image}
                          alt="결과물 로고"
                          className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">주문 금액</p>
                        <p className="font-medium">{review.order_amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">작업 기간</p>
                        <p className="font-medium">{review.working_days}일</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
              >
                이전
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-green-800 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewsPage; 
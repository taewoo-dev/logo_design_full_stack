import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConsultationModal from '../../components/consultation/ConsultationModal';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./hero-slider.css";
import { FaHandPaper, FaDollarSign, FaTicketAlt, FaInfinity, FaChevronDown } from 'react-icons/fa';
import PortfolioLightbox from '../../components/media/PortfolioLightbox';
import { useNavigate } from 'react-router-dom';
import { Portfolio } from '../../types';
import { getPortfolios } from '../../api/portfolio';
import { getReviews } from '../../api/review';
import type { Review } from '../../types/review';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const HomePage = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [topReviews, setTopReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await getPortfolios(1, 6);  // 첫 페이지, 6개 항목
        if (response && Array.isArray(response.items)) {
          setPortfolios(response.items);
        } else {
          console.error('Invalid response format:', response);
          setPortfolios([]);
        }
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchTopReviews = async () => {
      try {
        const reviews = await getReviews({ 
          sort_by: 'rating',
          sort_order: 'desc',
          is_visible: true,
          size: 5
        });
        setTopReviews(reviews);
      } catch (error) {
        console.error('Failed to fetch top reviews:', error);
      }
    };

    fetchPortfolios();
    fetchTopReviews();
  }, []);

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const heroImages = [
    "/images/hero/hero1.jpg",
    "/images/hero/hero2.jpg",
    "/images/hero/hero3.jpg",
    "/images/hero/hero4.jpg",
    "/images/hero/hero5.jpg",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isTransparent={true} />
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <section className="relative w-full overflow-hidden">
          <Slider {...sliderSettings} className="hero-slider">
            {heroImages.map((image, index) => (
              <div key={index} className="relative h-screen w-full">
                <img
                  src={image}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-6">
                      브랜드의 가치를 높이는 로고
                    </h1>
                    <p className="text-xl mb-8">
                      전문 디자이너가 만드는 고품격 로고 디자인
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* 2. 동기부여 - 이벤트 섹션 */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-6 relative">
            <motion.div 
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-3xl p-12 shadow-2xl text-center relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-5xl font-extrabold mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                리뷰 100개 이벤트
              </motion.h2>
              <motion.p 
                className="text-3xl mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                선착순 30명
              </motion.p>
              <motion.div 
                className="bg-black text-white py-6 px-8 rounded-full mb-8 border-4 border-red-600"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="text-2xl font-bold">모든 유형 로고</p>
                <p className="text-4xl font-extrabold">
                  <span className="line-through">69,000원</span> → 39,000원
                </p>
              </motion.div>
              <motion.p 
                className="text-4xl font-bold text-red-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                남들보다 저렴하게 구매하세요
              </motion.p>
              <motion.div 
                className="bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold absolute -bottom-5 -right-5"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                40%
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. 권위부여 - 수상이력 섹션 */}
        <section className="min-h-screen bg-gray-800 text-white flex items-center">
          <div className="container mx-auto px-6">
            <motion.h1 
              className="text-6xl font-bold mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              수치로 증명합니다
            </motion.h1>
            <motion.p 
              className="text-xl mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              대기업부터 자영업자까지 <span className="text-green-500">4000곳이 넘는 브랜드</span>가 네버디자인을 선택했습니다
            </motion.p>
            <div className="flex justify-around items-center">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="text-3xl font-bold text-green-500 mb-2">누적 프로젝트</h3>
                <p className="text-6xl font-extrabold">4040<span className="text-4xl">+</span></p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-3xl font-bold text-green-500 mb-2">고객 만족도</h3>
                <p className="text-6xl font-extrabold">96<span className="text-4xl">%</span></p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className="text-3xl font-bold text-green-500 mb-2">재구매율</h3>
                <p className="text-6xl font-extrabold">93<span className="text-4xl">%</span></p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. 마인드 리딩 섹션  */}
        <section className="py-20 bg-gray-50 text-black">
          <div className="container mx-auto px-6">
            <motion.h1 
              className="text-6xl font-bold mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              이런 고민, 안드셨나요?
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-black text-white p-8 rounded-lg md:mb-24"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img src="/images/concern/concern1.jpg" alt="디자인마다 다른 가격" className="w-full h-48 object-cover mb-4" />
                <h3 className="text-2xl font-bold mb-2">디자인마다 다른 가격</h3>
                <p>로고 유형마다 가격이 다르면 어떡하지?</p>
              </motion.div>
              <motion.div 
                className="bg-black text-white p-8 rounded-lg md:mt-24"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <img src="/images/concern/concern2.jpg" alt="낮은 기업 이해도" className="w-full h-48 object-cover mb-4" />
                <h3 className="text-2xl font-bold mb-2">낮은 기업 이해도</h3>
                <p>핵심 가치가 반영되지 못하면 어떡하지?</p>
              </motion.div>
              <motion.div 
                className="bg-black text-white p-8 rounded-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <img src="/images/concern/concern3.jpg" alt="낮은 퀄리티" className="w-full h-48 object-cover mb-4" />
                <h3 className="text-2xl font-bold mb-2">낮은 퀄리티</h3>
                <p>시안을 받았는데 원하는 디자인이 아니면 어떡하지?</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5 강조 섹션  */}
        <section className="py-20 bg-gray-100 text-black">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-6xl text-left font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                그렇다면?
              </motion.h1>
              <motion.span 
                className="bg-yellow-300 text-black px-2 py-1 text-base font-bold inline-block mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                가성비 TOP
              </motion.span>
              <motion.h2 
                className="text-6xl mt-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                '<span className="underline text-green-800">인트로고</span>'를 주목해 주세요!
              </motion.h2>
              <motion.img 
                src="/images/title_logo.jpg" 
                alt="인트로고 이미지" 
                className="w-1/2 h-auto mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        </section>

        {/* 5. 업체 소개 제목 섹션 */}
        <motion.section 
          className="py-20 bg-white text-black"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-6">
            <motion.h1 
              className="text-6xl font-bold mb-12 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              그저 심플한 로고 <span className="text-green-800">X</span>
            </motion.h1>
            <motion.h2 
              className="text-4xl font-bold mb-12 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              한눈에 의미를 전달하는 로고 제작!
            </motion.h2>
            <motion.div 
              className="border-t border-b border-gray-300 py-8 my-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <h3 className="text-4xl font-bold mb-4 text-center">
                어떻게 제작하냐고요?
              </h3>
              <p className="text-2xl text-center mb-4">
                "전체는 단순한 부분의 합이 아니다"<br />
                <span className="text-lg">[협력 심리학의 창시자 '막스 베르트하이머']</span>
              </p>
              <p className="text-2xl text-center mb-4">
                즉 사람은 개별적인 시각적 요소를 따로 인식하는 것이 아니라, <br />
                <span className="text-green-800">하나의 형태로 통합해 인식하는 경향</span>이 있습니다.
              </p>
              <p className="text-2xl text-center">
                로고 디자인도 마찬가지입니다. <br />
                단순히 아이콘을 나열하는 것이 아닌 <br />
                '<span className="text-green-800">하나의 형태로 자연스럽게 결합된 형태</span>'는 <br />
                더 직관적으로 기억되고, 신뢰감을 줍니다.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <h3 className="text-4xl font-bold mb-4">
                차이가 보이시나요?
              </h3>
              <div className="flex justify-center items-center space-x-8">
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                  <img src="/images/column/column1.jpg" alt="예시 1" className="w-48 h-auto mx-auto mb-4" />
                  <p className="text-2xl">1은 손과 집이 각각 따로 보이지만</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                  <img src="/images/column/column2.jpg" alt="예시 2" className="w-48 h-auto mx-auto mb-4" />
                  <p className="text-2xl">2는 손과 집이 자연스럽게 연결되어 보입니다.</p>
                </div>
              </div>
              <p className="text-2xl mt-8">
                또한 심플한 빗자루로 '청소'라는 <span className="text-green-800">의미를 바로 전달</span>합니다. <br />
                이 작은 차이가 브랜드의 첫인상을 결정합니다.
              </p>
              <p className="text-2xl mt-4">
                인트로고는 이런 방식으로, <span className="text-green-800">한눈에 의미를 전달하는 로고</span>를 만듭니다.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* 6. 고객 후기 섹션 */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-left mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <motion.h2 
                className="text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                이미 <span className="text-green-800">70개 이상의 브랜드</span>가 저희와 함께 해주셨습니다
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              {loading ? (
                <div className="text-center py-8">로딩 중...</div>
              ) : (
                topReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    className="bg-white rounded-2xl p-8 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      {review.images && review.images.length > 0 ? (
                        <img 
                          src={review.images[0]} 
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-xl font-bold">★</span>
                          <span className="ml-2 text-lg font-bold">{review.rating}</span>
                          <span className="ml-2 text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-2 text-gray-700">{review.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 30px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-green-800 text-white text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform"
                onClick={() => navigate('/reviews')}
              >
                모든 후기 보기
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* 7. 서비스 소개 - 차별점 섹션 */}
        <section className="py-20 bg-gray-50 text-black">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <motion.h2 
                className="text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                왜 <span className="underline text-green-800">인트로고</span>에서 사야할까요?
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <motion.div
                className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <FaTicketAlt className="text-6xl text-green-800 mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">모든 유형 로고 39000원</h3>
                <p className="text-gray-700">마지막 30명<br />40% 이벤트</p>
              </motion.div>
              <motion.div
                className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <FaDollarSign className="text-6xl text-green-800 mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">100% 환불</h3>
                <p className="text-gray-700">시안이 불만족 시<br />무조건 전액 환불해드립니다</p>
              </motion.div>
              <motion.div
                className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <FaHandPaper className="text-6xl text-green-800 mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">첫 시안 3개</h3>
                <p className="text-gray-700">타 업체와 달리, 가격차별 없이<br />다양한 시안을 비교 가능합니다</p>
              </motion.div>
              <motion.div
                className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <FaInfinity className="text-6xl text-green-800 mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">수정 무제한</h3>
                <p className="text-gray-700">추가 비용 없이<br />100% 만족하실 때까지 수정해드립니다</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 포트폴리오 섹션 */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left mb-12"
            >
              <h2 className="text-6xl font-bold mb-4">포트폴리오</h2>
              <p className="text-2xl text-gray-600">우리의 최근 작업물을 소개합니다</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                portfolios.map((portfolio) => (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: portfolio.id * 0.1 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedPortfolio(portfolio)}
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="relative h-48">
                        <img
                          src={portfolio.image_url}
                          alt={portfolio.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{portfolio.title}</h3>
                        <p className="text-gray-600 mb-4">{portfolio.description}</p>
                        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                          {portfolio.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-800 text-white px-12 py-5 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('/portfolio')}
              >
                더 많은 작업물 보기
              </motion.button>
            </div>
          </div>
        </section>

        {/* 8. 상품 안내 섹션 */}
        <section className="py-20 bg-gray-50 text-black">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-left mb-16 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                상품 안내
              </motion.h2>
              <motion.div 
                className="flex flex-col md:flex-row items-start relative mx-auto mt-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div 
                  className="w-full md:w-1/2"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <img 
                    src="/images/title_logo.jpg" 
                    alt="Logo Example" 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </motion.div>
                <motion.div 
                  className="bg-green-800 text-white p-8 rounded-lg shadow-lg w-full md:w-1/3 mt-8 md:mt-0 md:ml-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-2xl font-bold mb-4">Standard Logo 39,000원</p>
                  <ul className="list-disc list-inside text-lg">
                    <li>모든 유형 로고(텍스트, 심볼, 엠블럼, 캐릭터)</li>
                    <li>첫 시안 3개</li>
                    <li>수정 무제한</li>
                    <li>원본 파일(JPG, PNG, AI)</li>
                    <li>평일 기준 3~7일 소요</li>
                  </ul>
                </motion.div>
              </motion.div>
              <motion.div 
                className="border-t border-b border-gray-300 py-8 my-8 mt-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h3 className="text-4xl font-bold mb-4 text-center mt-8">
                  왜 이렇게 저렴하냐고요?
                </h3>
                <p className="text-center text-2xl mb-4">
                  솔직하게 포트폴리오를 쌓기 위해 <br />
                  업계 최저가로 제작 진행중입니다. <br />
                </p>
                <p className="text-center text-3xl mb-4">
                  그래서 더욱더 한분 한분 <br />
                </p>
                <p className="text-center text-3xl mb-4">
                  가격의 <span className="text-green-800">10배 이상의 퀄리티</span>와 만족도를 <br />
                </p>
                <p className="text-center text-3xl mb-4">
                  드리기 위해 최선을 다해 제작합니다.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 10. 제작 프로세스 섹션 */}
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <motion.h2 
                className="text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                작업 프로세스
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2,
                  ease: "easeOut"
                }}
              >
                체계적인 프로세스로 완성도 높은 결과물을 제공합니다
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">브랜드 상담</h3>
                <p className="text-gray-600">
                  브랜드의 가치와 목표,<br />
                  타겟 고객층을 파악합니다
                </p>
                <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-green-800 -z-10"></div>
              </motion.div>

              <motion.div
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">디자인 기획</h3>
                <p className="text-gray-600">
                  브랜드 컨셉에 맞는<br />
                  디자인 방향을 설정합니다
                </p>
                <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-green-800 -z-10"></div>
              </motion.div>

              <motion.div
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">디자인 작업</h3>
                <p className="text-gray-600">
                  다양한 시안을 제작하고<br />
                  피드백을 반영합니다
                </p>
                <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-green-800 -z-10"></div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold mb-4">최종 완성</h3>
                <p className="text-gray-600">
                  최종 파일 전달과 함께<br />
                  사용 가이드를 제공합니다
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 11. QA 섹션 */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-left mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-6xl font-bold mb-6 text-left">자주 묻는 질문</h2>
              <div className="max-w-full mx-auto mt-10">
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <button 
                    className={`w-full text-left p-6 bg-white shadow-md hover:text-green-800 flex justify-between items-center ${openQuestion === 1 ? 'rounded-t-xl' : 'rounded-xl'}`}
                    onClick={() => toggleQuestion(1)}
                  >
                    <h3 className={`text-xl font-bold ${openQuestion === 1 ? 'text-green-800' : 'text-black'} hover:text-green-800`}>
                      Q1. 디자인이 마음에 들지 않으면 어떻게 하나요?
                    </h3>
                    <FaChevronDown 
                      className={`transition-transform duration-300 ${openQuestion === 1 ? 'transform rotate-180' : ''}`}
                    />
                  </button>
                  {openQuestion === 1 && (
                    <motion.div 
                      className="p-6 bg-white shadow-md rounded-b-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-600">
                        걱정하지 않으셔도 됩니다. 모든 시안이 제공됨에도 마음에 들지 않을 경우 상담을 통해 문제점을 파악 후, 무료로 추가 시안을 제작하는 서비스입니다. 또한 수정횟수는 당연히 무제한입니다.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <button 
                    className={`w-full text-left p-6 bg-white shadow-md hover:text-green-800 flex justify-between items-center ${openQuestion === 2 ? 'rounded-t-xl' : 'rounded-xl'}`}
                    onClick={() => toggleQuestion(2)}
                  >
                    <h3 className={`text-xl font-bold ${openQuestion === 2 ? 'text-green-800' : 'text-black'} hover:text-green-800`}>
                      Q2. 로고 제작 기간은 얼마나 걸리나요?
                    </h3>
                    <FaChevronDown 
                      className={`transition-transform duration-300 ${openQuestion === 2 ? 'transform rotate-180' : ''}`}
                    />
                  </button>
                  {openQuestion === 2 && (
                    <motion.div 
                      className="p-6 bg-white shadow-md rounded-b-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-600">
                        상품과 시안 개수에 따라 차이가 있으나 일반적으로 3~7일이 소요됩니다. 하지만 급하신 고객님들의 경우 우선작업 도와드리고 있으니 편하게 문의주시면 감사하겠습니다. (고객사 피드백 속도와 수정 횟수에 따라 연장될 수 있습니다.)
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                {/* 추가 FAQ 항목... */}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      {isConsultationModalOpen && (
        <ConsultationModal 
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)} 
        />
      )}
      {selectedPortfolio && (
        <PortfolioLightbox
          portfolio={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
        />
      )}
    </div>
  );
};

export default HomePage; 
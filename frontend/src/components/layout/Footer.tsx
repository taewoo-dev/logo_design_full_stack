import FinalSection from './FinalSection';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <FinalSection />
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-4">
              LOGO STUDIO
            </h3>
            <p className="text-gray-400">
              브랜드의 가치를 높이는<br />
              로고 디자인 전문가 그룹
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li><a href="/portfolio" className="hover:text-white transition-colors">포트폴리오</a></li>
              <li><a href="/order" className="hover:text-white transition-colors">로고 주문하기</a></li>
              <li><a href="/process" className="hover:text-white transition-colors">작업 프로세스</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:text-white transition-colors">문의하기</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">연락처</h4>
            <ul className="space-y-2 text-gray-400">
              <li>서울특별시 강남구 테헤란로</li>
              <li>이메일: contact@logostudio.kr</li>
              <li>전화: 02-1234-5678</li>
              <li>평일 10:00 - 19:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 LOGO STUDIO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
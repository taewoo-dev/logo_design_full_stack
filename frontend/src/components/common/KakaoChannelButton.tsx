import { useEffect } from 'react';
import { BiSolidMessageRoundedDetail } from 'react-icons/bi'; 

declare global {
  interface Window {
    Kakao: any;
  }
}

const KakaoChannelButton = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const handleChannelClick = () => {
    window.Kakao.Channel.chat({
      channelPublicId: process.env.REACT_APP_KAKAO_CHANNEL_ID
    });
  };

  return (
    <button
      onClick={handleChannelClick}
      className="fixed bottom-8 right-8 bg-green-800 text-white rounded-full p-4 shadow-lg hover:bg-green-700 
      transition-all duration-300 z-50 flex items-center gap-3 group"
    >
      <BiSolidMessageRoundedDetail className="text-3xl" />
      <span className="text-lg font-bold max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 ease-in-out whitespace-nowrap">
        상담하기
      </span>
    </button>
  );
};

export default KakaoChannelButton; 
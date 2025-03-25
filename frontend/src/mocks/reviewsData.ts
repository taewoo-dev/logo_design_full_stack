export interface Review {
  id: number;
  name: string;
  rating: number;
  content: string;
  date: string;
  orderType: string;
  images: string[];
  orderAmount: string;
  workingDays: number;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "김서연",
    rating: 5,
    content: "정확한 방향성 없이 시작했는데 세심한 상담 너무 감사합니다 :) 기회되면 또 의뢰 하고 싶어요!!",
    date: "2024.03.10",
    orderType: "로고, 로고제작, 로고디자인, 심플로고",
    images: ["/images/reviews/logo1.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 13
  },
  {
    id: 2,
    name: "박준호",
    rating: 5,
    content: "홈. 여러 로고 및 bi제재 업체가 있겠으나, 저는 과히 만족합니다. 일이 워낙 많아 시간은 걸렸지만 그역시 이유는 있다 판단 합니다. 많이 까다롭고 어려웠을텐데 끝까지 완성해 주신데 아주 깊은 감사 드립니다.",
    date: "2024.03.06",
    orderType: "로고, 로고제작, 로고디자인, 심플로고",
    images: ["/images/reviews/logo2.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 8
  },
  {
    id: 3,
    name: "이민지",
    rating: 5,
    content: "원하는 방향으로 잘 만들어주셔서 너무 감사합니다. 수정사항도 빠르게 반영해주시고 친절하게 응대해주셔서 좋았어요. 다음에도 기회가 된다면 또 이용하고 싶습니다!",
    date: "2024.03.01",
    orderType: "로고, 로고제작, 로고디자인",
    images: ["/images/reviews/logo3.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 10
  },
  {
    id: 4,
    name: "최현우",
    rating: 4,
    content: "전체적으로 만족스러웠습니다. 시안도 다양하게 보여주시고 수정도 잘 해주셨어요. 다만 작업 기간이 예상보다 조금 길어진 점이 아쉽네요.",
    date: "2024.02.28",
    orderType: "로고, 로고제작, 로고디자인",
    images: ["/images/reviews/logo4.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 15
  },
  {
    id: 5,
    name: "정다운",
    rating: 5,
    content: "처음에는 걱정했는데 너무 잘 만들어주셨어요! 특히 컨셉을 정확하게 이해해주셔서 원하는 느낌이 잘 표현된 것 같아요. 주변에도 추천하고 싶은 업체입니다.",
    date: "2024.02.25",
    orderType: "로고, 로고제작, 로고디자인, 심플로고",
    images: ["/images/reviews/logo5.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 7
  },
  {
    id: 6,
    name: "한상우",
    rating: 5,
    content: "빠른 작업과 친절한 상담 감사합니다. 로고 퀄리티도 너무 좋고 특히 수정 요청사항도 빠르게 반영해주셔서 좋았어요. 주변에서도 로고가 세련됐다고 칭찬해주네요!",
    date: "2024.02.20",
    orderType: "로고, 로고제작, 로고디자인",
    images: ["/images/reviews/logo6.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 9
  },
  {
    id: 7,
    name: "김태희",
    rating: 5,
    content: "로고 시안을 다양하게 보여주셔서 좋았어요. 원하는 스타일을 잘 캐치하셔서 만족스러운 결과물이 나왔습니다. 소통도 원활하고 수정도 신속하게 해주셨어요!",
    date: "2024.02.15",
    orderType: "로고, 로고제작, 로고디자인, 심플로고",
    images: ["/images/reviews/logo2.jpg"],
    orderAmount: "5만원 미만",
    workingDays: 11
  }
]; 
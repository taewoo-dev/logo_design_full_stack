export interface Column {
  id: number;
  title: string;
  summary: string;
  thumbnail: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
}

export const columns: Column[] = [
  {
    id: 1,
    title: "로고 디자인의 중요성: 브랜드 아이덴티티 구축하기",
    summary: "효과적인 로고 디자인이 브랜드 가치에 미치는 영향과 주요 고려사항을 알아봅니다.",
    thumbnail: "/images/columns/column1.jpg",
    category: "브랜딩",
    date: "2024.03.15",
    readTime: "5분",
    author: "김디자인",
    content: `
      <article class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6">브랜드 아이덴티티의 핵심, 로고 디자인</h2>
        
        <p class="mb-8">로고는 브랜드의 첫인상을 결정짓는 중요한 요소입니다. 효과적인 로고 디자인은 기업의 가치와 비전을 시각적으로 전달하며, 고객과의 신뢰 관계를 구축하는 데 핵심적인 역할을 합니다.</p>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-bold mb-4">좋은 로고의 조건</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>심플하고 기억하기 쉬울 것</li>
            <li>다양한 크기와 매체에서 활용 가능할 것</li>
            <li>브랜드의 핵심 가치를 반영할 것</li>
          </ul>
        </div>

        <p class="mb-8">좋은 로고는 단순히 예쁜 디자인을 넘어서 브랜드의 스토리를 담고 있어야 합니다.</p>
      </article>
    `
  },
  {
    id: 2,
    title: "2024년 로고 디자인 트렌드",
    summary: "올해의 주요 로고 디자인 트렌드와 적용 방안을 소개합니다.",
    thumbnail: "/images/columns/column2.jpg",
    category: "트렌드",
    date: "2024.03.10",
    readTime: "4분",
    author: "이트렌드",
    content: `
      <article class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6">2024년 로고 디자인의 새로운 흐름</h2>
        
        <p class="mb-8">디지털 시대의 발전과 함께 로고 디자인 트렌드도 계속해서 진화하고 있습니다. 2024년에는 미니멀리즘을 넘어선 새로운 접근방식이 주목받고 있습니다.</p>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-bold mb-4">주요 트렌드</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>다이나믹 로고 시스템</li>
            <li>3D 그래디언트</li>
            <li>지속가능성을 반영한 디자인</li>
          </ul>
        </div>
      </article>
    `
  },
  {
    id: 3,
    title: "색상 심리학: 로고 컬러가 주는 영향",
    summary: "브랜드 로고의 색상이 소비자 심리에 미치는 영향을 분석합니다.",
    thumbnail: "/images/columns/column3.jpg",
    category: "디자인",
    date: "2024.03.05",
    readTime: "6분",
    author: "박컬러",
    content: `
      <article class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6">색상이 브랜드에 미치는 영향</h2>
        
        <p class="mb-8">색상은 로고 디자인에서 가장 중요한 요소 중 하나입니다. 적절한 색상 선택은 브랜드의 메시지를 효과적으로 전달하고 소비자의 감정을 자극할 수 있습니다.</p>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-bold mb-4">색상별 심리적 효과</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>빨강: 열정, 에너지</li>
            <li>파랑: 신뢰, 안정</li>
            <li>초록: 자연, 성장</li>
          </ul>
        </div>
      </article>
    `
  },
  {
    id: 4,
    title: "스타트업을 위한 로고 디자인 전략",
    summary: "제한된 예산으로 효과적인 브랜드 아이덴티티를 구축하는 방법",
    thumbnail: "/images/columns/column4.jpg",
    category: "전략",
    date: "2024.03.01",
    readTime: "5분",
    author: "최스타트",
    content: `
      <article class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6">스타트업의 성공적인 브랜딩</h2>
        
        <p class="mb-8">스타트업에게 브랜딩은 선택이 아닌 필수입니다. 제한된 예산 내에서 효과적인 브랜드 아이덴티티를 구축하는 방법을 알아봅니다.</p>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-bold mb-4">주요 전략</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>핵심 가치 정의</li>
            <li>차별화 포인트 발굴</li>
            <li>확장성 고려</li>
          </ul>
        </div>
      </article>
    `
  },
  {
    id: 5,
    title: "리브랜딩 성공 사례 분석",
    summary: "성공적인 리브랜딩 프로젝트들의 핵심 전략을 살펴봅니다.",
    thumbnail: "/images/columns/column5.jpg",
    category: "사례연구",
    date: "2024.02.28",
    readTime: "7분",
    author: "정브랜드",
    content: `
      <article class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6">성공적인 리브랜딩의 비밀</h2>
        
        <p class="mb-8">시대의 변화에 맞춰 브랜드도 진화해야 합니다. 성공적인 리브랜딩 사례를 통해 핵심 전략을 알아봅니다.</p>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-bold mb-4">성공 요인</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>명확한 목표 설정</li>
            <li>고객 피드백 반영</li>
            <li>일관된 메시지 전달</li>
          </ul>
        </div>
      </article>
    `
  },
  {
    id: 6,
    title: "로고 디자인의 타이포그래피",
    summary: "효과적인 폰트 선택과 레터링 기법에 대해 알아봅니다.",
    thumbnail: "/images/columns/column6.jpg",
    category: "타이포그래피",
    date: "2024.02.25",
    readTime: "5분",
    author: "한폰트",
    content: `
      <article class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6">타이포그래피의 중요성</h2>
        
        <p class="mb-8">로고에서 타이포그래피는 브랜드의 성격을 결정짓는 중요한 요소입니다. 효과적인 폰트 선택과 레터링 기법을 살펴봅니다.</p>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-bold mb-4">고려사항</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>브랜드 성격과의 일치성</li>
            <li>가독성과 식별성</li>
            <li>다양한 크기에서의 활용성</li>
          </ul>
        </div>
      </article>
    `
  }
]; 
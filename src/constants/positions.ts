/**
 * 직무(Position) 관련 상수
 * 3단계 계층 구조: 대분류(Level 1) > 중분류(Level 2) > 소분류(Level 3)
 */

export interface Position {
  id: number;
  name: string;
  code: string;
  level: number;
  parentCode?: string;
  children?: Position[];
}

// Level 1: 대분류 (16개)
export const POSITION_CATEGORIES_L1: Position[] = [
  { id: 1, name: '개발', code: '001', level: 1 },
  { id: 2, name: '데이터/AI', code: '002', level: 1 },
  { id: 3, name: '기획/PM', code: '003', level: 1 },
  { id: 4, name: '디자인', code: '004', level: 1 },
  { id: 5, name: '마케팅', code: '005', level: 1 },
  { id: 6, name: '영업', code: '006', level: 1 },
  { id: 7, name: '운영/CS', code: '007', level: 1 },
  { id: 8, name: '경영지원', code: '008', level: 1 },
  { id: 9, name: '인사/총무', code: '009', level: 1 },
  { id: 10, name: '회계/재무', code: '010', level: 1 },
  { id: 11, name: '구매/물류', code: '011', level: 1 },
  { id: 12, name: '생산/제조', code: '012', level: 1 },
  { id: 13, name: '품질/QA', code: '013', level: 1 },
  { id: 14, name: '보안', code: '014', level: 1 },
  { id: 15, name: '법무/컴플라이언스', code: '015', level: 1 },
  { id: 16, name: '연구/R&D', code: '016', level: 1 },
];

// Level 2: 중분류
export const POSITION_CATEGORIES_L2: Position[] = [
  // 개발(001)
  { id: 17, name: '백엔드', code: '001001', level: 2, parentCode: '001' },
  { id: 18, name: '프론트엔드', code: '001002', level: 2, parentCode: '001' },
  { id: 19, name: '모바일', code: '001003', level: 2, parentCode: '001' },
  { id: 20, name: '게임', code: '001004', level: 2, parentCode: '001' },
  { id: 21, name: 'DevOps/SRE', code: '001005', level: 2, parentCode: '001' },
  { id: 22, name: 'QA/테스트', code: '001006', level: 2, parentCode: '001' },
  { id: 23, name: '임베디드/펌웨어', code: '001007', level: 2, parentCode: '001' },

  // 데이터/AI(002)
  { id: 24, name: '데이터엔지니어링', code: '002001', level: 2, parentCode: '002' },
  { id: 25, name: '데이터분석/BI', code: '002002', level: 2, parentCode: '002' },
  { id: 26, name: '머신러닝', code: '002003', level: 2, parentCode: '002' },
  { id: 27, name: '딥러닝/NLP/CV', code: '002004', level: 2, parentCode: '002' },
  { id: 28, name: 'MLOps', code: '002005', level: 2, parentCode: '002' },

  // 기획/PM(003)
  { id: 29, name: '프로덕트 매니지먼트', code: '003001', level: 2, parentCode: '003' },
  { id: 30, name: '서비스/웹기획', code: '003002', level: 2, parentCode: '003' },
  { id: 31, name: '전략/사업기획', code: '003003', level: 2, parentCode: '003' },
  { id: 32, name: '프로젝트관리(PM)', code: '003004', level: 2, parentCode: '003' },

  // 디자인(004)
  { id: 33, name: 'UI/UX', code: '004001', level: 2, parentCode: '004' },
  { id: 34, name: 'BX/브랜딩', code: '004002', level: 2, parentCode: '004' },
  { id: 35, name: '그래픽/편집', code: '004003', level: 2, parentCode: '004' },
  { id: 36, name: '모션/영상', code: '004004', level: 2, parentCode: '004' },
  { id: 37, name: '3D/산업디자인', code: '004005', level: 2, parentCode: '004' },

  // 마케팅(005)
  { id: 38, name: '퍼포먼스마케팅', code: '005001', level: 2, parentCode: '005' },
  { id: 39, name: '콘텐츠마케팅', code: '005002', level: 2, parentCode: '005' },
  { id: 40, name: '브랜드마케팅', code: '005003', level: 2, parentCode: '005' },
  { id: 41, name: 'CRM/리텐션', code: '005004', level: 2, parentCode: '005' },

  // 영업(006)
  { id: 42, name: 'B2B 영업', code: '006001', level: 2, parentCode: '006' },
  { id: 43, name: 'B2C 영업', code: '006002', level: 2, parentCode: '006' },
  { id: 44, name: '해외영업', code: '006003', level: 2, parentCode: '006' },

  // 운영/CS(007)
  { id: 45, name: '고객지원', code: '007001', level: 2, parentCode: '007' },
  { id: 46, name: '서비스운영', code: '007002', level: 2, parentCode: '007' },
  { id: 47, name: '콘텐츠/커뮤니티 운영', code: '007003', level: 2, parentCode: '007' },
  { id: 48, name: 'MD/상품운영', code: '007004', level: 2, parentCode: '007' },

  // 경영지원(008)
  { id: 49, name: '총무/사무', code: '008001', level: 2, parentCode: '008' },
  { id: 50, name: '구매/자산관리', code: '008002', level: 2, parentCode: '008' },
  { id: 51, name: '경영관리', code: '008003', level: 2, parentCode: '008' },

  // 인사/총무(009)
  { id: 52, name: '채용(리크루팅)', code: '009001', level: 2, parentCode: '009' },
  { id: 53, name: 'HRM/노무', code: '009002', level: 2, parentCode: '009' },
  { id: 54, name: 'HRD/교육', code: '009003', level: 2, parentCode: '009' },
  { id: 55, name: '총무', code: '009004', level: 2, parentCode: '009' },

  // 회계/재무(010)
  { id: 56, name: '회계', code: '010001', level: 2, parentCode: '010' },
  { id: 57, name: '재무', code: '010002', level: 2, parentCode: '010' },
  { id: 58, name: '세무', code: '010003', level: 2, parentCode: '010' },
  { id: 59, name: 'IR/자금', code: '010004', level: 2, parentCode: '010' },

  // 구매/물류(011)
  { id: 60, name: '구매', code: '011001', level: 2, parentCode: '011' },
  { id: 61, name: '물류', code: '011002', level: 2, parentCode: '011' },
  { id: 62, name: 'SCM', code: '011003', level: 2, parentCode: '011' },
  { id: 63, name: '무역/통관', code: '011004', level: 2, parentCode: '011' },

  // 생산/제조(012)
  { id: 64, name: '생산관리', code: '012001', level: 2, parentCode: '012' },
  { id: 65, name: '공정/설비', code: '012002', level: 2, parentCode: '012' },
  { id: 66, name: '제조기술', code: '012003', level: 2, parentCode: '012' },

  // 품질/QA(013)
  { id: 67, name: '품질관리(QC)', code: '013001', level: 2, parentCode: '013' },
  { id: 68, name: '품질보증(QA)', code: '013002', level: 2, parentCode: '013' },
  { id: 69, name: '인증/규격', code: '013003', level: 2, parentCode: '013' },

  // 보안(014)
  { id: 70, name: '보안엔지니어링', code: '014001', level: 2, parentCode: '014' },
  { id: 71, name: '관제/침해대응', code: '014002', level: 2, parentCode: '014' },

  // 법무/컴플라이언스(015)
  { id: 72, name: '법무', code: '015001', level: 2, parentCode: '015' },
  { id: 73, name: '컴플라이언스', code: '015002', level: 2, parentCode: '015' },

  // 연구/R&D(016)
  { id: 74, name: 'IT/소프트웨어', code: '016001', level: 2, parentCode: '016' },
  { id: 75, name: '소재/화학', code: '016002', level: 2, parentCode: '016' },
  { id: 76, name: '전기/전자', code: '016003', level: 2, parentCode: '016' },
  { id: 77, name: '기계', code: '016004', level: 2, parentCode: '016' },
  { id: 78, name: '바이오', code: '016005', level: 2, parentCode: '016' },
];

// Level 3: 소분류 (세부 직무)
export const POSITIONS_L3: Position[] = [
  // 백엔드(001001)
  { id: 79, name: '백엔드 개발자', code: '001001001', level: 3, parentCode: '001001' },
  { id: 80, name: '서버/플랫폼 엔지니어', code: '001001002', level: 3, parentCode: '001001' },
  { id: 81, name: '소프트웨어 아키텍트', code: '001001003', level: 3, parentCode: '001001' },

  // 프론트엔드(001002)
  { id: 82, name: '프론트엔드 개발자', code: '001002001', level: 3, parentCode: '001002' },
  { id: 83, name: '웹 퍼블리셔', code: '001002002', level: 3, parentCode: '001002' },

  // 모바일(001003)
  { id: 84, name: 'Android 개발자', code: '001003001', level: 3, parentCode: '001003' },
  { id: 85, name: 'iOS 개발자', code: '001003002', level: 3, parentCode: '001003' },
  { id: 86, name: 'Flutter/React Native 개발자', code: '001003003', level: 3, parentCode: '001003' },

  // DevOps/SRE(001005)
  { id: 87, name: 'DevOps 엔지니어', code: '001005001', level: 3, parentCode: '001005' },
  { id: 88, name: 'SRE 엔지니어', code: '001005002', level: 3, parentCode: '001005' },
  { id: 89, name: '인프라 엔지니어', code: '001005003', level: 3, parentCode: '001005' },

  // 임베디드/펌웨어(001007)
  { id: 90, name: '임베디드 엔지니어', code: '001007001', level: 3, parentCode: '001007' },
  { id: 91, name: '펌웨어 엔지니어', code: '001007002', level: 3, parentCode: '001007' },

  // 데이터엔지니어링(002001)
  { id: 92, name: '데이터 엔지니어', code: '002001001', level: 3, parentCode: '002001' },
  { id: 93, name: '데이터 파이프라인/ETL 엔지니어', code: '002001002', level: 3, parentCode: '002001' },
  { id: 94, name: 'DBA', code: '002001003', level: 3, parentCode: '002001' },

  // 데이터분석/BI(002002)
  { id: 95, name: '데이터 분석가', code: '002002001', level: 3, parentCode: '002002' },
  { id: 96, name: 'BI/리포팅 엔지니어', code: '002002002', level: 3, parentCode: '002002' },

  // 머신러닝(002003)
  { id: 97, name: '머신러닝 엔지니어', code: '002003001', level: 3, parentCode: '002003' },
  { id: 98, name: '데이터 사이언티스트', code: '002003002', level: 3, parentCode: '002003' },

  // 딥러닝/NLP/CV(002004)
  { id: 99, name: 'NLP 엔지니어', code: '002004001', level: 3, parentCode: '002004' },
  { id: 100, name: '컴퓨터비전 엔지니어', code: '002004002', level: 3, parentCode: '002004' },

  // MLOps(002005)
  { id: 101, name: 'MLOps 엔지니어', code: '002005001', level: 3, parentCode: '002005' },

  // 프로덕트 매니지먼트(003001)
  { id: 102, name: '프로덕트 매니저(PM)', code: '003001001', level: 3, parentCode: '003001' },
  { id: 103, name: 'PO(Product Owner)', code: '003001002', level: 3, parentCode: '003001' },

  // 서비스/웹기획(003002)
  { id: 104, name: '서비스 기획자', code: '003002001', level: 3, parentCode: '003002' },
  { id: 105, name: '기능/화면 기획자', code: '003002002', level: 3, parentCode: '003002' },

  // 프로젝트관리(PM)(003004)
  { id: 106, name: '프로젝트 매니저', code: '003004001', level: 3, parentCode: '003004' },

  // 퍼포먼스마케팅(005001)
  { id: 107, name: '퍼포먼스 마케터', code: '005001001', level: 3, parentCode: '005001' },
  { id: 108, name: '광고 운영 담당자', code: '005001002', level: 3, parentCode: '005001' },

  // CRM/리텐션(005004)
  { id: 109, name: 'CRM 마케터', code: '005004001', level: 3, parentCode: '005004' },
  { id: 110, name: '그로스 마케터', code: '005004002', level: 3, parentCode: '005004' },

  // B2B 영업(006001)
  { id: 111, name: 'B2B 세일즈', code: '006001001', level: 3, parentCode: '006001' },
  { id: 112, name: '세일즈 엔지니어', code: '006001002', level: 3, parentCode: '006001' },

  // 해외영업(006003)
  { id: 113, name: '해외영업 담당자', code: '006003001', level: 3, parentCode: '006003' },
  { id: 114, name: '무역영업 담당자', code: '006003002', level: 3, parentCode: '006003' },

  // 고객지원(007001)
  { id: 115, name: 'CS 상담원', code: '007001001', level: 3, parentCode: '007001' },
  { id: 116, name: 'VOC/클레임 관리자', code: '007001002', level: 3, parentCode: '007001' },

  // 서비스운영(007002)
  { id: 117, name: '서비스 운영 담당자', code: '007002001', level: 3, parentCode: '007002' },
  { id: 118, name: '정산/운영관리 담당자', code: '007002002', level: 3, parentCode: '007002' },

  // 회계(010001)
  { id: 119, name: '회계 담당자', code: '010001001', level: 3, parentCode: '010001' },
  { id: 120, name: '결산 담당자', code: '010001002', level: 3, parentCode: '010001' },

  // 재무(010002)
  { id: 121, name: '재무 담당자', code: '010002001', level: 3, parentCode: '010002' },
  { id: 122, name: '자금 담당자', code: '010002002', level: 3, parentCode: '010002' },

  // 구매(011001)
  { id: 123, name: '구매 담당자', code: '011001001', level: 3, parentCode: '011001' },
  { id: 124, name: '원가/협력사 관리 담당자', code: '011001002', level: 3, parentCode: '011001' },

  // 물류(011002)
  { id: 125, name: '물류 운영 담당자', code: '011002001', level: 3, parentCode: '011002' },

  // 보안엔지니어링(014001)
  { id: 126, name: '보안 엔지니어', code: '014001001', level: 3, parentCode: '014001' },
  { id: 127, name: '애플리케이션 보안 엔지니어', code: '014001002', level: 3, parentCode: '014001' },

  // 관제/침해대응(014002)
  { id: 128, name: '보안관제 담당자', code: '014002001', level: 3, parentCode: '014002' },
  { id: 129, name: '침해대응 담당자', code: '014002002', level: 3, parentCode: '014002' },

  // 법무(015001)
  { id: 130, name: '사내 변호사/법무 담당자', code: '015001001', level: 3, parentCode: '015001' },
  { id: 131, name: '계약/분쟁 담당자', code: '015001002', level: 3, parentCode: '015001' },
];

// 전체 직무 목록 (모든 레벨 통합)
export const ALL_POSITIONS: Position[] = [
  ...POSITION_CATEGORIES_L1,
  ...POSITION_CATEGORIES_L2,
  ...POSITIONS_L3,
];

// Level 3 직무만 (실제 선택 가능한 직무)
export const SELECTABLE_POSITIONS = POSITIONS_L3;

// 계층 구조를 가진 직무 옵션 (select optgroup용)
export interface PositionGroup {
  category: string;
  categoryCode: string;
  subcategories: {
    name: string;
    code: string;
    positions: Position[];
  }[];
}

/**
 * 계층 구조로 직무 데이터를 그룹핑
 */
export function getPositionsByHierarchy(): PositionGroup[] {
  const result: PositionGroup[] = [];

  POSITION_CATEGORIES_L1.forEach(l1 => {
    const l2Items = POSITION_CATEGORIES_L2.filter(l2 => l2.parentCode === l1.code);

    const subcategories = l2Items.map(l2 => {
      const positions = POSITIONS_L3.filter(l3 => l3.parentCode === l2.code);
      return {
        name: l2.name,
        code: l2.code,
        positions,
      };
    });

    result.push({
      category: l1.name,
      categoryCode: l1.code,
      subcategories,
    });
  });

  return result;
}

// 간단한 id-name 쌍 배열 (기존 호환성 유지)
export const POSITION_OPTIONS = POSITIONS_L3.map(pos => ({
  id: pos.id,
  name: pos.name,
  code: pos.code,
}));

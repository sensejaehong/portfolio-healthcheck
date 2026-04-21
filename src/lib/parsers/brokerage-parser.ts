/**
 * 증권사 앱 스크린샷 OCR 텍스트를 파싱하여 보유종목 데이터를 추출하는 파서
 * 현재 지원: 키움증권, 미래에셋, 한국투자증권 등 주요 증권사 앱
 */

export interface ParsedHolding {
  name: string;
  avgPrice: number;
  currentPrice: number;
  costAmount: number;   // 매입금액
  currentValue: number; // 평가금액
  shares: number;       // 보유 수량 (매입금액 / 매입가 계산)
  returnRate: number;   // 수익률 (%)
  pnl: number;         // 평가손익
  sector: string;
  market: 'KRX' | 'NYSE' | 'NASDAQ';
  ticker: string;
}

// 숫자 문자열에서 숫자 추출 (콤마, 공백 제거)
function parseNumber(str: string): number {
  const cleaned = str.replace(/[,\s원%+]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// ETF/종목명에서 섹터 추론
function inferSector(name: string): string {
  const sectorMap: [RegExp, string][] = [
    [/네트워크|인프라|통신|5G|광통신/, '통신'],
    [/AI|인공지능|로봇|휴머노이드/, '기술'],
    [/반도체|메모리|칩/, '기술'],
    [/신재생|에너지|태양광|풍력|수소|2차전지|배터리/, '에너지'],
    [/바이오|헬스|의료|제약/, '헬스케어'],
    [/금융|은행|보험|증권/, '금융'],
    [/자동차|모빌리티|전기차|EV/, '산업재'],
    [/소비|리테일|유통|커머스/, '소비재'],
    [/부동산|리츠|REIT/, '부동산'],
    [/철강|화학|소재/, '소재'],
    [/게임|엔터|미디어|콘텐츠/, '통신'],
    [/방산|우주|항공/, '산업재'],
    [/클라우드|소프트웨어|SaaS|데이터/, '기술'],
    [/S&P|나스닥|NASDAQ|미국|글로벌/, '기술'],
    [/코스피|KOSPI|200|코스닥/, '기타'],
  ];

  for (const [regex, sector] of sectorMap) {
    if (regex.test(name)) return sector;
  }
  return '기타';
}

// 종목명에서 마켓 추론
function inferMarket(name: string): 'KRX' | 'NYSE' | 'NASDAQ' {
  // 한국 ETF 브랜드명
  const krxPatterns = /^(KODEX|TIGER|RISE|ACE|KBSTAR|SOL|HANARO|ARIRANG|KOSEF|TIMEFOLIO|PLUS|히어로즈)/i;
  // 한글이 포함되면 KRX
  const hasKorean = /[가-힣]/.test(name);

  if (krxPatterns.test(name) || hasKorean) return 'KRX';
  return 'NASDAQ'; // 기본값
}

// 종목명으로 임시 티커 생성
function generateTicker(name: string, index: number): string {
  // 잘 알려진 ETF 매핑
  const etfMap: Record<string, string> = {
    'RISE 네트워크인프라': '480250',
    'ACE K휴머노이드로봇산업': '488600',
    'KODEX 신재생에너지액티브': '385590',
    'KODEX 미국AI광통신네트워크': '489250',
    'TIGER K이노베이션': '457990',
    'TIGER 미국테크TOP10': '394670',
    'KODEX 200': '069500',
    'TIGER 200': '102110',
    'KODEX 삼성그룹': '102780',
    'KODEX 반도체': '091160',
    'TIGER 반도체': '091230',
  };

  // 부분 매칭 시도
  for (const [key, ticker] of Object.entries(etfMap)) {
    if (name.includes(key) || key.includes(name.replace(/\s+/g, ' ').trim())) {
      return ticker;
    }
  }

  // 매칭 실패 시 이름 기반 코드 생성
  return `KR-${(index + 1).toString().padStart(3, '0')}`;
}

/**
 * OCR 텍스트 파싱 메인 함수
 * 키움증권 형태의 테이블 구조를 파싱
 */
export function parseBrokerageText(ocrText: string): ParsedHolding[] {
  const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const holdings: ParsedHolding[] = [];

  // 숫자(금액) 패턴: 콤마 포함 숫자
  const moneyPattern = /[\d,]+/g;
  // 수익률 패턴: +12.80% 또는 -5.23%
  const returnPattern = /[+-]?\d+\.\d+%/;

  // 헤더/노이즈 라인 필터
  const noisePatterns = [
    /총\s*손익/, /총\s*매입/, /총\s*평가/, /실현손익/, /추정자산/,
    /MY랭킹/, /월\s*수익률/, /계산기/, /일괄매도/, /융자별/, /융자합/,
    /종목명/, /매입가/, /현재가/, /평가손익/, /수익률/, /매입금액/, /평가금액/,
    /관심종목/, /현재가/, /주문/, /차트/, /계좌/, /종합/, /메뉴/,
    /지수\s*채팅/, /실시간/, /대화중/, /의견/, /질문/, /환영/,
    /키움\s*잔고/, /타사\s*잔고/, /국내잔고/, /미체결/, /예수금/, /주문가능금액/,
    /유의/, /연금저축/, /해외/, /잔고/,
    /^\d{4}-\d{4}/, // 계좌번호
    /^\d줄$/, // "2줄" 같은 UI 요소
  ];

  // 노이즈 제거
  const cleanLines = lines.filter(line => {
    return !noisePatterns.some(p => p.test(line));
  });

  // 전략 1: 숫자가 많은 라인 그룹핑
  // 키움증권 형태: 종목명 라인 다음에 숫자 라인들이 연속

  let i = 0;
  while (i < cleanLines.length) {
    const line = cleanLines[i];

    // 종목명 후보: 한글 또는 영문 ETF 브랜드로 시작
    const isStockName = /^[A-Za-z가-힣]/.test(line) &&
                        !returnPattern.test(line) &&
                        !/^\d/.test(line);

    if (isStockName) {
      // 다음 몇 줄에서 숫자 데이터 수집
      const numbers: number[] = [];
      let hasReturn = false;
      let returnVal = 0;
      let nameLines = [line];
      let j = i + 1;

      // 연속된 줄에서 데이터 수집 (최대 5줄)
      while (j < cleanLines.length && j < i + 6) {
        const nextLine = cleanLines[j];

        // 다른 종목명이 시작되면 중단
        if (/^[A-Z가-힣]/.test(nextLine) &&
            !returnPattern.test(nextLine) &&
            !/^\d/.test(nextLine) &&
            !/^[+-]/.test(nextLine) &&
            numbers.length >= 3) {
          break;
        }

        // 종목명 연속 (2줄에 걸친 이름)
        if (/^[가-힣A-Za-z]/.test(nextLine) && numbers.length === 0 && !returnPattern.test(nextLine)) {
          nameLines.push(nextLine);
          j++;
          continue;
        }

        // 수익률 추출
        const retMatch = nextLine.match(/([+-]?\d+\.\d+)%/);
        if (retMatch) {
          hasReturn = true;
          returnVal = parseFloat(retMatch[1]);
        }

        // 숫자 추출
        const nums = nextLine.match(moneyPattern);
        if (nums) {
          nums.forEach(n => {
            const val = parseNumber(n);
            if (val > 0) numbers.push(val);
          });
        }

        j++;
      }

      // 최소 4개 숫자가 있으면 유효한 종목 데이터
      if (numbers.length >= 4) {
        const fullName = nameLines.join(' ').replace(/\.\.\./g, '').trim();

        // 키움증권 패턴: 매입가, 현재가, +평가손익, 매입금액, 평가금액
        // 숫자 배열에서 패턴 매칭
        let avgPrice = 0, currentPrice = 0, costAmount = 0, currentValue = 0, pnl = 0;

        if (numbers.length >= 6) {
          // 전형적 패턴: [매입가, 평가손익, 매입금액, 현재가, 수익률관련, 평가금액]
          // 또는: [매입가, 현재가, 평가손익, 매입금액, 평가금액]

          // 가장 큰 수 2개가 매입금액과 평가금액
          const sorted = [...numbers].sort((a, b) => b - a);
          currentValue = sorted[0];
          costAmount = sorted[1];

          // 가장 작은 수 2개 중에서 매입가/현재가
          const smallNums = numbers.filter(n => n < costAmount * 0.1);
          if (smallNums.length >= 2) {
            avgPrice = smallNums[0];
            currentPrice = smallNums[1];
          } else if (smallNums.length === 1) {
            avgPrice = smallNums[0];
            currentPrice = smallNums[0];
          }

          // 평가손익
          pnl = currentValue - costAmount;
        } else {
          // 4-5개 숫자: 간소화 패턴
          avgPrice = numbers[0];
          currentPrice = numbers[1];
          costAmount = numbers[numbers.length - 2] || numbers[0];
          currentValue = numbers[numbers.length - 1] || numbers[1];
          pnl = currentValue - costAmount;
        }

        // 수량 계산
        const shares = avgPrice > 0 ? Math.round(costAmount / avgPrice) : 0;

        if (shares > 0 && avgPrice > 0) {
          holdings.push({
            name: fullName,
            avgPrice,
            currentPrice: currentPrice || avgPrice,
            costAmount,
            currentValue,
            shares,
            returnRate: hasReturn ? returnVal : (costAmount > 0 ? ((currentValue - costAmount) / costAmount) * 100 : 0),
            pnl,
            sector: inferSector(fullName),
            market: inferMarket(fullName),
            ticker: generateTicker(fullName, holdings.length),
          });
        }
      }

      i = j;
    } else {
      i++;
    }
  }

  return holdings;
}

/**
 * 파싱 결과 정제 — 중복 제거, 유효성 검증
 */
export function cleanParsedHoldings(holdings: ParsedHolding[]): ParsedHolding[] {
  // 중복 종목명 제거 (동일 이름이면 나중 것 우선)
  const seen = new Map<string, ParsedHolding>();
  for (const h of holdings) {
    const key = h.name.replace(/\s+/g, '').toLowerCase();
    seen.set(key, h);
  }

  return Array.from(seen.values()).filter(h => {
    // 유효성 검증
    return h.shares > 0 && h.avgPrice > 0 && h.name.length > 1;
  });
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { businessNumber } = await request.json();

    if (!businessNumber) {
      return NextResponse.json(
        { error: '사업자등록번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NTS_API_KEY;

    if (!apiKey) {
      console.error('NTS_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const cleanedNumber = businessNumber.replace(/[^0-9]/g, '');

    if (cleanedNumber.length !== 10) {
      return NextResponse.json(
        { error: '사업자등록번호는 10자리여야 합니다.' },
        { status: 400 }
      );
    }

    // Build URL with query parameters
    const url = new URL('https://api.odcloud.kr/api/nts-businessman/v1/status');
    url.searchParams.append('serviceKey', apiKey);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Infuser ${apiKey}`,
      },
      body: JSON.stringify({
        b_no: [cleanedNumber],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || '사업자등록번호 인증에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Business verification error:', error);

    return NextResponse.json(
      { error: '사업자등록번호 인증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

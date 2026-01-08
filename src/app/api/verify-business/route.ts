import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

    const response = await axios.post(
      'https://api.odcloud.kr/api/nts-businessman/v1/status',
      {
        b_no: [cleanedNumber]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Infuser ${apiKey}`
        },
        params: {
          serviceKey: apiKey
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Business verification error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || '사업자등록번호 인증에 실패했습니다.' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: '사업자등록번호 인증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

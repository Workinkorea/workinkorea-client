'use client';

import { useState } from 'react';
import { FileText, Edit, Search, Users } from 'lucide-react';
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import {
  ServiceCard,
  JobInfo,
  CompanyRegistration,
  CityJobPromotion,
  AsiaJobPromotion
} from "@/components/homepage";

export default function Home() {
  const [headerType, setHeaderType] = useState<'homepage' | 'business'>('homepage');

  const handleToggleType = () => {
    setHeaderType(prev => prev === 'homepage' ? 'business' : 'homepage');
  };

  const sampleJobData = [
    {
      name: "김**",
      age: 25,
      location: "여성",
      experience: "경력 1년 2개월",
      tags: ["대학교", "졸업", "학적처"]
    },
    {
      name: "권**",
      age: 26,
      location: "여성",
      experience: "경력 1년 2개월",
      tags: ["대학교", "졸업", "학적처"]
    },
    {
      name: "이**",
      age: 27,
      location: "남성",
      experience: "경력 2개월",
      tags: ["대학교", "졸업", "학적처"]
    },
    {
      name: "최**",
      age: 20,
      location: "남성",
      experience: "경력 6년 11개월",
      tags: ["정보", "부등록일", "사무원"]
    },
    {
      name: "배**",
      age: 33,
      location: "여성",
      experience: "경력 7년 9개월",
      tags: ["대학교", "졸업", "학적처"]
    },
    {
      name: "지**",
      age: 28,
      location: "남성",
      experience: "경력 1년 7개월",
      tags: ["대학교", "졸업", "학적처"]
    },
    {
      name: "윤**",
      age: 28,
      location: "남성",
      experience: "경력 2개월",
      tags: ["카테고리", "부등록일", "관리자"]
    },
    {
      name: "홍**",
      age: 24,
      location: "남성",
      experience: "경력 6년 11개월",
      tags: ["미디어", "부등록일", "사무원"]
    },
    {
      name: "김**",
      age: 27,
      location: "남성",
      experience: "경력 8개월",
      tags: ["베트남어", "구직활동", "관리자"]
    }
  ];

  return (
    <Layout>
      <Header type={headerType} onToggleType={handleToggleType} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <ServiceCard
            icon={FileText}
            title="채용공고 등록가이드"
            description="채용공고 등록을 위한 가이드 제공"
          />
          <ServiceCard
            icon={Edit}
            title="채용공고 등록하기"
            description="회원가입(기업) 후 채용공고 등록하기"
          />
          <ServiceCard
            icon={Search}
            title="인재 검색하기"
            description="기업 맞춤 인재정보 또는 원하는 인재 찾기"
          />
          <ServiceCard
            icon={Users}
            title="지원자 관리"
            description="공고에 지원자 현황 서류심사, 면접 관리"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">실시간 인재정보</h2>
              <button className="text-blue-500 text-sm hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                실시간 인재정보 바로가기 →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleJobData.map((person, index) => (
                <JobInfo
                  key={index}
                  name={person.name}
                  age={person.age}
                  location={person.location}
                  experience={person.experience}
                  tags={person.tags}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <CompanyRegistration />
            <CityJobPromotion />
            <AsiaJobPromotion />
          </div>
        </div>
      </main>
    </Layout>
  );
}

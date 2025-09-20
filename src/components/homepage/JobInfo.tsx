import React from 'react';

interface JobInfoProps {
  name: string;
  age: number;
  location: string;
  experience: string;
  tags: string[];
  className?: string;
}

export const JobInfo = ({
  name,
  age,
  location,
  experience,
  tags,
  className = ''
}: JobInfoProps) => {
  return (
    <div className={`bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">
            {name} <span className="text-sm font-normal text-gray-500">{age}세 ({location})</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">{experience}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-600 border border-blue-100"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JobInfo;
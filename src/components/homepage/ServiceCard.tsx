import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  className = ''
}: ServiceCardProps) => {
  return (
    <div className={`bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default ServiceCard;
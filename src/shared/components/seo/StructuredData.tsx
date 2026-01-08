import { siteConfig } from '@/shared/lib/metadata';

interface WebsiteSchemaProps {
  url?: string;
  name?: string;
  description?: string;
}

export function WebsiteSchema({
  url = siteConfig.url,
  name = siteConfig.name,
  description = siteConfig.description
}: WebsiteSchemaProps = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "description": description,
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/images/logo.png`,
    "sameAs": [
      "https://www.facebook.com/workinkorea",
      "https://www.instagram.com/workinkorea",
      "https://www.linkedin.com/company/workinkorea"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Korean", "English"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface JobPostingSchemaProps {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  employmentType?: string;
  datePosted: string;
  validThrough?: string;
}

export function JobPostingSchema({
  title,
  description,
  company,
  location,
  salary,
  employmentType = "FULL_TIME",
  datePosted,
  validThrough
}: JobPostingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": title,
    "description": description,
    "hiringOrganization": {
      "@type": "Organization",
      "name": company
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location,
        "addressCountry": "KR"
      }
    },
    "baseSalary": salary ? {
      "@type": "MonetaryAmount",
      "currency": "KRW",
      "value": {
        "@type": "QuantitativeValue",
        "value": salary
      }
    } : undefined,
    "employmentType": employmentType,
    "datePosted": datePosted,
    "validThrough": validThrough
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
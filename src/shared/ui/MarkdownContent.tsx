import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  children: string;
}

export function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <div className="max-w-none text-body-2 text-slate-700 leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-title-1 font-bold text-slate-900 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-title-2 font-bold text-slate-900 mt-6 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-title-3 font-semibold text-slate-800 mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-body-2 text-slate-700 mb-4 leading-relaxed">{children}</p>,
          hr: () => <hr className="border-slate-200 my-6" />,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-body-2 text-slate-700 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-body-2 text-slate-700 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-body-2 text-slate-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
          a: ({ href, children }) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

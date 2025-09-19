import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface LayoutComponent extends React.FC<LayoutProps> {
  Main: typeof LayoutMain;
}

const Layout: LayoutComponent = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {children}
    </div>
  );
};


const LayoutMain = ({ children, className = '' }: LayoutProps) => {
  return (
    <main className={`flex-1 ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </main>
  );
};


Layout.Main = LayoutMain;

export default Layout;
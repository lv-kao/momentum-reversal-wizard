
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:px-6 max-w-screen-2xl">
        {children}
      </main>
      <footer className="border-t py-4 px-4 md:px-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row max-w-screen-2xl">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Momentum Reversal Wizard. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Alpha Factor: -rank(ts_sum((close-low)/(high-close),3)) * rank(ts_delta(close,3))
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

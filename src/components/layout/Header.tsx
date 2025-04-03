
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 mr-4" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Momentum Reversal Wizard</span>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary" 
                  onClick={() => navigate('/')}>
            Dashboard
          </Button>
          <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary" 
                  onClick={() => navigate('/ranking')}>
            Stock Ranking
          </Button>
          <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary" 
                  onClick={() => navigate('/analytics')}>
            Factor Analytics
          </Button>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Import Data
          </Button>
          <Button size="sm">
            Calculate Alpha
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

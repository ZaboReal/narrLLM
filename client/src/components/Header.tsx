import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-card text-card-foreground shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">مُحلل سلاسل الحديث</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;

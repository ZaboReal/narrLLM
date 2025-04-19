import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-card text-card-foreground shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Hadith Narrator Visualizer</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">Build and visualize chains of hadith narration</div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;

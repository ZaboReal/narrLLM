import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card text-card-foreground py-4 shadow-inner mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} محلل سلاسل الحديث - أداة لتحليل سلاسل الرواة</p>
      </div>
    </footer>
  );
};

export default Footer;

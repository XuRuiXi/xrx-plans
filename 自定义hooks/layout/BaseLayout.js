import React from "react";
import initTheme from '@/hooks/useTheme';

// 初始化主题
initTheme(theme => {
  document.documentElement.setAttribute('data-theme', theme);
});

const BaseLayout = ({ children }) => {
  return (
    <div className="root">
      {children}
    </div>
  );
};

export default BaseLayout;

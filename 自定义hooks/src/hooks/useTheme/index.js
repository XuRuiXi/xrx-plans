import { useState } from 'react';

// 主题媒体查询
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// 获取本地存储的主题
const getLocalTheme = () => localStorage.getItem('theme') || 'light';
// 获取本地存储的是否跟随系统主题
const getLocalFollowSystem = () => localStorage.getItem('followSystem') || 'Y';


// js监听主题事件
function matchMediaChangeTheme(e) {
  console.log('系统主题变化了', e);
  initTheme();
}

// 解绑主题事件
function unbindMatchMediaChangeTheme() {
  mediaQuery.removeEventListener('change', matchMediaChangeTheme);
}

// 设置是否跟随系统
function useFollowSystem() {
  const [followSystem, setFollowSystem] = useState(getLocalFollowSystem());
  return [
    followSystem,
    (checked) => {
      setFollowSystem(checked);
      // 存入本地存储
      localStorage.setItem('followSystem', checked);
      // 重置主题
      initTheme();
    }
  ];
}
// 设置主题颜色
function useTheme() {
  const [localTheme, setLocalTheme] = useState(getLocalTheme());
  return [
    localTheme,
    (theme) => {
      setLocalTheme(theme);
      // 存入本地存储
      localStorage.setItem('theme', theme);
      // 重置主题
      initTheme();
    }
  ];
}

const defaultCallback = theme => {
  document.documentElement.setAttribute('data-theme', theme);
};


// 初始化主题
const initTheme = (callback) => {
  // 解决重复初始化主题后，回调函数丢失的问题
  callback = callback || window.initThemeCallback || defaultCallback;
  window.initThemeCallback = callback;

  // 每次初始化都会解绑主题事件
  unbindMatchMediaChangeTheme();

  // 判断是否设置了跟随系统主题
  const followSystem = getLocalFollowSystem();

  // 跟随系统主题(那么就只使用系统的主题，不影响本地存储的主题)
  if (followSystem === 'Y') {
    // 然后获取系统主题
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';
    // 监听系统主题变化，如果系统主题变化了，就更新本地存储的主题
    mediaQuery.addEventListener('change', matchMediaChangeTheme);
    callback(systemTheme);
  }

  // 不跟随系统主题逻辑
  if (followSystem !== 'Y') {
    // 本地存储的主题
    const localTheme = getLocalTheme();
    callback(localTheme);
  }
};

export {
  initTheme as default,
  useFollowSystem,
  useTheme,
};

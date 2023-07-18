### 自定义hooks


#### useCountdown

倒计时hook
- 使用requestAnimationFrame实现，更加流畅的倒计时效果。
  - requestAnimationFrame刷新次数会自动根据浏览器的刷新频率进行调整，并且函数在浏览器每一次的重绘之前执行，因此动画效果更加流畅。但是当浏览器处于后台标签页或者隐藏的iframe中时，requestAnimationFrame会暂停调用，因此不会占用过多的CPU时间。
- 基于对比两次浏览器Date对象相减进行计算，相对于使用剩余时间的减少来计算倒计时，更加精确。



**接受参数**
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| initialTime | 初始时间 | number | 10 |
| fixed | 小数点后保留位数 | 0 \| 1 \| 2 \| 3 | 0 |
| auto | 是否自动开始 | boolean | true |
| callback | 倒计时完成/停止结束回调 | (num: number \| string) => void | - |

**返回值**
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| timeLeft | 剩余时间 | number \| string |
| stop | 停止倒计时 | () => void |
| reStart | 重新开始倒计时 | () => void |
| reset | 重置倒计时 | () => void |


```tsx
import React from 'react';
import useCountdown from '@/hooks/useCountdown';

const Home = () => {
  const {
    timeLeft,
    stop,
    reStart,
    reset,
  } = useCountdown({
    initialTime: 5,
    fixed: 3,
    auto: true,
    callback: (num) => {
      console.log(num);
    }
  });
  return (
    <div>
      倒计时：{timeLeft}
      <button style={{ display: 'block' }}>
        <span onClick={stop}>停止</span>
      </button>
      <button style={{ display: 'block' }}>
        <span onClick={reStart}>重启</span>
      </button>
      <button style={{ display: 'block' }}>
        <span onClick={reset}>重置</span>
      </button>
    </div>
  );
};

export default Home;
```


#### useTheme

实现跟随系统主题的主题切换hook

分析：
- 通过CSS的媒体查询

```css
/* 深色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
    color: #fff;
  }
}
/* 明亮模式 */
@media (prefers-color-scheme: light) {
  body {
    background-color: #fff;
    color: #000;
  }
}

```

- 通过link标签切换主题
```html
<link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light)">
<link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)">
```

- 通过js监听系统主题变化
```js
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (e.matches) {
    // dark mode
  } else {
    // light mode
  }
});
```

hooks介绍

- **initTheme**：初始化主题系统，当系统主题变化时，执行设置的回调函数。
```js
import initTheme from '@/hooks/useTheme';
// 初始化主题
initTheme(theme => {
  // dark light
  document.documentElement.setAttribute('data-theme', theme);
});
```

- **useFollowSystem**：可以设置是否跟随系统主题切换，如果跟随了系统，那么useTheme无效。
```js
import { useFollowSystem } from '@/hooks/useTheme';

const Fn = () => {
  const [followSystem, setFollowSystem] = useFollowSystem();
  setFollowSystem('N');
  // followSystem表示是否跟随系统主题，Y表示跟随，N表示不跟随
}
```

- **useTheme**：设置当前的主题，如果跟随了系统主题，那么useTheme无效。
```js
import { useTheme } from '@/hooks/useTheme';

const Fn = () => {
  const [theme, setTheme] = useTheme();
  setTheme('dark');
  // theme表示当前主题，dark表示暗黑模式，light表示明亮模式
}
```

优势：
- 可以自定义主题变化的回调函数，根据不同项目的需求，自定义主题变化的逻辑。
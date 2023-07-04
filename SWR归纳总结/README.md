### **swr归纳总结**

相对于传统的在useEffect中请求数据，swr的优势在于：
- 解决竞态问题
- 更简洁的错误处理
- 自动缓存数据和数据预加载
- 还有更直观的在react18中，开始严格模式下的性能优化


### **基础使用**

```js
import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
// axios
const fetcher1 = url => axios.get(url).then(res => res.data);
// fetch
const fetcher2 = url => fetch(url).then(res => res.json());
// config
const config = {};

const User = () => {
  // mutate用来手动更新缓存
  const { data, error, mutate } = useSWR('/api/name', fetcher1, config);
  console.log(data, error);
  return (
    <div>
      User
    </div>
  );
};

export default User;
```


### **全局配置**

<a href="https://swr.vercel.app/zh-CN/docs/global-configuration">官网配置</a>

```js
import React from 'react';
import axios from 'axios';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';

const fetcher = url => axios.get(url).then(res => res.data);

function Dashboard () {
  const config = useSWRConfig(); // 获取全局配置
  const { data, error } = useSWR('/api/name?name=312');
  console.log(data, error);
}

const User = () => {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (err) => {
          console.log(err);
        },
      }}
    >
      <Dashboard />
    </SWRConfig>
  );
};

export default User;

```


### **条件数据请求**

- 按需请求

使用 null(false) 或传一个函数作为 key 来有条件地请求数据。如果函数抛出错误或返回 falsy 值，SWR 将不会启动请求。

```js
import React from 'react';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data);

const shouldFetch1 = true;
const shouldFetch2 = false;

const User = () => {
  // 发送请求
  const { data } = useSWR(shouldFetch1 ? '/api/name' : null, fetcher);
 
  // 不发送请求
  const { data } = useSWR(() => shouldFetch2 ? '/api/name2' : '', fetcher);
 
  // 不发送请求，因为没有函数抛出错误
  const { data } = useSWR(() => '/api/data?uid=' + user.id, fetcher);

  return (
    <div>
      User
    </div>
  );
};

export default User;
```

- 依赖请求

SWR 还允许请求依赖于其他数据的数据。当需要一段动态数据才能进行下一次数据请求时，它可以确保最大程度的并行性（avoiding waterfalls）以及串行请求。

```js
import React from 'react';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data);

const User = () => {
  // 发送请求
  const { data: user } = useSWR('/api/name?name=xrx', fetcher);

  const { data } = useSWR(() => '/api/name?name=666' + user.name, fetcher);

  return (
    <div>
      User
    </div>
  );
};

export default User;
```



### 数据更改 / 重新验证

- 全局 **mutate** / 自身的 **mutate**

```js
import React from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';

const fetcher = url => axios.get(url).then(res => res.data);

const Reload = () => {
  return (
    <div>
      <button
        onClick={() => {
          // 全局 mutate
          mutate('/api/name?name=xrx');
        }}
      >
        重新发送请求
      </button>
    </div>
  );
};

const User = () => {
  // mutate函数用来手动更新缓存
  const { data: user, /* mutate */ } = useSWR('/api/name?name=xrx', fetcher);
  return (
    <div>
      User
      <Reload />
    </div>
  );
};

export default User;
```


- **useSWRMutation**

用法和useSWR一样，但不同的是useSWRMutation不会自动发送请求，需要手动调用trigger方法

```js
import React from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';

const fetcher = (url, { arg }) => axios.get(
  url + '?name=' + arg.name
).then(res => res.data);

const User = () => {
  const { trigger, isMutating, data } = useSWRMutation('/api/name', fetcher);
  return (
    <div>
      User
      <button
        onClick={() => {
          trigger({
            name: 'xrx',
          });
        }}
      >
        发送请求
      </button>
    </div>
  );
};

export default User;
```


### **预请求**

- 使用link标签预请求 rel="preload"

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

- 手动预请求(preload)

```js
import React from 'react';
import { useState } from 'react';
import useSWR, { preload } from 'swr';
 
const fetcher = (url) => fetch(url).then((res) => res.json());
 
preload('/api/name?name=xrx', fetcher);
 
function User() {
  const { data } = useSWR('/api/name?name=xrx', fetcher);
  console.log(data);
  return (
    <div>
      <h1>User：{data?.name}</h1>
    </div>
  );
}
 
export default function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(true)}>Show User</button>
      {show ? <User /> : null}
    </div>
  );
}
```
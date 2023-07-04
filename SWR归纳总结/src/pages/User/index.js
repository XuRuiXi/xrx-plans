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
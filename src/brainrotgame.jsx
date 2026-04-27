

import React, { useState } from 'react';
import brainrot from './brainro1.png';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  function handleReset() {
    setCount(0);
  }

  return (
    <div>
      <h1>Brainrot Clicker</h1>

      <p>Clicks: {count}</p>

      <button onClick={handleClick}>Click me!</button>
      <button onClick={handleReset}>Reset</button>

      {count > 10 && (
        <img src={brainrot} alt="brainrot" width="200" />
      )}
    </div>
  );
}
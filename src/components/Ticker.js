import React from 'react';

const Ticker = ({ products = [] }) => {
  const names = products.map((p) => p.name);
  const loop = [...names, ...names];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {loop.map((name, i) => (
          <React.Fragment key={i}>
            <span>{name}</span>
            <i>✦</i>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Ticker;

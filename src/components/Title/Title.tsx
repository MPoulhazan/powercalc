import React from 'react';
import './Title.scss';

interface TitleProps {
  className?: string;
}

const Title: React.FC<TitleProps> = ({ className = '' }) => {
  return (
    <h1 className={`title ${className}`}>
      <span className="title__text">Power</span>
      <span className="title__accent">Calc</span>
    </h1>
  );
};

export default Title;

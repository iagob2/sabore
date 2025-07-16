import React from 'react';

export const Carousel: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CarouselContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CarouselItem: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CarouselNext: React.FC<any> = (props) => <button {...props}>Next</button>;
export const CarouselPrevious: React.FC<any> = (props) => <button {...props}>Prev</button>; 
// src/Spinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 24, className = '' }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <Loader2 className="animate-spin" width={size} height={size} />
  </div>
);

export default Spinner;

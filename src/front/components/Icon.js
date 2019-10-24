import React from 'react';

export default function Icon({faIcon, className: className_=''}) {
  const className = `fa fa-${faIcon} ${className_}`;
  
  return (
    <i className={className} />
  )
}
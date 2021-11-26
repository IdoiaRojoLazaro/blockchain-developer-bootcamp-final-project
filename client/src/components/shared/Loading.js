import React from 'react';
import { Spinner } from 'phosphor-react';

export const Loading = () => {
  return (
    <div className="loading">
      <Spinner weight="duotone" size={60}>
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="4s"
          repeatCount="indefinite"
        ></animate>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="5s"
          from="0 0 0"
          to="360 0 0"
          repeatCount="indefinite"
        ></animateTransform>
      </Spinner>
    </div>
  )
}

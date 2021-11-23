import React from 'react';
import TypeWriterEffect from 'react-typewriter-effect';

export const Title = () => {
  return (
    <div className="title-website">
      <TypeWriterEffect
        textStyle={{ fontFamily: 'Cutive' }}
        startDelay={100}
        cursorColor="black"
        text="The lazy corner"
        typeSpeed={100}
      />
    </div>
  );
};

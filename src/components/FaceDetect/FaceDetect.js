import React from 'react';

const FaceDetect = ({ imageURL }) => {
  return(
    <div className='center ma'>
      <div className='absolute mt2'>
        <img
          alt='daface'
          src={imageURL}
          width='500'
          height='auto'
        />
      </div>
    </div>
  );
};

export default FaceDetect;

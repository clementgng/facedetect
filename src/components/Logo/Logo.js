import React from 'react';
import Tilt from 'react-tilt';


const Logo = () => {
  return(
    <div className='tl ma4 mt0'>
      <Tilt className="Tilt br1 shadow-3" options={{ max : 100 }} style={{ height: 125, width: 125 }} >
        <div className="Tilt-inner pa2">
           <img
           style={{paddingTop: '5px'}}
             alt='Logo'
             src='https://png.icons8.com/ios/100/000000/brain.png'
             width='100'
             height='100'
           />
        </div>
      </Tilt>

    </div>
  );
}

export default Logo;

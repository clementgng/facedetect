import React from 'react';
import './InputLinkBG.css';

const InputLink = ({ inputText, clickedDetect }) => {
  return(
    <div>
      <p className='f3'>
        {'This web application will detect faces in the pictures you give it'}
      </p>
      <div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          <input
            className='f3 w-70 pa3'
            type='tex'
            placeholder='Insert Image URL here'
            onChange={inputText}
          />
          <button
            onClick={clickedDetect}
            className='pa3 w-30 grow f3 link ph3 pv2 dib white bg-light-purple shadow-5'>Detect</button>
        </div>
      </div>
    </div>
  );
};

export default InputLink;

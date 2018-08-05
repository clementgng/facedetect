import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import InputLink from './components/InputLink/InputLink';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceDetect from './components/FaceDetect/FaceDetect';

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: '66684afaa11e4d89ada0d60bbdb3245c'
});

class App extends Component {
  constructor() {
    super()
    this.state = {
      inputurl: '',
      submittedImage: ''
    }
  }

  onInputChange = (event) => {
    this.setState({inputurl: event.target.value});
  }



  onClick = () => {
    this.setState({submittedImage: this.state.inputurl})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.inputurl).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
      },
      function(err) {
        // there was an error
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <InputLink inputText={this.onInputChange} clickedButton={this.onClick}/>
        <FaceDetect imageURL={this.state.submittedImage}/>
      </div>
    );
  }
}

export default App;

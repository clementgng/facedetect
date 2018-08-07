import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import InputLink from './components/InputLink/InputLink';
import SignIn from './components/SignIn/SignIn';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceDetect from './components/FaceDetect/FaceDetect';
import Register from './components/SignUp/Register';

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
      submittedImage: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({inputurl: event.target.value});
  }


  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimg');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return{
      leftCol: face.left_col*width,
      topRow: face.top_row*height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  createFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }


  onClick = () => {
    this.setState({submittedImage: this.state.inputurl})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.inputurl)
    .then((response) => {
        this.createFaceBox(this.calculateFaceLocation(response));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, submittedImage, box, route} = this.state
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
            <Logo />
            <Rank />
            <InputLink inputText={this.onInputChange} clickedButton={this.onClick}/>
            <FaceDetect box={box} imageURL={submittedImage}/>
          </div>
          : (
            route === 'signin' || route === 'signout'
            ? <div>
                <Logo />
                <SignIn isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
            </div>
            : <div>
                <Logo />
                <Register onRouteChange={this.onRouteChange}/>
            </div>
        )

        }
      </div>
    );
  }
}

export default App;

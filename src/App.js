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
  /*
  Need- image input URL for user to type in
  submitted image URL to capture URL when user presses 'Detect'
  box to get parameters of bounding bax for face detection
  route- think as a FSM with states signin, signout, home, signup
  isSignedIn- boolean to check if user is signed in or not to display signout/signup signup
  */
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

  // change inputurl to be whatever is in searchbox
  onInputChange = (event) => {
    this.setState({inputurl: event.target.value});
  }


  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    /* grab the image from FaceDetect.js since it is added to the DOM tree and calculate the
    coordinates for the box*/
    const image = document.getElementById('inputimg');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: face.left_col*width,
      topRow: face.top_row*height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  // create the box coordinates for the face
  createFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  /*on clicking the mouse fetch the API
  calculate the coordinates from the response we get
  create the box based off those coordinates*/
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

  /*Change if we are signed out or in based off the route FSM and also Change
  where we are in the route FSM here*/
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

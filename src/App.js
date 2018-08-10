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
      isSignedIn: false,
      user: { // create user profile
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  /*componentDidMount() {
    fetch('http://localhost:3001')
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data);
      })
  }*/

  // change inputurl to be whatever is in searchbox
  onInputChange = (event) => {
    this.setState({inputurl: event.target.value});
  }

  loadUser = (userInfo) => {
    this.setState({
      user: {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        entries: userInfo.entries,
        joined: userInfo.joined
      }
    })
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
  onClickedDetect = () => {
    this.setState({submittedImage: this.state.inputurl})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.inputurl)
    .then((response) => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            // this.state.user is the target Object
            // update entries key with count value in target object 
            this.setState(Object.assign(this.state.user, { entries: count }))
          })

        }
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
    const { isSignedIn, submittedImage, box, route, user} = this.state
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <InputLink inputText={this.onInputChange} clickedDetect={this.onClickedDetect}/>
            <FaceDetect box={box} imageURL={submittedImage}/>
          </div>
          : (
            route === 'signin' || route === 'signout'
            ? <div>
                <Logo />
                <SignIn loadUser={this.loadUser} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
            </div>
            : <div>
                <Logo />
                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            </div>
        )

        }
      </div>
    );
  }
}

export default App;

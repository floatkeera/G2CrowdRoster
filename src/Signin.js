import React, {Component} from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth, googleProvider } from './utils/api'


class Signin extends Component{
	// Configure FirebaseUI.
  	uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      {provider: googleProvider,
      customParameters: {
        // Forces account selection even when one account
        // is available.
        hd: 'g2crowd.com'
      }
    }],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    },
  };

 

	render() {
		return (
			<div className = "signin">
			<div className= "signinbox">
				<h1>Welcome to the Crowd</h1>
				<h2>Learn about our amazing people.</h2>
          		<h3>Sign in with your G2 Crowd account.</h3>
          		<StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
          		<a id="skip" onClick={this.props.handleClick}>Skip for now</a>
          </div>
          </div>
          )
	}

}

export default Signin
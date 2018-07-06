import React, { Component } from 'react';
import firebase from 'firebase'
import { getMembers, db, auth } from './utils/api'
import logo from './assets/logo.png'
import { Nav, Navbar, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom'
import { BeatLoader } from 'react-spinners';
import Signin from './Signin'
import Roster from './Roster'
import Profile from './Profile'
import Member from './Member'

class App extends Component {

  state = {
    membersArray: null,
    signedIn: false,
    user: null,
    loading: true,
    photoURL: null,
    uid: null,
    newUser: false
  }
  
   anon = ()=> {
    this.setState({loading: true});
    auth.signInAnonymously().catch((error) => console.warn(error))
  }
  

  componentDidMount(){
    this.unregisterAuthObserver = auth.onAuthStateChanged(
        (user) => {
          if(user){
            this.checkProfile();
          } else{
            this.setState({signedIn: false, loading: false})
          }
          
        }
    );
  }

  endLoading = () => {
    var user = auth.currentUser;
    this.setState({signedIn: true, user: user.displayName, loading: false, photoURL:  user.photoURL, uid:  user.uid})
  }

  checkProfile = () => {
    var user = auth.currentUser;
    var userRef = db.ref(`users/${user.uid}`);
    userRef.once('value', (snapshot) => {

      if(!snapshot.exists() && user.displayName){
        this.setState({newUser: true})
        userRef.set({
          name: user.displayName,
          bio: '',
          count: 0,
          image_url: user.photoURL,
          title: ''
        }, this.endLoading())
      } else{
        this.endLoading()
      }
    })
  }

  


   // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    
    console.log(this.state.user)


    return (
      <Router>
      <div className="App">
        {/*Fixed menu bar at the top*/}
        <header> 
          <Navbar fixedTop>
            <Navbar.Header>
              <Link to="/roster">
              <Navbar.Brand>
                <img src={logo} alt="" className="logo"/>
                Roster
              </Navbar.Brand> 
              </Link>
              {this.state.signedIn && <Navbar.Toggle/>}
            </Navbar.Header> 
            {this.state.signedIn &&
              <Navbar.Collapse>
                <Nav pullRight>
                  {(this.state.user)&& <LinkContainer to="/profile"><NavItem><span><img id="profilepic" src={this.state.photoURL} alt=""/> {this.state.user}</span></NavItem></LinkContainer>}
                 <MenuItem onClick={() => auth.signOut()}>Log Out</MenuItem>
                </Nav>
              </Navbar.Collapse>
            }
          </Navbar>
        </header>
          

        {/*Loader*/}

          {this.state.loading && 
            <div id="loader">
              <BeatLoader
                loading={this.state.loading}
                color={'#1976D2'}/>
            </div>}


          {!this.state.loading && 
            
              
              <div className="body"> 
                <PrivateRoute exact path='/roster' authed={this.state.signedIn}  component={Roster} uid={this.state.uid} registered={this.state.user} />
                <PrivateRoute exact path ='/profile' authed={this.state.signedIn} component={Profile} uid={this.state.uid} username={this.state.user} newUser={this.state.newUser}></PrivateRoute>
                <PublicRoute exact path='/' authed={this.state.signedIn} handleClick={this.anon} component={Signin} newUser={this.state.newUser}/>
              </div>  
           
          }

      </div>

       </Router>
    );
  }

}

function PrivateRoute ({component: Component, authed, ...rest}) {

    const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
      React.createElement(component, finalProps)
    );
  }

  return (
    <Route
      {...rest}
      render={(routeProps) => authed === true
        ? renderMergedProps(Component, routeProps, rest)
        : <Redirect to={{pathname: '/', state: { from: routeProps.location }}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, newUser, ...rest}) {
    const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
      React.createElement(component, finalProps)
    );
  }
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ?  renderMergedProps(Component, props, rest)
        : <Redirect to={newUser ? '/profile': '/roster' }/>}
    />
  )
}


export default App;

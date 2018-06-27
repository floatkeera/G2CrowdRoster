import React, { Component } from 'react';
import firebase from 'firebase'
import { getMembers, db, auth } from './utils/api'
import Member from './Member'
import logo from './assets/logo.png'
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import Signin from './Signin'

class App extends Component {

  state = {
    membersArray: null,
    signedIn: false,
    user: null,
    loading: true,
    photoURL: null,
    uid: null,
  }
  
   anon = ()=> {
    this.setState({loading: true});
    auth.signInAnonymously().catch((error) => console.warn(error))
  }
  

  async componentDidMount(){
    this.unregisterAuthObserver = auth.onAuthStateChanged(
        (user) => this.setState({signedIn: !!user, user: user && user.displayName, loading: false, photoURL: user && user.photoURL, uid: user && user.uid})
    );

    const membersArray = await getMembers();

    await membersArray.forEach(function({name}){
      var ref = db.ref(`members/${name}`);
      ref.once("value").then((snapshot)=>{
        !snapshot.exists() && ref.set({
          count: 0
        }, function(error){
          if (error){
            console.warn(error)
          } else{

          }
        })
      })
    });

    this.setState(() => ({membersArray}));
  }

   // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (

      <div className="App">
        <header>

        <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <img src={logo} alt="" className="logo"/>
            Team Roster
          </Navbar.Brand> 
          {this.state.signedIn && <Navbar.Toggle/>}
        </Navbar.Header> 


        
        {/*<div className="header">
          Team Roster
        </div>*/}

      

      {this.state.signedIn &&
        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown  id= "logout" title={<span>
              
            <img id="profilepic" src={this.state.photoURL} alt=""/> {this.state.user}</span>}>
              <MenuItem onClick={() => auth.signOut()}>Log Out</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      }

        </Navbar>
        


        </header>

        <div className="body">  

        {this.state.loading && <div id="loader"><BeatLoader
            loading={this.state.loading}
            color={'#1976D2'}/></div>}
        {!this.state.loading && !this.state.signedIn && <Signin handleClick = {this.anon}/>}
        {!this.state.loading && this.state.signedIn && this.state.membersArray!=null && 
          (<div className="main">
           
            {this.state.membersArray.map(({ name, image_url, title, bio }) => <Member key={name} name={name} image_url={image_url} title={title} bio={bio} uid={this.state.uid}/>)}

          </div>)}

          </div>
      </div>
    );
  }
}

export default App;

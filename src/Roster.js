import React, { Component } from 'react';
import firebase from 'firebase'
import { getMembers, db, auth } from './utils/api'
import { BeatLoader } from 'react-spinners';
import Member from './Member'
import { Panel } from 'react-bootstrap';

class Roster extends Component{

	state={
		membersArray: [],
		loading: true
	}

	ref = db.ref('users');

	componentDidMount(){
		this.setState({membersArray: []});
		
		var members = []
		this.ref.once('value', (snapshot) => {
			snapshot.forEach((childSnapshot) =>{
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				members.push({
					key: childKey,
					name: childData.name,
					bio: childData.bio,
					image_url: childData.image_url,
					title: childData.title
				})

				
				console.log(this.props.uid)
			});
			
			this.setState({
						loading: false,
						membersArray: members
					})

			});
		
	}

	componentWillUnmount = () => {
		this.ref.off();
	}

	render(){
		return(
		
			
			
			<div className="main">


			{this.state.loading && 
	            <div id="loader">
	              <BeatLoader
	                loading={this.state.loading}
	                color={'#1976D2'}/>
	            </div>}

	        {!this.props.registered && 
	        	<Panel bsStyle="warning">
	        		<Panel.Heading>
	        			<Panel.Title componentClass="h3">View-only Mode</Panel.Title>
	        		</Panel.Heading>
	        		<Panel.Body>Log in using your G2 Crowd account for full functionality.</Panel.Body> 	
	        	</Panel>}
	        	{this.state.membersArray.map(({ key, name, image_url, title, bio }) => <Member key={key} fbKey={key} name={name} image_url={image_url} title={title} bio={bio} uid={this.props.uid} registered={this.props.registered}/>)}
	        
			
			</div>
		
		)
	}
	



}

export default Roster
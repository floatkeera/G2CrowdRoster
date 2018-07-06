import React, { Component } from 'react';
import firebase from 'firebase'
import { getMembers, db, auth } from './utils/api'
import { BeatLoader } from 'react-spinners';
import Member from './Member'
import { Panel } from 'react-bootstrap';
import Masonry from 'react-masonry-component';


const masonryOptions = {
    fitWidth: true,
    itemSelector: '.member-row'
};

const btnclass = "edit-button filter"

class Roster extends Component{

	
	
	deptArray=['all hands', 'executive', 'corporate', 'product', 'research', 'marketing', 'sales', 'customer success'];

	state={
		membersArray: [],
		loading: true,
		filter: "all hands"
	}

	ref = db.ref('users');

	reloadMasonry = ()=>{
		console.log("clicked")
		this.masonry.layout();
	}

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
					title: childData.title,
					dept: childData.dept
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
			
			<div className="filter">
				<h1>Filter by team</h1>
				<div className="filter-row">
					{this.deptArray.map((dept) => <div onClick={() => this.setState({filter: dept})} className={btnclass + ((this.state.filter===dept) ? " active" : "")}>{dept}</div>)}
				</div>
			</div>
			

			{this.state.loading && 
	            <div id="loader">
	              <BeatLoader
	                loading={this.state.loading}
	                color={'#1976D2'}/>
	            </div>}

	        {!this.props.registered && 
	        	<Panel bsStyle="warning" id="warning-panel">
	        		<Panel.Heading>
	        			<Panel.Title componentClass="h3">View-only Mode</Panel.Title>
	        		</Panel.Heading>
	        		<Panel.Body>Log in using your G2 Crowd account for full functionality.</Panel.Body> 	
	        	</Panel>}
	        	


				<Masonry ref={function(c) {this.masonry = this.masonry || c.masonry;}.bind(this)} options={masonryOptions} className="mason">
	        	{this.state.membersArray.map(({ key, name, image_url, title, bio, dept }) => {
					if(this.state.filter==="all hands" || this.state.filter === dept){
	        			return <Member dept={dept} handleResize={this.reloadMasonry} key={key} fbKey={key} name={name} image_url={image_url} title={title} bio={bio} uid={this.props.uid} registered={this.props.registered}/>}})}
	        	</Masonry>
			
			</div>
		
		)
	}
	



}

export default Roster
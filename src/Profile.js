import React, { Component } from 'react';
import { getMembers, db, auth } from './utils/api'
import {Glyphicon, Modal } from 'react-bootstrap'
import { Form, Text, TextArea } from 'informed'
import { BeatLoader } from 'react-spinners';
class Profile extends Component{
	
	fbuser = auth.currentUser;	
	userRef = db.ref(`users/${this.fbuser.uid}`)

	state= {
		editMode: this.props.newUser,
		newUser: this.props.newUser,
		name: null,
		title: null,
		bio: null,
		image_url: null,
		loading: false
	}

	componentDidMount(){
		this.userRef.on('value', (snapshot) =>{
			var user = snapshot.val();
			this.setState(user)
		})
	}
	

	handleEditClick = () =>{
		this.setState({
			editMode: !this.state.editMode
		})
	}

	handleFormClick = () => {
		this.setState({loading: true})
		var formVals = this.formApi.getState().values;
		this.userRef.update(formVals, () =>{
			this.fbuser.updateProfile({displayName: formVals.name}).then( () =>{
			this.state.newUser && window.location.reload();
			this.state.newUser&& this.props.history.push('/roster');
			this.setState({
				editMode: false,
				loading: false,
				newUser: false
			})
			}
		)})

	}

	setFormApi = (formApi) =>{
		this.formApi = formApi;
	}

	render() {
		

		return (
			<div className="profile">

			<Modal show={this.state.editMode} onHide={this.handleEditClick}>
				

				<Modal.Header closeButton={this.state.newUser? false : true}>
					<Modal.Title componentClass="h2">
					{this.state.newUser? "Welcome! Let's make your profile." : "Edit your profile"}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<div style={{textAlign: "center"}}><BeatLoader
                loading={this.state.loading}
                color={'#1976D2'}/></div>
				

				{!this.state.loading && this.state.editMode && <Form getApi={this.setFormApi}>
					<h3>Name</h3>
					<Text field="name" id="form-name" initialValue={this.state.name || this.fbuser.displayName}/>
					<h3>Title</h3>
					<Text field="title" id="form-title" initialValue={this.state.title}/>
					<h3>Bio</h3>
					<TextArea field="bio" initialValue={this.state.bio}/>
					
				</Form>}

				</Modal.Body>
				<Modal.Footer>
				<button type="submit" className="edit-button save" onClick={this.handleFormClick}><Glyphicon id="save-icon" style = {{
						'marginBottom': '3px',
						'marginRight': '10px',
						'color': "#330867"
					}}glyph="floppy-save"></Glyphicon>Save</button></Modal.Footer>

			</Modal>
				
				<div className="profile-header">
					<img className="big-profile-pic" src={this.state.image_url} alt=""/>
					
					<div className="profile-header-text">
						<h1 className="profile-name">{this.state.name}</h1>
						<h2 id="profile-title">{this.state.title}</h2>
					</div>
					<div className="profile-right">
					<div className="edit-button" onClick={this.handleEditClick}>
					<Glyphicon style = {{
						'marginBottom': '3px',
						'marginRight': '10px',
						'color':  "#2980b9"
					}}glyph='edit'></Glyphicon>Edit</div></div>
					
				</div>
				<div className="profile-body">

					<EditProfile bio={this.state.bio} editMode={this.state.editMode}></EditProfile>
					<MyFriends></MyFriends>
				</div>


			</div>
		);
	}

}

class EditProfile extends Component{

	render() {
		return (
			<div className="profile-bio">
				<h2>About me</h2>
				{this.props.bio === ""&& <div style={{textAlign: 'center', fontSize: "16pt"}}>
				<Glyphicon style={{color: "#ffc107", marginRight: "20px"}} bsSize="large" glyph="warning-sign"></Glyphicon>Uh oh, doesn't look like you have a bio yet.</div>}
				{this.props.bio != "" && this.props.bio}
			</div>
		);
	}

}

class MyFriends extends Component{
	render() {
		return (
			<div className="profile-friends">
				<h2>Who wants to work with me?</h2>
			</div>
		);
	}
}

export default Profile
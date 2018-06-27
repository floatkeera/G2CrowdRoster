import React, { Component } from 'react';
import { db } from './utils/api'
import thumbs from './assets/thumbs-up.svg'
import tick from './assets/tick.svg'
import cross from './assets/remove.svg'

class Member extends Component{

	state = {
		votes: 0,
		votable: true,
	}
	
	voteCountRef = null;
	userVoteRef = null;

	handleVote = () =>{

		this.voteCountRef.transaction((count) => {
			if(count!=null){
				count = count + 1;
			}
			return count;
		});

		this.userVoteRef.set(true);

	}

	handleUnVote = () => {
		this.voteCountRef.transaction((count) => {
			if(count!=null){
				count = count - 1;
			}
			return count;
		});

		this.userVoteRef.remove();

	}

	componentDidMount(){
		this.voteCountRef = db.ref(`members/${this.props.name}/count`);
		this.voteCountRef.on('value', (snapshot) =>{
			this.setState(() => ({votes: snapshot.val()}))
		})

		this.userVoteRef = db.ref(`users/${this.props.uid}/${this.props.name}`);
		this.userVoteRef.on('value', (snapshot) =>{
			if(snapshot.exists()){
				this.setState(()=> ({votable: false}));

			} else{
				this.setState(()=> ({votable: true}));
			}
		})

	} 

	componentWillUnMount(){
		this.voteCountRef.off();
		this.userVoteRef.off();
	}

	render() {
		return (
			<div className="member-row">
				<div className="img" style={{backgroundImage: `url(${this.props.image_url})`, backgroundSize: 'cover' }}> 
				</div>
				<Data name={this.props.name} title={this.props.title} bio={this.props.bio} votes={this.state.votes} voteClick={this.state.votable ? this.handleVote : this.handleUnVote} votable={this.state.votable}/> 
				

			</div>
		);
	}
}

class Data extends Component{

	render() {
		return (
			<div className="data">
				<div className="name">{this.props.name}</div>
				<div className="title">{this.props.title}</div>
				<div className="bio">{this.props.bio}</div>
				<VoteRow voteClick={this.props.voteClick} name={this.props.name} votable={this.props.votable}></VoteRow>
				<VoteStats votes={this.props.votes}/>
			</div>
		);
	}

}

class VoteRow extends Component{

	render() {
		return (
			<div className="vote-row">
				<div className="vote-text">{`Want to work with ${this.props.name}?`}</div>
				<VoteButton voteClick={this.props.voteClick} votable={this.props.votable}></VoteButton>
			</div>
		);
	}

}

class VoteButton extends Component{

	state = {
		isHovered: false,
	}

	handleHover = () => {
    	this.setState({
        	isHovered: !this.state.isHovered
   		 });

	}

	render(){

		return(
			<div className="vote-button" onClick={this.props.voteClick} onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
			{this.props.votable ? (
				<div>
				<div className="vote-image">
					<img src={thumbs} alt=""/>
				</div>
				<div className={'vote-yes'}>Yes!</div></div>) :
			
				(<div><div className="vote-tick">
					<img src={this.state.isHovered ? cross : tick} alt=""/>
				</div>
				<div className={'vote-voted'}>{this.state.isHovered ? 'Remove' : 'Voted'}</div></div>)}

		
			</div>	
			)

		
	}
}

class VoteStats extends Component{

	
	
	render() {
		return (
			<div className="vote-stats"><b>{this.props.votes}</b> people have said Yes!</div>
		);
	}
}

export default Member;
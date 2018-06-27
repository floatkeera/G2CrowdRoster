import React from 'react';
import PropTypes from 'prop-types';

var styles={
	content:{
		textAlign: 'center',
		fontSize: '24pt'
	}
};

class Loading extends React.Component{
	constructor(props){
		super(props);

		this.state={
			text: props.text,

		};
	}

	componentDidMount(){
		const {text, interval} = this.props;

		const stopper = text + '...';
		this.interval = window.setInterval(() =>{
			if(this.state.text == stopper){ this.setState(() => ({ text })); //since prop name same as name of variable of value, can omit prop name
			} else{
				this.setState((prevState) => ({text: prevState.text + '.'}));
			}
		}, interval);
	}

	render() {
		return (
			<p id={this.props.id} style={styles.content}>
				{this.state.text}

			</p>
		);
	}

	componentWillUnmount(){ //when the component is removed from the view, we clear the interval listener
		window.clearInterval(this.interval);
	}
}

Loading.propTypes={
	text: PropTypes.string.isRequired,
	interval: PropTypes.number.isRequired

};

Loading.defaultProps={
	text:'Loading',
	interval: 300
};

export default Loading;


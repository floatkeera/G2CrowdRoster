import firebase from 'firebase'


// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

var config = {
	apiKey: "AIzaSyAlBkLiMs9XSF6pYvblERAyDekH0fM90kk",
    authDomain: "g2crowdroster.firebaseapp.com",
    databaseURL: "https://g2crowdroster.firebaseio.com",
    projectId: "g2crowdroster",
    storageBucket: "g2crowdroster.appspot.com",
    messagingSenderId: "240393644415"
}

firebase.initializeApp(config);

export var db = firebase.database();

export const auth = firebase.auth();

export const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;



export async function getMembers(){
	const response = await fetch('https://api.myjson.com/bins/16roa3').catch((err) => console.warn(err));

	return response.json();
}
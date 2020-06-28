import firebase from 'firebase';
import 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfiguration = {
	apiKey: 'AIzaSyC5xPcn__asUk_VlN0sFwJBgQ1WYG9qe6Q',
	authDomain: 'hospitalnow-d2f1b.firebaseapp.com',
	databaseURL: 'https://hospitalnow-d2f1b.firebaseio.com',
	projectId: 'hospitalnow-d2f1b',
	storageBucket: 'hospitalnow-d2f1b.appspot.com',
	messagingSenderId: '492970423389',
	appId: '1:492970423389:web:c3c537680da917bf8c09b4',
	measurementId: 'G-NPV141BT74',
};
firebase.initializeApp(firebaseConfiguration);

export default firebase;

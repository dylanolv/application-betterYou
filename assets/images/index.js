
import ApiKeys from '../../constants/ApiKeys';
import * as firebase from "firebase";

    if (!firebase.apps.length) { 
        firebase.initializeApp(ApiKeys.FirebaseConfig); 
      }

const tabSources = [];

firebase.database().ref("discoveries/").on('value', (snapshot) => {
    let data = snapshot.val();
    let discoveries = Object.values(data);
    
    discoveries.map((item, index) => {
        tabSources.push({
          id: index,
          source: item.image
        })
    })
});

export default tabSources;
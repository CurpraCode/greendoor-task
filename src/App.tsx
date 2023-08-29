import React from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, View, Card, Button } from '@aws-amplify/ui-react';
import Home from './components/Home';

function App({signOut}:any) {
  return (
    <View className="App">
      <Card>
             <Home/>
             <div>
      <Button onClick={signOut}>Sign Out</Button>
      </div>
      </Card>

    </View>
  );
}

export default withAuthenticator(App);

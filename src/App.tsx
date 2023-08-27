import React from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, View, Card } from '@aws-amplify/ui-react';
import Home from './components/Home';

function App() {
  return (
    <View className="App">
      <Card>
             <Home/>
      </Card>

    </View>
  );
}

export default withAuthenticator(App);

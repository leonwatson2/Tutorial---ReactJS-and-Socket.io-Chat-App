import React, { Component } from 'react';
import Layout from './components/Layout'
import './index.css'

/** font awesome libraries **/
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'

library.add(faStroopwafel);

// end font awesome

class App extends Component {
    render() {
    return (
        <Layout />
    );
  }
}

export default App;

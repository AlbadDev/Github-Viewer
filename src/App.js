import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home'
import UserDataFetch from './components/UserDataFetch/UserDataFetch';



function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Home} /> 
          <Route path='/Home' component={Home} />
          <Route patch='/user' component={UserDataFetch} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

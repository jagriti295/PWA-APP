import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import './App.css';
const NavBar = () => (
  <div className="navbar">
    <Link to="/">Feed</Link>
    <Link to="/demo-page">Profile</Link>
    </div>
);
const Template = ({ title }) => (
  <div>
    <NavBar />
    <p className="page-info">
      This is the {title} page.
    </p>
    <button id="btnAdd">Install</button>
  </div>
);
const Feed = (props) => (
  <div>
    <Template title="Feed"/>
    <MyTemplate />
  </div>
);
const Profile = (props) => (
  <div>
    <Template title="Profile"/>
    <MyTemplate />
  </div>
);

const MyTemplate = () => (
  <section>
    <div className="panel" >
      <img src="../myimages/chandler.jpg" className="cardView" />
    </div>
    <div className="panel" >
      <img src="../myimages/monica1.jpg" className="cardView" />
    </div>
    <div className="panel" >
      <img src="../myimages/rachel2.jpeg" className="cardView" />
    </div>
    <div className="panel" >
      <img src="../myimages/ross.jpg" className="cardView" />
    </div>
    <div className="panel" >
      <img src="../myimages/joey.jpg" className="cardView" />
    </div>
    <div className="panel" >
      <img src="../myimages/phoebe.jpg" className="cardView" />
    </div>
  </section>
)

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Feed}/>
        <Route path="/demo-page" component={Profile}/>
      </Router>
    );
  }
}
export default App;
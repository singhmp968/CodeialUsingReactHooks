import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks';
import { Home, Login, Signup, Settings, UserProfile } from '../pages';
import { Loader, Navbar } from './';
function PrivateRoute({ children, ...rest }) {
  // here children will be what ver inside PrivateRoute i.e <Setting />
  const auth = useAuth();
  return (
    <Route
      {...rest} //  this will exact path like '/settings' comming from props
      render={() => {
        if (auth.user) {
          // checking if the user exist then we are returng ti setting route else
          return children; // it will point to setting componenet
        } else {
          return <Redirect to="/login" />;
        }
      }} // rendering based on some conditions
    />
  );
}
const Page404 = () => {
  return <h1>404</h1>;
};

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/register">
            <Signup />
          </Route>

          <PrivateRoute exact path="/settings">
            <Settings />
          </PrivateRoute>
          <PrivateRoute exact path="/user/:userId">
            <UserProfile />
          </PrivateRoute>
          <Route>
            <Page404 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

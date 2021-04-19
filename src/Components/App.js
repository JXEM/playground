import React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "../Styles/GlobalStyles";
import Theme from "../Styles/Theme";
import Home from "../Routes/Home";
import Watch from "../Routes/Watch";

const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/watch" component={Watch}></Route>
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;

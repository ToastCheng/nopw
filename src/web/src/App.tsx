import React, { useEffect } from 'react';
import { Box, Button, Stack, Text, useColorMode } from "@chakra-ui/react";

import NavBar from './components/NavBar';
import SignInModal from './components/SingInModal';
import SignUpModal from './components/SignUpModal';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MainPage from './pages/MainPage';
import { store } from './stores';
import { USER_ACTION } from './stores/user/actions';
import { UserState } from './stores/user/reducer';
import { connect } from 'react-redux';

const signOut = () => {
  store.dispatch({
    type: USER_ACTION.SIGN_OUT,
  });
  localStorage.removeItem("user");
};

const App = (props: any) => {
  useEffect(() => {
    if (props.user.email === '' && localStorage.getItem('user')) {
      console.log(JSON.parse(localStorage.getItem('user')!));
      store.dispatch({
        type: USER_ACTION.SET_USER,
        value: JSON.parse(localStorage.getItem('user')!)
      });
      console.log('get called')
    }
  });

  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = props;
  const btns = user.email === '' ? (
    <>
      <SignUpModal />
      <SignInModal />
    </>) : (
      <Button onClick={signOut}>Sign Out</Button>
  );
  return (
    <Router>
      <NavBar>
        <Box>
          <Text fontSize="2xl" color="white">Password Free</Text>
        </Box>
        <Stack spaceing={4} direction="row">
          {btns}
          <Button onClick={toggleColorMode}>
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button>
        </Stack>
      </NavBar>
      <Switch>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </Router>
    
  );
}

const mapStateToProps = (state: UserState) => state;
export default connect(mapStateToProps)(App);
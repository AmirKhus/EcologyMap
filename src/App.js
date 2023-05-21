import Header from './components/Header'
import useUser from "./components/Util/User/useUser"
import YMap from './components/YMap'
import React,{useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import AuthenticatePage from "./components/Authentication/AuthenticationPage";

function App() {
const {user, setUser} = useUser();

  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<YMap/>}>
                </Route>
                <Route path="/login" element={<AuthenticatePage setUser={setUser}/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;

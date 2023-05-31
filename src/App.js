import useUser from "./components/Util/User/useUser"
import YMap from './components/YmapTest'
import React,{useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import AuthenticatePage from "./components/Authentication/AuthenticationPage";
import Profile from './components/profile/Profile'
import Trigger from "./components/Trigger";
import MarkerInformationCreate from "./components/MarkerInformationCreate";
import Chat from "../src/components/сhat/Chat"

function App() {
    const {user, setUser} = useUser();
    const [mdlShow, setMdlShow] = useState(false);
    const mdlClose = () => setMdlShow(false);
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<YMap/>}> </Route>
                <Route path="/login" element={<AuthenticatePage setUser={setUser}/>} />
                <Route path="/profile" element={<Profile/>}> </Route>
                <Route path="/chat/:data" element={<Chat/>}> </Route>
                <Route path="/module" element={<Trigger show={true} onHide={mdlClose} />}> </Route>
                <Route path="/createMarkerDescription/:object" element={<MarkerInformationCreate/>}> </Route>
            </Routes>
        </Router>
    </div>
  );
}

export default App;

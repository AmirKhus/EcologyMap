import React, { useState,useEffect } from 'react';
import styled from "styled-components";
import '../css/Button.css'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import Login from "./Authentication/Login"
import NullComponent from "./NullComponent"
import {YMaps} from "@pbe/react-yandex-maps";
import useUser from "./Util/User/useUser";
import AuthenticatePage from "./Authentication/AuthenticationPage";

const HeaderContainer = styled.header`
    display: flex;
    background-color: rgb(104 172 203);
    padding: 15px 40px;
`

const Logo = styled.div`
    color: white;
    font-size: 20px;
    font-weight: bold;
`
const Header = () => {
    const [value, setValue] = useState(1);
    const {user, setUser} = useUser();

    // if (!user) {
    //     return <AuthenticatePage setUser={setUser}/>
    // }

    const goAuthenticatePage = () => {
        setValue(value+1)
        window.location.href='http://localhost:3000/login';
    };
    return (
        <div>
            <HeaderContainer>
                <Logo>FB-Map</Logo>
                {/*<button id = "loginButton" onClick={goFriend}>Вход</button>*/}
                <button id = "loginButton" onClick={goAuthenticatePage}>Вход</button>
                {/*<Link to="/login">Nothing Here</Link>*/}
            </HeaderContainer>

                {/*<Paper sx={{position: 'fixed', top: 0, left: 0, right: 0}} elevation={3}>*/}

                {/*</Paper>*/}
                {/*{value% 2 !== 0?*/}
                {/*    <NullComponent />:<YMaps/>*/}
                {/*}*/}

        </div>
    )
}

export default Header;


// import React from "react";
// import styled from "styled-components";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import '../css/Button.css'
// import Login from "./Authentication/Login"

// const HeaderContainer = styled.header`
//     display: flex;
//     background-color: rgb(104 172 203);
//     padding: 15px 40px;
// `

// const Logo = styled.div`
//     color: white;
//     font-size: 20px;
//     font-weight: bold;
// `

// const Header = () => {
//     return (
//         <HeaderContainer>
//             <Logo>Эко карта</Logo>
//             <button onclick="location.href='http://localhost:3000/login" id = "loginButton">Вход</button>
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/login" component={<Login />} ></Route>
//                     <Route path="/" component={<Login />} ></Route>
//                 </Routes>
//             </BrowserRouter>
//         </HeaderContainer>

//     )
// }

// export default Header;

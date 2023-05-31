import React, { useState,useEffect } from 'react';
import styled from "styled-components";
import '../css/Button.css'
import {Link } from "react-router-dom";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import Login from "./Authentication/Login"
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
const Header = (props) => {
    const [value, setValue] = useState(1);
    const {user, setUser} = useUser();


    const goAuthenticatePage = () => {
        setValue(value+1)
        window.location.href='http://localhost:3000/login';
    };

    const goProfilePage = () => {
        if(localStorage.getItem('user') !== null){
            window.location.href='http://localhost:3000/profile';
        }else{

        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <HeaderContainer>
            <Logo>ЭкоКарта</Logo>
            {localStorage.getItem('user')===null ? (
                <Link to="/login">
                    <button id="loginButton">Вход</button>
                </Link>
            ) : (
                <>
                    <button id="loginButton" onClick={handleLogout}>
                        Выйти
                    </button>
                    <button id="profileButton" onClick={goProfilePage}>Личный кабинет</button>
                </>
            )}
        </HeaderContainer>
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

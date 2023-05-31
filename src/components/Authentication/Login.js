import {useState} from "react";
import {SIGNIN} from "../Util/Urls";
import axios from "axios";
import PropTypes from "prop-types";
import "./Auth.css"
import { Link } from "react-router-dom";


export async function loginUser(credentials) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return axios.post(SIGNIN, credentials).then((response) => {
        return response.data
    }).catch(function (err) {
        console.log("Check your credentials");
    });

}

export default function Login({setUser}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async e => {
        e.preventDefault();
        let user = await loginUser({
            email,
            password
        });
        setUser(user);
        // window.location.replace("http://localhost:3000");
    }

    return (
        <div className="login-wrapper">
            <h1>Вход в систему </h1>
            <form className={"form_input"} onSubmit={handleSubmit}>
                <label>
                    <p>Почта</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Пароль</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button className={"submit_btn"} type="submit">Войти</button>
                </div>
            </form>
        </div>
    )
}


Login.propTypes = {
    setToken: PropTypes.func.isRequired
}
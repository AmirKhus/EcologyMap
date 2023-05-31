import PropTypes from "prop-types";
import {useState} from "react";

const {SIGNUP} = require("../Util/Urls");
const axios = require("axios");
const {loginUser} = require("./Login");

async function signup(credentials) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    credentials['role'] = ['user']

    axios.post(SIGNUP, credentials).then((response) => {
        console.log(credentials.email);
        var loginCredentials = {
            email: credentials['email'],
            password: credentials['password']
        }
        alert("Успешно регистрирация")

        return loginUser(loginCredentials);
    }).catch(function (err) {
        alert("Это почта используется другим пользователем.");
    });

}

export default function SignUp({setUser}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        let user = await signup({
            username,
            email,
            password
        });
        setUser(user);
    }

    return (
        <div className="login-wrapper">
            <h1>Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Имя</p>
                    <input type="text" onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Почта</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Пароль</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>

                    <button type="submit" style={{ width: "160px" }}>Зарегистрироваться</button>
                </div>
            </form>
        </div>
    )
}

SignUp.propTypes = {
    setToken: PropTypes.func.isRequired
}
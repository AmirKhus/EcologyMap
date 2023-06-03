import useUser from "../Util/User/useUser";
import {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import {CHAT, USERS, WEBSOCKET} from "../Util/Urls";
import {loadMessages, getToken} from "../Util/Requests";
import "./Chat.css"
import UserItem from "./UserItem";
import MessageItem from "./MessageItem";

var stompClient = null;
const Chat = (props) => {
    const {user, setUser} = useUser();
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState(null);
    const [activeContact, setActiveContact] = useState(0);
    const [oneStart, setOneStart] = useState(true);
    const [messages, setMessages] = useState([]);
    const { data } = useParams();
    let headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*/*",
        "Authorization": getToken(user)
    }

    let token ={
        "token":getToken(user)
    }

    useEffect(() => {
        axios.get(USERS + '/friends', {headers: headers}).then((response) => {
            sessionStorage.setItem('activeContact', JSON.stringify(response.data[0]))
            // console.log("response.data[0]",json)
            console.log("response.data[0]",response.data[0])
            setContacts(response.data)
            setActiveContact(response.data.find(obj => obj.email === data))
            connect()
        }).catch(function (err) {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (contacts != null && contacts.length > 0) {
            let active = getActiveChat();
            console.log("activeContactactiveContact",active)
            // loadMessages("/chatGroup");
            // if (active['id'] === 3){
            //     loadMessages("/chatGroup", setMessages)
            // }else{
            loadMessages("/chat/" + active['id'], setMessages, headers)
            // }

        }
    }, [contacts, activeContact]);

    const connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS(WEBSOCKET);
        stompClient = Stomp.over(SockJS, token);
        stompClient.connect(token, onConnected, onError);
    };

    const onConnected = () => {
        console.log("connected");
        stompClient.subscribe(
            "/user/" + user['id'] + "/queue/messages",
            onMessageReceived
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const getActiveChat = () => {
        console.log("oneStart",oneStart)
        if(oneStart){
            setOneStart(false)
            // return {id: 10, email: 'Республика Татарстан'}
            return activeContact
        }else {
            return JSON.parse(sessionStorage.getItem("activeContact"));
        }
    }

    const onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        alert(notification.sender.email);
        const active = getActiveChat();

        // if(3 === notification.sender.id)
        //     loadMessages("/chat/" + 3, setMessages, headers)
        // else
            if (active.id === notification.sender.id) {
                loadMessages("/chat/" + active['id'], setMessages, headers)
            } else {
                alert("Received a new message from " + notification.sender.email);
            }
    };

    function sendMessage() {
        if (text !== "") {
            var message = {
                text: text,
                sender: {id: user['id'], email: user['email'], username: user['username']},
                target: {id: activeContact['id'], email: activeContact['email'],username: activeContact['username']}
            }
            console.log("messmessagemessageage",message)

            messages.push(message)
            setMessages(messages);
            stompClient.send(CHAT, {token: getToken(user)}, JSON.stringify({
                text: text,
                target: activeContact['id'],
            }));
        }
    }


    const handleSetCurrentChat = (chat) => {
        sessionStorage.setItem('activeContact', JSON.stringify(chat))
        console.log("asdasdasdasdasd",chat)
        setActiveContact(chat)
    }

    return (<div style={{marginTop:50}}>
            <div id={"contacts"}>

                <ul style={{marginLeft: "-34px"}}>
                    {contacts ? contacts.map((e) => {
                        const isSelected = activeContact.id == e.id;
                        return <UserItem isSelected={isSelected} setChat={handleSetCurrentChat} chat={e}/>
                    }) : <div></div>
                    }
                </ul>
            </div>
            <div id={"messages"}>
                <ul style={{marginLeft: "-36px"}}>
                    {messages ? messages.map((e) => {
                        const isMine = e.sender.id == user.id;
                        return <MessageItem isMine={isMine} message={e}/>
                    }) : <div></div>
                    }
                </ul>
            </div>
            <div className="message-input">
                <div className="wrap">
                    <input
                        name="user_input"
                        size="large"
                        placeholder="Писать сюда"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                sendMessage(text);
                                setText("");
                            }
                        }}
                    />

                    <button
                        onClick={() => {
                            sendMessage(text);
                            setText("");
                        }}
                    >Отправить</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
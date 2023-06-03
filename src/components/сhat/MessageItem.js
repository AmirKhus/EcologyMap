import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import "./Chat.css"
export default function MessageItem(props) {
    const listItemStyle = {
        fontSize: '12px',
        textAlign: 'left',
        verticalAlign: 'top',
    };
return (
        <div className={props.isMine ? "message_item message_mine" : "user_item message_not_mine"}>
            <li style={listItemStyle}>{props.message.sender.username}</li>
            <li>{props.message.text}</li>
        </div>
    )

}
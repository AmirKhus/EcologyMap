import React from "react";
import "./MarkerProfile.css";
import { Avatar } from "@material-ui/core";
import {
    ThumbUp,
    ChatBubbleOutline,
    AccountCircle,
    ExpandMoreOutlined,
} from "@material-ui/icons";

function MarkerProfile({ profilePic, image, point, timestamp, message }) {
    // console.log("postSenderAva: " + profilePic + ", post image: " + image + ", poster username: " + username + ", post title: " + message);
    return (
        <div className="post">
            <div className="post__top">
                <Avatar src={profilePic} className="post__avatar" />

                <div className="post__topInfo">
                    <h3>{point.author}</h3>
                    {/* <p>time</p> */}
                    <p>{point.date}</p>
                    {/* <p>{new Date(timestamp?.toDate()).toUTCString()}</p> */}
                </div>
            </div>


            <div>
                <h2>{point.title}</h2>
                <p>Автор метки: {point.author}</p>
                <p>Тип экологической проблемы: {point.type}</p>
                <p>Описание: {point.description}</p>
                <p>Дата публикации: {point.date}</p>
                <p>Оценка: {point.rating}</p>
                <p>Инфо о воздухе: пока нет</p>
                <ul className="cd-item-action">
                    <li>
                        { JSON.parse(localStorage.getItem('user')).username === point.author?
                            <a id="buttun3" className="add-to-cart3" href={`/createMarkerDescription/object?data=${encodeURIComponent(JSON.stringify(point))}`}>
                                Редактирование данных
                            </a> : null
                        }
                    </li>
                </ul>
            </div>

            {/*<div className="post__options">*/}
            {/*    <div className="post__option">*/}
            {/*        <ThumbUp />*/}
            {/*        <p>Like</p>*/}
            {/*    </div>*/}

            {/*    <div className="post__option">*/}
            {/*        <ChatBubbleOutline />*/}
            {/*        <p>Comment</p>*/}
            {/*    </div>*/}

            {/*    /!*<div className="post__option">*!/*/}
            {/*    /!*  <NearMe />*!/*/}
            {/*    /!*  <p>Share</p>*!/*/}
            {/*    /!*</div>*!/*/}

            {/*    <div className="post__option">*/}
            {/*        <AccountCircle />*/}
            {/*        <ExpandMoreOutlined />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export default MarkerProfile;

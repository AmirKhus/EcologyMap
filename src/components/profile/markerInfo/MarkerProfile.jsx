import React from "react";
import "./MarkerProfile.css";
import { Avatar } from "@material-ui/core";
import {
    ThumbUp,
    ChatBubbleOutline,
    AccountCircle,
    ExpandMoreOutlined,
} from "@material-ui/icons";

function MarkerProfile({ profilePic, image, username, timestamp, message }) {
    console.log("postSenderAva: " + profilePic + ", post image: " + image + ", poster username: " + username + ", post title: " + message);
    return (
        <div className="post">
            <div className="post__top">
                <Avatar src={profilePic} className="post__avatar" />

                <div className="post__topInfo">
                    <h3>{username}</h3>
                    {/* <p>time</p> */}
                    <p>{new Date(timestamp?.toDate()).toUTCString()}</p>
                    {/* <p>{new Date(timestamp?.toDate()).toUTCString()}</p> */}
                </div>
            </div>

            <div className="post__bottom">
                <p>{message}</p>
            </div>

            <div className="post__image">
                <img src={image} alt="" />
            </div>

            <div className="post__options">
                <div className="post__option">
                    <ThumbUp />
                    <p>Like</p>
                </div>

                <div className="post__option">
                    <ChatBubbleOutline />
                    <p>Comment</p>
                </div>

                {/*<div className="post__option">*/}
                {/*  <NearMe />*/}
                {/*  <p>Share</p>*/}
                {/*</div>*/}

                <div className="post__option">
                    <AccountCircle />
                    <ExpandMoreOutlined />
                </div>
            </div>
        </div>
    );
}

export default MarkerProfile;

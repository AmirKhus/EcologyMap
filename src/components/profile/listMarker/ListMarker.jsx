import React, { useEffect, useState } from "react";
import "./ListMarker.css";
import Post from "../markerInfo/MarkerProfile";
import axios from "../../Util/markerList/axios";
import requests from "../../Util/markerList/request";
import {connect} from "react-redux";
import {Avatar} from "@material-ui/core";
import {InsertEmoticon, PhotoLibrary} from "@material-ui/icons";

function ListMarker(userEmail) {
    const userEm = userEmail;

    console.log(", userEmail: " + userEm );
    const [isAdded, setIsAdded] = useState(false);

    const [addPost, setPost] = useState({
        postTitle: "",
        postObject:"",
        postDate: Date.now()
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addNewPost();
        console.log("text: "+ addPost.postTitle+ ", postObject: " + addPost.postObject + ", userId: " + addPost.posterUser);

        // clear form
        setPost({...addPost, postTitle: "", postObject: ""});
    };

    async function addNewPost(){
        let res = await axios.post(requests.addPost, addPost);

        setIsAdded(!isAdded);
    }


    //get all posts
    const [posts, setPosts] = useState([]);
    // localStorage.setItem("currentPage", "");
    useEffect(()=>{
        async function fetchData(){
            let request = "";
            console.log(authh.user.jwtToken)
            axios.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${authh.user.jwtToken}`;
            if(root==="home"){

                request = await axios.get(requests.news);
            }
            else if(root ==="userNews"){
                request = await axios.get(requests.getUserNews+ userEm);
            }
            // switch (sourc) {
            //   case "home":
            //     console.log("homega keldi");
            //     request = await axios.get(requests.news);
            //     return request;
            //   case "mynews":
            //     console.log("my news keldi");
            //     request = await axios.get(requests.getUserNews, userId);
            //     return request;
            // }
            // const request = await axios.get(requests.news);
            setPosts(request.data);
            posts.map((post)=>(
                console.log("posts: " + post.postTitle)

            ))
            // console.log("posts: " + posts);
        }
        fetchData();
    },[isAdded]);
const markers = [ {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
},
    {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
    {
        "userId": 1,
        "id": 3,
        "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
    },
    {
        "userId": 1,
        "id": 4,
        "title": "eum et est occaecati",
        "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
    },
    {
        "userId": 1,
        "id": 5,
        "title": "nesciunt quas odio",
        "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
    },
    {
        "userId": 1,
        "id": 6,
        "title": "dolorem eum magni eos aperiam quia",
        "body": "ut aspernatur corporis harum nihil quis provident sequi\nmollitia nobis aliquid molestiae\nperspiciatis et ea nemo ab reprehenderit accusantium quas\nvoluptate dolores velit et doloremque molestiae"
    }
    ]
    return (
        <div className="feed">
            {markers.map((post) => (

                <Post
                    key={post.userId}
                    profilePic={post.id}
                    username={post.title}
                    image={"https://camo.githubusercontent.com/f481cb01507ba595c95e6c24e88d17976d7263be19bb02d19135793b12fb32be/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f44786e72375944585141417a57467a2e6a7067"}
                    message={'post.postTitle'}
                />
            )).reverse()}
        </div>
    );
}
const mapStateToProps = (state, {email, sourc}) => {
    console.log("state: " +  ", email: " + email + ", sourc: " + sourc);
    console.log(state.authState.user);
    return {
        auth: state.authState,
        userEmail: email,
        rootPage: sourc,
    };
};
export default ListMarker

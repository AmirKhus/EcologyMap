import React, {useEffect, useState} from "react";
// import "bootstrap/dist/css/bootstrap.css";
import {BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {connect} from "react-redux";
import Feed from "./listMarker/ListMarker";
import axios from "../Util/markerList/axios";
import {Button, Modal} from "react-bootstrap";
import "./Profile.css"
import {loadMessages, getToken,getUsers} from "../Util/Requests";

import {USERS} from "../Util/Urls";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import OneFriend from "./OneFriend";
import useUser from "../Util/User/useUser";

// import {updateNameAuthAction} from "../../redux/actions/AuthAction";

function Profile(props) {
    // const { auth, updateName} = props;
    const auth = localStorage.getItem('user');
    const [currentUser, setCurrentUser] = useState({});
    const {user, setUser} = useUser();
    const [userToEdit, setUserToEdit] = useState({
        id: 0,
        fullName: JSON.parse(localStorage.getItem('user')).username,
        ava: "",
        email: JSON.parse(localStorage.getItem('user')).email,
        password: "",
        roles: []
    });
    const [isBuild, setIsBuild] = useState(false);

    // useEffect(() => {
    //     async function fetchData() {
    //         const request = await axios.get("/api/allUsers/" + auth?.user.id);
    //         setCurrentUser(request.data);
    //         console.log("request2");
    //         console.log(request.data);
    //     }
    //
    //     fetchData();
    // }, [isBuild]);
    var jsonObject = JSON.parse(localStorage.getItem('user'));
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => {
        setShow2(false);
    }
    const handleShow2 = () => {
        setShow2(true);
    }

    const [friends, setFriends] = useState([]);
    const [notFriends, setNotFriends] = useState([]);
    const [value, setValue] = useState(0);
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": getToken(user)
    }

    useEffect(() => {
        console.log('fasl;fjals;dfjk')
        getUsers('/friends', setFriends, headers)
        getUsers('/not_friends', setNotFriends, headers)
    }, [])

    function addFriend(id, index) {
        axios.get(USERS + "/" + id + '/add_friend', {headers: headers}).then((response) => {
            friends.push(notFriends[index])
            setFriends(friends)
            var dublicatedFriends = [...notFriends]
            var part1 = dublicatedFriends.splice(0, index)
            var part2 = notFriends.splice(index + 1)
            setNotFriends(part1.concat(part2))

        }).catch(function (err) {
            alert("Something went wrong trying add new friend with id: " + id);
        });
    }
    'MuiBottomNavigation-root css-18vub-MuiBottomNavigation-root'
    const styles = {
        bgcolor: '#DFDCDB',
        color: 'black',
        height: '22px',
        '& .Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
                fontWeight: 'bold',
                color: 'black',
                height: '22px'
            }
        }
    };
    return (
        <div className="profile">
            {/*<div className="container">*/}
            {/*    <div className="row">*/}
            {/*<div className="col-lg-12 mt-5">*/}
            <div className="card profile">
                <div className="row mt-2">
                    <div className="col-3">
                        <img src="https://i.ytimg.com/vi/eKNN3iQkw5U/maxresdefault.jpg" alt="" className="profile__image"/>
                    </div>
                    <div className="col-8">
                        <h3 className="profile__fullname">Username: {jsonObject.username}</h3>
                        <h5>Email: {jsonObject.email}</h5>
                        {/*<Link to={`/profile/:userId`} style={{textDecoration:"none"}}>*/}
                        {/*    Edit profile*/}
                        {/*</Link>*/}

                        {/*<button className="btn" onClick={(e) => {*/}
                        {/*    setUserToEdit({*/}
                        {/*            ...userToEdit,*/}
                        {/*            id: currentUser.id,*/}
                        {/*        fullName: jsonObject.username,*/}
                        {/*        email: jsonObject.email,*/}
                        {/*        ava: currentUser.ava,*/}
                        {/*        roles: currentUser.roles,*/}
                        {/*        password: currentUser.password*/}
                        {/*    });*/}
                        {/*    handleShow2();*/}
                        {/*}}>Edit profile*/}
                        {/*</button>*/}

                        <div className="profile-container">
                            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                                <BottomNavigation
                                    sx={styles}
                                    showLabels
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                >
                                    <BottomNavigationAction label="Мои друзья"/>
                                    <BottomNavigationAction label="Добавить друга"/>
                                </BottomNavigation>
                            </Paper>
                            <div >
                                {value == 0 ? <div>{
                                        friends.map((item, index) => {
                                            return <OneFriend email={item['email']} id={item['id']} index={index} isFriend={true}
                                                              addFriend={addFriend}/>
                                        })
                                    }</div> :
                                    <div>
                                        {
                                            notFriends.map((item, index) => {
                                                return <OneFriend email={item['email']} id={item['id']} index={index} isFriend={false}
                                                                  addFriend={addFriend}/>
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/*edit modal*/}
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton className="backcolorBlack">
                    <Modal.Title>Изменение данных</Modal.Title>
                </Modal.Header>
                <Modal.Body className="backcolorBlack">
                    <form>
                        <div className="form-group">
                            <label>Имя пользователя</label>
                            <input type="text" className="form-control"
                                   value={userToEdit.fullName} onChange={(e) => {
                                setUserToEdit({...userToEdit, fullName: e.target.value})
                            }}/>
                        </div>
                        {/*<div className="form-group">*/}
                        {/*    <label>New Password:</label>*/}
                        {/*    <input type="password" className="form-control" placeholder="password..."*/}
                        {/*         value={userToEdit.password} onChange={(e)=>{*/}
                        {/*        setUserToEdit({...userToEdit, password: e.target.value});*/}
                        {/*    }}  />*/}
                        {/*</div>*/}
                    </form>
                </Modal.Body>
                <Modal.Footer className="backcolorBlack">
                    <Button variant="danger" onClick={handleClose2}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        console.log("friend To Edit");
                        console.log(userToEdit);

                        // axios.put(requests.updateUser, userToEdit).then(res=>{
                        //     setIsBuild(!isBuild);

                        // })
                        updateName(userToEdit);
                        handleClose2();
                    }}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*end edit modal*/}

            <div className="mt-3">
                <Feed email={"q@q"} sourc={"userNews"}/>
            </div>

            {/*</div>*/}

            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.authState,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateName: (userInfo) => {
            dispatch(updateNameAuthAction(userInfo));
        },
    };
};
export default Profile;

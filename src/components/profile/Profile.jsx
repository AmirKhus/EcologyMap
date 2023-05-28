import React, {useEffect, useState} from "react";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {connect} from "react-redux";
import Feed from "./listMarker/ListMarker";
import axios from "../Util/markerList/axios";
import {Button, Modal} from "react-bootstrap";
import "./Profile.css"

// import {updateNameAuthAction} from "../../redux/actions/AuthAction";

function Profile(props) {
    // const { auth, updateName} = props;
    const auth = localStorage.getItem('user');
    const [currentUser, setCurrentUser] = useState({});
    const [userToEdit, setUserToEdit] = useState({
        id: 0,
        fullName: "",
        ava: "",
        email: "",
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

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => {
        setShow2(false);
    }
    const handleShow2 = () => {
        setShow2(true);
    }


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
                        <h3 className="profile__fullname">"fullname"</h3>
                        <h5>Email: Email</h5>
                        {/*<Link to={`/profile/:userId`} style={{textDecoration:"none"}}>*/}
                        {/*    Edit profile*/}
                        {/*</Link>*/}

                        {/*<button className="btn" onClick={(e) => {*/}
                        {/*    setUserToEdit({*/}
                            {/*        ...userToEdit,*/}
                            {/*        id: currentUser.id,*/}
                        {/*        fullName: currentUser.fullName,*/}
                        {/*        email: currentUser.email,*/}
                        {/*        ava: currentUser.ava,*/}
                        {/*        roles: currentUser.roles,*/}
                        {/*        password: currentUser.password*/}
                        {/*    });*/}
                        {/*    handleShow2();*/}
                        {/*}}>Edit profile*/}
                        {/*</button>*/}
                    </div>
                </div>
                <hr/>

            </div>
            {/*edit modal*/}
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton className="backcolorBlack">
                    <Modal.Title>Edit Message</Modal.Title>
                </Modal.Header>
                <Modal.Body className="backcolorBlack">
                    <form>
                        <div className="form-group">
                            <label>[Full Name]:</label>
                            <input type="text" className="form-control" placeholder="User Full Name..."
                                   value={userToEdit.fullName} onChange={(e) => {
                                setUserToEdit({...userToEdit, fullName: e.target.value})
                            }}/>
                        </div>
                        <div className="form-group">
                            <label> Ava Picture:</label>
                            <input type="text" className="form-control" placeholder="Ava picture url..."
                                   value={userToEdit.ava} onChange={(e) => {
                                setUserToEdit({...userToEdit, ava: e.target.value})
                            }}/>
                        </div>
                        <div className="form-group">
                            <label> Email:</label>
                            <input type="email" className="form-control" placeholder="Email..."
                                   value={userToEdit.email} onChange={(e) => {
                                setUserToEdit({...userToEdit, email: e.target.value})
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

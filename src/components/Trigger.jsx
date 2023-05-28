import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Trigger = (props) => {
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title"
        >
            <Modal.Header closeButton className="backcolorBlack">
                <Modal.Title>Edit Message</Modal.Title>
            </Modal.Header>
            <Modal.Body className="backcolorBlack">
                <form>
                    <div className="form-group">
                        <label>[Full Name]:</label>
                        <input type="text" className="form-control" placeholder="User Full Name..." />
                    </div>
                    <div className="form-group">
                        <label> Email:</label>
                        <input type="email" className="form-control" placeholder="Email..."
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className="backcolorBlack">
                {/*<Button variant="danger" onClick={handleClose2}>*/}
                {/*    Cancel*/}
                {/*</Button>*/}
                <Button variant="primary" onClick={() => {
                    console.log("friend To Edit");
                }}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Trigger;
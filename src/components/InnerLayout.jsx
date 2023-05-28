import React from 'react';
import {Link} from "@mui/material";

const InnerLayout = ({ openedDescription, index, openDescription, point }) => {
    if (openedDescription !== index) {
        return (
            <div>
                <input
                    type="button"
                    onClick={() => {
                        openDescription(index);
                    }}
                    value="Подробнее"
                />
                <Link to="/module">Контакты</Link>
            </div>
        );
    }
    return <div>"point.title"</div>;
};

export default InnerLayout;

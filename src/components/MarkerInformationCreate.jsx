import React from "react";
import { useParams } from 'react-router-dom';

const MarkerInformationCreate = () => {
const { data } = useParams();
    return (
        <div>
            <h2>Дочерний компонент</h2>
            <p>{data}</p>
        </div>
    );
}

export default MarkerInformationCreate;
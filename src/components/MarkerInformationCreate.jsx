import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import CancelIcon from "@material-ui/icons/Cancel";
import "./test.css"
import axios from 'axios';

const MarkerInformationCreate = () => {
    const [markerImg, setMarkerImg] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [description, setDescription] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const [markerInfo, setMarkerInfo] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');

        if (data) {
            const deserializedMarkerInfo = JSON.parse(decodeURIComponent(data)); // Восстановление объекта из строки
            setMarkerInfo(deserializedMarkerInfo);
            console.log(deserializedMarkerInfo);
            setSelectedType(deserializedMarkerInfo.type)
            setPostDesc(deserializedMarkerInfo.description)
        }
    }, []);

    const handlePostTitleChange = (event) => {
        const selectedValue = event.target.value;
        setPostTitle(selectedValue);
        setSelectedType(selectedValue);
        console.log(postTitle);
    };

    const handleMarkerImgChange = (event) => {
        setMarkerImg(event.target.value);
    };

    const handlePostDescChange = (event) => {
        const descriptionValue = event.target.value;
        setPostDesc(descriptionValue);
        setDescription(descriptionValue);
    };

    const savePost = () => {
        if(markerInfo.id !== null) {
            const post = {
                id: markerInfo.id,
                author: markerInfo.author,
                date: markerInfo.date,
                rating: markerInfo.rating,
                img: "",
                coord: markerInfo.coord,
                type: selectedType,
                description: postDesc
            };
            axios.put('http://localhost:8080/users/edit_marker', post)
                .then(response => {
                    // Handle successful response
                    console.log(response);
                })
                .catch(error => {
                    // Handle error
                    console.error(error);
                });
        }else {
            const post = {
                author: JSON.parse(localStorage.getItem('user')).username,
                date: markerInfo.date,
                rating: markerInfo.rating,
                img: "",
                coord: markerInfo.coord,
                type: selectedType,
                description: postDesc
            };
            axios.post('http://localhost:8080/users/save_marker', post)
                .then(response => {
                    // Handle successful response
                    console.log(response);
                })
                .catch(error => {
                    // Handle error
                    console.error(error);
                });
        }
    }
    const deletePost = () => {
        if(markerInfo.id !== null)
            axios.delete('http://localhost:8080/users/delete_marker/'+ markerInfo.id)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    // Handle error
                    console.error(error);
                });
    };

    const wasteTypes = ["Пластик", "Стекло", "Бумага", "Металл"];
    return (
        <>
            <form className="editPostForm" >
                <button className="hideBtn">
                    <CancelIcon />
                </button>
                <h2>Маркер</h2>
                <div>
                    <input
                        className="editFormInput"
                        type="file"
                        name="markerImg"
                        accept="image/*"
                        onChange={handleMarkerImgChange}
                    />
                </div>

                <div>
                    <select
                        className="editFormInput"
                        name="postTitle"
                        value={selectedType}
                        onChange={handlePostTitleChange}
                        required
                    >
                        <option value="">Выберите тип мусора</option>
                        {wasteTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
          <textarea
              className="editFormInput"
              name="postDescription"
              placeholder="Описание экологической проблемы"
              value={postDesc}
              onChange={handlePostDescChange}
              rows={8}
              required
          />
                </div>
                <div>
                    <button className="blackBtn" type="button" onClick = {savePost}>
                        Сохранить
                    </button>
                    <button className="blackBtn" type="button" onClick={deletePost}>
                        Удалить
                    </button>
                </div>
            </form>
        </>
    );
};

export default MarkerInformationCreate;

import React, { useState, useEffect } from 'react';
import { Link } from '@mui/material';
import Modal from './Modal';
import POINTS from './points';
import './Modal.css';

const InnerLayout = ({ openedDescription, index, point, openDescription }) => {
    const handleClick = () => {
        openDescription(index);
    };

    if (openedDescription !== index) {
        return (
            <div>
                <button onClick={handleClick}>Подробнее</button>
            </div>
        );
    }

    const [count, setCount] = useState(0);
    const [lastChoice, setLastChoice] = useState(null);

    const handleLike = () => {
        if (lastChoice === 'like') {
            setCount(0);
            setLastChoice(null);
        } else if (lastChoice === 'dislike') {
            setCount(count + 2);
            setLastChoice('like');
        } else {
            setCount(count + 1);
            setLastChoice('like');
        }
    };

    const handleDislike = () => {
        if (lastChoice === 'dislike') {
            setCount(0);
            setLastChoice(null);
        } else if (lastChoice === 'like') {
            setCount(count - 2);
            setLastChoice('dislike');
        } else {
            setCount(count - 1);
            setLastChoice('dislike');
        }
    };

    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const loadImage = async () => {
            try {
                const response = await fetch('C:/Users/amir1/Downloads/photo_2023-05-29_08-13-09.jpg');
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch (error) {
                console.error('Failed to load image:', error);
            }
        };

        loadImage();
    }, ["C:/Users/amir1/Downloads/photo_2023-05-29_08-13-09.jpg"]);
    return (
        <div>
            <h2>{point.title}</h2>
            {/*<img src={imageUrl} alt="Описание изображения" />*/}
            <p>Автор метки: {point.author}</p>
            <p>Тип экологической проблемы: {point.type}</p>
            <p>Описание: {point.description}</p>
            <p>Дата публикации: {point.date}</p>
            <p>Оценка: {count}</p>
            <p>Инфо о воздухе: пока нет</p>
            <ul className="cd-item-action">
                <li>
                    {JSON.parse(localStorage.getItem('user')).username !== point.author ? (
                        <button id="button1" onClick={handleLike} className={lastChoice === 'add-to-cart1' ? 'active' : ''} style={{ backgroundColor:  '#ff0000'}} className="add-to-cart1">
                            Полезен
                        </button>
                    ) : null}

                    {JSON.parse(localStorage.getItem('user')).username !== point.author ? (
                        <button id="button2" onClick={handleDislike} className={lastChoice === 'dislike' ? 'active' : ''} style={{ backgroundColor: '#009900'}} className="add-to-cart2">
                            Бесполезен
                        </button>
                    ) : null}
                    { JSON.parse(localStorage.getItem('user')).username === point.author?
                        <a id="buttun3" className="add-to-cart3" href={`/createMarkerDescription/object?data=${encodeURIComponent(JSON.stringify(point))}`}>
                            Редактирование данных
                        </a> : null
                        }
                </li>
            </ul>
        </div>
    );
};

export default InnerLayout;

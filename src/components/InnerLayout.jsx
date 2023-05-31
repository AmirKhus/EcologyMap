import React from 'react';
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

    return (
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
                    {JSON.parse(localStorage.getItem('user')).username !== point.author ? (
                        <button id="button1"  style={{ backgroundColor:  '#ff0000'}} className="add-to-cart1" disabled>
                            Полезен
                        </button>
                    ) : null}

                    {JSON.parse(localStorage.getItem('user')).username !== point.author ? (
                        <button id="button2" style={{ backgroundColor: '#009900'}} className="add-to-cart2">
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

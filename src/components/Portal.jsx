import React, {useEffect} from 'react';
import {createPortal} from 'react-dom';
import YMap from "./YmapTest";


export const Portal =
    ( { children, getHTMLElementId } ) => {
        // находим искомый HTML по id
        const mount = document.getElementById("driver-2")
        // создаём свой div
        const el = document.createElement('div')

        useEffect(() => {
            // добавляем свой див к искомому элементу
            if (mount) mount.appendChild(el)
            return () => {
                // удаляем элемент от искомого при завершении компоненты
                if (mount) mount.removeChild(el)
            }
        }, [ el, mount ])

        // отменяем отрисовку при отсутствии искомого элемента
        if (!mount) return null
        // собственно, пририсовываем React-элемент в div к искомому HTML
        return createPortal(children, el)
    }

export default Portal;
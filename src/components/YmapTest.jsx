import React, { useState, useEffect, useRef } from 'react';
import { YMaps, Map, Clusterer, Button, Placemark } from '@pbe/react-yandex-maps';
import "../css/ballon.css"
import Header from "./Header";
import InnerLayout from "./InnerLayout";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import POINTS from './points';
import "./YmapTest.css"
import {Link } from "react-router-dom";
import {loadMarker, loadMessages} from "./Util/Requests";
import {MARKER, USERS} from "./Util/Urls";
import axios from "axios";

const mapState = {
    center: [55.809241, 49.227624],
    zoom: 9
};

const YMap = () => {
    const placemarkRef = useRef(null);
    const mapRef = useRef(null);
    const [address, setAddress] = useState("");
    const [count, setCount] = useState(1);
    const [countRegion, setCountRegion] = useState(1);
    const [canAddPlacemark, setCanAddPlacemark] = useState(false);
    const [canShowRegion, setCanShowRegion] = useState(false);
    const [ymaps, setYmaps] = useState(null);
    const [openedDescription, openDescription] = useState(null);
    const [clusterBalloon, setClusterBalloon] = useState(null);
    const [canAddMarker, setCanAddMarker] = useState(false);
    const [canOpenChat, setCanOpenChat] = useState(false);
    const [oldRegionName, addOldRegionName] = useState();
    const [oldRegion, addOldRegion] = useState();
    const [marker, setMarkers] = useState();
    const [numberMarkers, setNumberMarkers] = useState(0);


    useEffect(() => {
        if (document.getElementById('balloon') && clusterBalloon) {
            ReactDOM.hydrate(
                <InnerLayout
                    openDescription={openDescription}
                    openedDescription={openedDescription}
                    {...clusterBalloon}
                />,
                document.getElementById('balloon'),
            );
        }
    }, [clusterBalloon, openedDescription]);

    // useEffect(() => {
    //
    //     axios.get("http://localhost:8080/users/marker").then((response) => {
    //         sessionStorage.setItem('activeContact', JSON.stringify(response.data[0]))
    //         setMarker(response.data)
    //         console.log("datadatadatadata",response.data)
    //         //id пользователя data
    //         // setActiveContact(response.data[0])
    //         // setActiveContact(response.data.find(obj => obj.email === data))
    //         console.log()
    //     }).catch(function (err) {
    //         alert(err);
    //     });
    // }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/users/marker')
            .then(response => {
                setMarkers(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }, []);
    const getLayout = (Component, props) => {
        if (ymaps) {
            const html = ReactDOMServer.renderToString(<Component {...props} />);
            const Layout = ymaps.templateLayoutFactory.createClass(
                `<div id="balloon">${html}</div>`,
                {
                    build: function() {
                        Layout.superclass.build.call(this);
                        ReactDOM.hydrate(
                            <Component {...props} />,
                            document.getElementById('balloon'),
                        );
                    },
                },
            );

            return Layout;
        }
        return null;
    };

    const animatedLayout = () => {
        if (ymaps) {
            const animatedLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="placemark"></div>',
                {
                    build() {
                        animatedLayout.superclass.build.call(this);
                        const element = this.getParentElement().getElementsByClassName(
                            'placemark',
                        )[0];
                        // Если метка выбрана, то увеличим её размер.
                        const size = this.isActive ? 60 : 34;
                        // При задании для метки своего HTML макета, фигуру активной области
                        // необходимо задать самостоятельно - иначе метка будет неинтерактивной.
                        // Создадим фигуру активной области "Круг".
                        const smallShape = {
                            type: 'Circle',
                            coordinates: [0, 0],
                            radius: size / 2,
                        };
                        const bigShape = {
                            type: 'Circle',
                            coordinates: [0, -30],
                            radius: size / 2,
                        };
                        // Зададим фигуру активной области.
                        this.getData().options.set(
                            'shape',
                            this.isActive ? bigShape : smallShape,
                        );
                        // Если метка выбрана, то зададим класс и запустим анимацию.
                        if (this.isActive) {
                            element.classList.add('active');
                            element.style.animation = '.35s show-big-placemark';
                        } else if (this.inited) {
                            element.classList.remove('active');
                            element.style.animation = '.35s show-small-placemark';
                        }
                        if (!this.inited) {
                            this.inited = true;
                            this.isActive = false;
                            // При клике по метке будем перестраивать макет.
                            this.getData().geoObject.events.add(
                                'click',
                                function() {
                                    this.isActive = !this.isActive;
                                    this.rebuild();
                                },
                                this,
                            );
                        }
                    },
                },
            );

            return animatedLayout;
        }
        return null;
    };

    const openCluster = e => {
        const cluster = e.get('cluster');
        if (cluster) {
            const activeObject = cluster.state.get('activeObject');

            if (
                !clusterBalloon ||
                (clusterBalloon &&
                    activeObject.properties.getAll().index !== clusterBalloon.index)
            ) {
                setClusterBalloon(activeObject.properties.getAll());
                openDescription(activeObject.properties.getAll().index);

                // Automatically open the balloon for the active object
                cluster.balloon.open(activeObject);
            }
        }
    };


    const closeDescription = () => {
        setClusterBalloon(null);
        openDescription(null);
    };

    const createPlacemark = (coords) => {
        return new ymaps.Placemark(
            coords,
            {
                iconCaption: "loading.."
            },
            {
                preset: "islands#violetDotIconWithCaption",
                draggable: true
            }
        );
    };

    let regionName = "";
    let mapStat = [];
    const getAddress = async (coords) => {
        placemarkRef.current.properties.set("iconCaption", "loading..");
        await ymaps.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const newAddress = [
                firstGeoObject.getLocalities().length
                    ? firstGeoObject.getLocalities()
                    : firstGeoObject.getAdministrativeAreas(),
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
            ]
                .filter(Boolean)
                .join(", ");
            setAddress(newAddress);
            const markerInfo = {
                id: null,
                coord: "["+coords.toString()+"]"
            };
            const serializedMarkerInfo = encodeURIComponent(JSON.stringify(markerInfo));

            placemarkRef.current.properties.set({
                iconCaption: newAddress,
                // balloonContentHeader: "одержимое заголовка балуна геообъекта",
                // balloonContentBody : "содержимое основой части балуна геообъекта",
                // balloonContentFooter : "содержимое нижней части балуна геообъекта.",
                // balloonContent: firstGeoObject.getAddressLine()
                // balloonContentBody: '<a to=`http://localhost:3000/createMarkerDescription/${data}`>+7 (123) 456-78-90</a>'
             // balloonContent: '<a href={`/createMarkerDescription/${data}`}>Перейти к дочернему компоненту</a>'
             //    balloonContent: `<a href="/createMarkerDescription/${markerInfo}">Перейти к дочернему компоненту</a>`
                balloonContent: `<a href="/createMarkerDescription/object?data=${serializedMarkerInfo}">Перейти к дочернему компоненту</a>`
            });
            regionName =firstGeoObject.getAdministrativeAreas()[0];
        })
        if(canOpenChat || canShowRegion) {
            // тут рисутся регионы
            ymaps.borders.load('RU').then(function (geojson) {
                addOldRegionName(regionName)
                for (var i = 0; i < geojson.features.length; i++) {
                    if (geojson.features[i].properties.name && geojson.features[i].properties.name === oldRegionName) {
                        mapRef.current.geoObjects.remove(oldRegion);
                    }
                    if (geojson.features[i].properties.name && geojson.features[i].properties.name === regionName) {
                        if (canOpenChat) {
                            openMessager(geojson.features[i].properties.name);
                        }
                        var polygon = new ymaps.Polygon([
                            geojson.features[i].geometry.coordinates[0]
                        ], {
                            hintContent: "MyPoligon"
                        }, {
                            interactivityModel: 'default#transparent',
                            strokeWidth: 8,
                            opacity: 0.5
                        });
                        mapRef.current.geoObjects.add(polygon);
                        addOldRegion(polygon)
                        let numberMarkers = 0; // Объявление numberMarkers до цикла for

                        for (let i = 0; i < marker.length; i++) {
                            const json = marker[i];
                            console.log(json.coord);
                            console.log(polygon.geometry.contains(JSON.parse(json.coord)));
                            if (polygon.geometry.contains(JSON.parse(json.coord))) {
                                numberMarkers += 1; // Исправлено на numberMarkers += 1
                            }
                            console.log(numberMarkers);
                        }

                        if (numberMarkers > 0 && numberMarkers <= 3)
                            polygon.options.set('fillColor', '#00ff00');
                        else if (numberMarkers > 3 && numberMarkers <= 5)
                            polygon.options.set('fillColor', '#ffa500');
                        else if (numberMarkers > 6)
                            polygon.options.set('fillColor', '#ff0000');
                    }
                }
            }).catch(function (error) {
                console.error(error);
            });
        }
    };


    const markers = [
        {
        coords: [55.79424260833246,49.68814042729016],
        id: 1,
        author: "q@q",
        type: "Мусор",
        description: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        rating: 10,
        date:"2001-01-01"
    },
        {
            coords: [55.62832515119459, 49.11135820072768],
            id: 2,
            author: "Amir",
            type: "Мусор",
            description: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
            rating: 10,
            date:"2001-01-01"
        },
        {
            coords: [55.910118447321, 48.70761064213393],
            id: 3,
            author: "Amir",
            type: "Мусор",
            description: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
            rating: 10,
            date:"2001-01-01"
        }
    ]

    // const addMarkers = () => {
    //     setCanAddMarker(!canAddMarker);
    // };

    const onMapClick = (e) => {
        var objectId = e.get('id')
        console.log(objectId)
        if (canAddPlacemark || canOpenChat || canShowRegion){
            let objectManager = new ymaps.ObjectManager();
            objectManager.options.set('geoObjectInteractivityModel', 'default#transparent');
            const coords = e.get("coords");
            if (placemarkRef.current) {
                placemarkRef.current.geometry.setCoordinates(coords);
            } else {
                placemarkRef.current = createPlacemark(coords);
                mapRef.current.geoObjects.add(placemarkRef.current);
                placemarkRef.current.events.add("dragend", function () {
                    getAddress(placemarkRef.current.geometry.getCoordinates());
                });
            }
            // console.log(address)
            getAddress(coords);
        }
    };

    const addMarker = () => {
        if(localStorage.getItem('user')!== null){
            setCount(count + 1);
            setCanAddPlacemark(count % 2 !== 0);
        }else{
            alert("Для добавления маркера Вам необходимо войти под своей учетной записью или зарегистрироваться!")
        }
    };


    const showRegion = () => {
        setCountRegion(countRegion + 1);
        setCanShowRegion(countRegion % 2 !== 0);
        if(canShowRegion){
            mapRef.current.geoObjects.remove(oldRegion);
        }
    };


    const openChat = (name) => {
        if(localStorage.getItem('user')!== null){
            setCanOpenChat(true);
        }else{
            alert("Для открытия чата Вам необходимо войти под своей учетной записью или зарегистрироваться!")
        }
    };

    const openMessager = (address) => {
        if (canOpenChat) {
            setCanOpenChat(false)
            // console.log("addressaddressaddress",address)
            window.location.href=`http://localhost:3000/chat/${address}`;
        }
        // console.log("addressaddressaddressaddress"+address)
    };

    return (
        <div>
            <Header />
            <YMaps
                query={{
                    apikey: "106e4ebf-abbc-41b9-9230-adfbc64f15d9"
                }}
            >
                <Map
                    defaultState={{
                        center: [55.751574, 37.573856],
                        zoom: 9
                    }}
                    modules={["Clusterer","Polygon","GeoObject","geoQuery","control.ZoomControl", "control.FullscreenControl","Placemark", "geocode",
                        "geoObject.addon.balloon","borders", "ObjectManager",'geoObject.addon.balloon','clusterer.addon.balloon',
                        'templateLayoutFactory']}
                    style={{
                        flex: 2,
                        height: "calc(100vh - 57px)"
                    }}
                    onClick={onMapClick}
                    instanceRef={mapRef}
                    onLoad={(ymaps) => setYmaps(ymaps)}
                    state={mapState}
                    width={"100%"}
                    height={"100%"}
                >
                    <Clusterer
                        options={{
                            preset: 'islands#invertedVioletClusterIcons',
                            groupByCoordinates: false,
                            balloonPanelMaxMapArea: Infinity,
                            clusterBalloonItemContentLayout: getLayout(InnerLayout, {
                                openedDescription,
                                openDescription,
                                ...clusterBalloon,
                            }),
                        }}
                        onBalloonOpen={openCluster}
                        onBalloonClose={closeDescription}
                    >
                        {Array.isArray(marker) && marker.map((point, index) => (
                            <Placemark
                                key={index}
                                geometry={JSON.parse(point.coord)}
                                properties={{
                                    balloonContentHeader: point.type,
                                    point,
                                    index
                                }}
                                options={{
                                    iconLayout: animatedLayout(),
                                    balloonContentLayout: getLayout(InnerLayout, {
                                        point,
                                        index,
                                        openedDescription,
                                        openDescription,
                                    }),
                                }}
                            />
                        ))}
                    </Clusterer>

                    <Button
                        onClick={addMarker}
                        data={{ content: "Маркер" }}
                        options={{ float: "right" }}
                    />

                    <Button
                        onClick={showRegion}
                        data={{ content: "Регионы" }}
                        options={{ float: "right" }}
                    />
                        <Button
                            onClick={openChat}
                            data={{ content: "Чат" }}
                            options={{ float: "right" }}
                        />
                </Map>
            </YMaps>
        </div>
    );
};

export default YMap;

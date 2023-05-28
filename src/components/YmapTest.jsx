import React, { useState, useEffect, useRef } from 'react';
import { YMaps, Map, Clusterer, Button, Placemark } from '@pbe/react-yandex-maps';
import "../css/ballon.css"
import Header from "./Header";
import InnerLayout from "./InnerLayout";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import POINTS from './points';
import "./YmapTest.css"

const mapState = {
    center: [55.751574, 37.573856],
    zoom: 1
};

const YMap = () => {
    const placemarkRef = useRef(null);
    const mapRef = useRef(null);
    const [address, setAddress] = useState("");
    const [count, setCount] = useState(1);
    const [canAddPlacemark, setCanAddPlacemark] = useState(false);
    const [ymaps, setYmaps] = useState(null);
    const [openedDescription, openDescription] = useState(null);
    const [clusterBalloon, setClusterBalloon] = useState(null);
    const [canAddMarker, setCanAddMarker] = useState(false);
    const [oldRegionName, addOldRegionName] = useState();
    const [oldRegion, addOldRegion] = useState();

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
                        const size = this.isActive ? 60 : 34;
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
                        this.getData().options.set(
                            'shape',
                            this.isActive ? bigShape : smallShape,
                        );
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

    const openCluster = (e) => {
        const cluster = e.get('cluster');
        if (cluster) {
            if (!clusterBalloon) {
                setClusterBalloon(
                    cluster.state.get('activeObject').properties.getAll()
                );
            }

            cluster.state.events.add('change', () => {
                const activeObject = cluster.state.get('activeObject');
                if (
                    !clusterBalloon ||
                    (clusterBalloon &&
                        activeObject.properties.getAll().index !== clusterBalloon.index)
                ) {
                    setClusterBalloon(activeObject.properties.getAll());
                }
            });
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
            const markerInfo = 'Привет,олень! Мамке Салют';
            placemarkRef.current.properties.set({
                iconCaption: newAddress,
                // balloonContentHeader: "одержимое заголовка балуна геообъекта",
                // balloonContentBody : "содержимое основой части балуна геообъекта",
                // balloonContentFooter : "содержимое нижней части балуна геообъекта.",
                // balloonContent: firstGeoObject.getAddressLine()
                // balloonContentBody: '<a to=`http://localhost:3000/createMarkerDescription/${data}`>+7 (123) 456-78-90</a>'
             // balloonContent: '<a href={`/createMarkerDescription/${data}`}>Перейти к дочернему компоненту</a>'
                balloonContent: `<a href="/createMarkerDescription/${markerInfo}">Перейти к дочернему компоненту</a>`
            });
            regionName =firstGeoObject.getAdministrativeAreas()[0];
        })
        // тут рисутся регионы
        ymaps.borders.load('RU').then(function (geojson) {
            addOldRegionName(regionName)
            for (var i = 0; i < geojson.features.length; i++) {
                if(geojson.features[i].properties.name && geojson.features[i].properties.name === oldRegionName){
                    mapRef.current.geoObjects.remove(oldRegion);
                }
                if (geojson.features[i].properties.name && geojson.features[i].properties.name === regionName) {
                    var polygon = new ymaps.Polygon([
                        geojson.features[i].geometry.coordinates[0]
                    ], {
                        hintContent: "MyPoligon"
                    }, {
                        fillColor: '#6699ff',
                        interactivityModel: 'default#transparent',
                        strokeWidth: 8,
                        opacity: 0.5
                    });

                    mapRef.current.geoObjects.add(polygon);
                    addOldRegion(polygon)
                }
            }
        }) .catch(function (error) {
            console.error(error);
        });
    };

    const markers = [ {
        "coord": "55.79424260833246,49.68814042729016",
        "id": 1,
        "author": "Amir",
        "type": "Мусор",
        "description": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        "evaluation": 10,
        "date":"2001-01-01"
    },
        {
            "coord": "55.62832515119459, 49.11135820072768",
            "id": 2,
            "author": "Amir",
            "type": "Мусор",
            "description": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
            "evaluation": 10,
            "date":"2001-01-01"
        },
        {
            "coord": "55.910118447321, 48.70761064213393",
            "id": 3,
            "author": "Amir",
            "type": "Мусор",
            "description": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
            "evaluation": 10,
            "date":"2001-01-01"
        }
    ]

    const addMarkers = () => {
        setCanAddMarker(!canAddMarker);
    };

    const onMapClick = (e) => {
        var objectId = e.get('id')
        console.log(objectId)
        if (canAddPlacemark){
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
            console.log(coords)
            getAddress(coords);
        }
    };

    const sayHello = () => {
        setCount(count + 1);
        setCanAddPlacemark(count % 2 !== 0);
        for (let i = 0; i < POINTS.length; i++) {
            console.log(POINTS[i].coords[0]+POINTS[i].coords[1]);
        }

    };

    const handleClose2 = () => {
        setShow2(false);
    };

    const handleShow2 = () => {
        setShow2(true);
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
                                ...clusterBalloon
                            })
                        }}
                        onBalloonOpen={openCluster}
                        onBalloonClose={closeDescription}
                    >
                        {POINTS.map((point, index) => (
                            <Placemark
                                key={index}
                                geometry={point.coords}
                                properties={{
                                    balloonContentHeader: point.title,
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
                                    // balloonPanelMaxMapArea: Infinity
                                }}
                            />
                        ))}
                    </Clusterer>
                    <Button
                        onClick={sayHello}
                        data={{ content: "Button" }}
                        options={{ float: "right" }}
                    />
                    <Button
                        onClick={addMarkers}
                        data={{ content: "Вывод маркеров" }}
                        options={{ float: "right" }}
                    />
                </Map>
            </YMaps>
        </div>
    );
};

export default YMap;

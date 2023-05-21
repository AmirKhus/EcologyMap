import React, { useState,useEffect } from 'react';
import { YMaps, Map, Clusterer , Button,Placemark } from '@pbe/react-yandex-maps';
import "../css/ballon.css"
import Header from "./Header";
const mapState = {
    center: [55.7924886417031, 49.12233672582469],
    zoom: 9
};

const YMap = () => {
    
    const placemarkRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const [address, SetAddress] = React.useState("");
    const [count, setValue] = useState(0);
    const [canAddPlacemark, checkAddPlacemark] = useState(false);
    const [oldRegionName, addOldRegionName] = useState();
    const [oldRegion, addOldRegion] = useState();
    const [ymaps, setYmaps] = useState(React.useRef(null));
    const [openedDescription, openDescription] = useState(null);
    const [clusterBalloon, setClusterBalloon] = useState(null);

      const closeDescription = () => {
        setClusterBalloon(null);
        openDescription(null);
      };
    const createPlacemark = (coords) => {
        return new ymaps.current.Placemark(
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
        await  ymaps.current.geocode(coords).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const newAddress = [
                    firstGeoObject.getLocalities().length
                        ? firstGeoObject.getLocalities()
                        : firstGeoObject.getAdministrativeAreas(),
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ]
                    .filter(Boolean)
                    .join(", ");

                SetAddress(newAddress);

                placemarkRef.current.properties.set({
                    iconCaption: newAddress,
                    // balloonContentHeader: "одержимое заголовка балуна геообъекта",
                    // balloonContentBody : "содержимое основой части балуна геообъекта",
                    // balloonContentFooter : "содержимое нижней части балуна геообъекта.",
                    // balloonContent: firstGeoObject.getAddressLine()
                    balloonContent: '     <div> <input type="button" onClick={() => { openDescription(index);}} value="Подробнее"/> </div>'
                });
                regionName =firstGeoObject.getAdministrativeAreas()[0]; 
            })
                // тут рисутся регионы
            ymaps.current.borders.load('RU').then(function (geojson) {
                addOldRegionName(regionName)
                for (var i = 0; i < geojson.features.length; i++) {
                    if(geojson.features[i].properties.name && geojson.features[i].properties.name === oldRegionName){
                        mapRef.current.geoObjects.remove(oldRegion);
                    }
                    if (geojson.features[i].properties.name && geojson.features[i].properties.name === regionName) {
                        var polygon = new ymaps.current.Polygon([
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

    // useEffect(() => {
    //     if (document.getElementById('balloon') && clusterBalloon) {
    //       ReactDOM.hydrate(
    //         <InnerLayout
    //           openDescription={openDescription}
    //           openedDescription={openedDescription}
    //           {...clusterBalloon}
    //         />,
    //         document.getElementById('balloon'),
    //       );
    //     }
    //   }, [clusterBalloon, openedDescription]);

    // const getLayout = (Component, props) => {
    //     if (ymaps) {
    //       const html = ReactDOMServer.renderToString(<Component {...props} />);
    //       const Layout = ymaps.templateLayoutFactory.createClass(
    //         `<div id="balloon">${html}</div>`,
    //         {
    //           build: function() {
    //             Layout.superclass.build.call(this);
    //             ReactDOM.hydrate(
    //               <Component {...props} />,
    //               document.getElementById('balloon'),
    //             );
    //           },
    //         },
    //       );
    
    //       return Layout;
    //     }
    //     return null;
    //   };
    //   const openCluster = e => {
    //     const cluster = e.get('cluster');
    //     if (cluster) {
    //       if (!clusterBalloon) {
    //         setClusterBalloon(
    //           cluster.state.get('activeObject').properties.getAll(),
    //         );
    //       }
    
    //       cluster.state.events.add('change', () => {
    //         const activeObject = cluster.state.get('activeObject');
    //         console.log(activeObject.properties.getAll().index)
    //         console.log(clusterBalloon.index)
    //         if (
    //           !clusterBalloon ||
    //           (clusterBalloon &&
    //             activeObject.properties.getAll().index !== clusterBalloon.index)
    //         ) {
    //           setClusterBalloon(activeObject.properties.getAll());
    //         }
    //       });
    //     }
    //   };
    const addMarkers = () =>{
        let POINTS = [[55.79424260833246, 49.68814042729016],[55.62832515119459, 49.11135820072768],[55.910118447321, 48.70761064213393]]
        
                // Создание макета содержимого балуна.
        // Макет создается с помощью фабрики макетов с помощью текстового шаблона.

        for (let index = 0; index < POINTS.length; index++) {
            const element = POINTS[index];
        // var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        //         getLayout(InnerLayout, {
        //             element,
        //             openedDescription,
        //             openDescription,
        //         }
        //     )
        // )
            var balloonContentBody = '<div class="cd-quick-view">' +
                '<div class="cd-slider-wrapper">' +
                '<ul class="cd-slider">' +
                '<li class="selected"><img src="../img/item-1.jpg" alt="Product 1"></li>' +
                '<li><img src="../img/item-2.jpg" alt="Product 2"></li>' +
                '<li><img src="../img/item-3.jpg" alt="Product 3"></li>' +
                '</ul> ' +
                '<li><img src="https://w7.pngwing.com/pngs/616/389/png-transparent-isolated-animal-leopard-safari-wildlife-africa.png" width="200" height="100"></li>'+
                '<ul class="cd-slider-navigation">' +
                '<li><a class="cd-next" href="#0">Prev</a></li>' +
                '<li><a class="cd-prev" href="#0">Next</a></li>' +
                '</ul> ' +
                '</div> ' +
                '<div class="cd-item-info">' +
                '<h2>Produt Title</h2>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, omnis illo iste ratione. Numquam eveniet quo, ullam itaque expedita impedit. Eveniet, asperiores amet iste repellendus similique reiciendis, maxime laborum praesentium.</p>' +
                '<ul class="cd-item-action">' +
                '<li><button class="add-to-cart">Add to cart</button></li>' +
                '</ul>' +
                '</div>'  +
                '</div>'
        var placemark = new ymaps.Placemark(element, {
            iconContent: "test",
            balloonHeader: 'Заголовок балуна',
            balloonContent:balloonContentBody,            
            balloonFooter: 'Футер балуна'
        },{
            balloonShadow: true,
            // balloonLayout: balloonContentBody,
            // Запретим замену обычного балуна на балун-панель.
            // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
            balloonPanelMaxMapArea: 1,
            hideIconOnBalloonOpen: false
        });
        // Добавим метку на карту.
        mapRef.current.geoObjects.add(placemark);
                
                    // var myPlacemark = new ymaps.Placemark(element, {
                    //     id: index,                
                    //     balloonContent: 'содержимое балуна'+ index,                   
                    //     hintContent: 'содержимое всплывающей подсказки'                   
                    // }, {                    
                    //     preset: 'islands#blueDotIcon'                    
                    // });                                                         
                    // mapRef.current.geoObjects.add(myPlacemark);
                    // console.log(myPlacemark.properties.get('id')); // выведет "id_1"
        // var clusterer = new ymaps.Clusterer({
        //         preset: 'islands#invertedVioletClusterIcons',
        //         groupByCoordinates: false,
        //         balloonPanelMaxMapArea: Infinity,
        //         clusterBalloonItemContentLayout: getLayout(InnerLayout, {
        //           openedDescription,
        //           openDescription,
        //           ...clusterBalloon,
        //         }),
        //         balloonopen:{openCluster},
        //         balloonclose:{closeDescription}
        // })
        // //     key:{index},
        // //     geometry:{element},
        // //     properties:{
        // //       balloonContentHeader:"title",
        // //       element,
        // //       index,
        // //     },
        // //     options:{
        // //         hideIconOnBalloonOpen: false,
        // //       balloonContentLayout: getLayout(InnerLayout, {
        // //         element,
        // //         index,
        // //         openedDescription,
        // //         openDescription,
        // //       }),
        // //       balloonPanelMaxMapArea: Infinity,
        // //     }
        // // });

        // var placemark = new ymaps.Placemark(
        //     element,{
        //         balloonContentHeader:"title"
        //     }
        //     , {
        //         //  Балун будем открывать и закрывать кликом по иконке метки.
        //         hideIconOnBalloonOpen: false,
        //         balloonContentLayout: getLayout(InnerLayout, {
        //         element,
        //         index,
        //         openedDescription,
        //         openDescription,
        //       }),
        //       balloonPanelMaxMapArea: Infinity,
                
        //     }
        //     );
        // clusterer.add(placemark)
        // mapRef.current.geoObjects.add(clusterer);
        }
    }
    const onMapClick = (e) => {
        var objectId = e.get('id')
        console.log(objectId)
        if (canAddPlacemark){
            let objectManager = new ymaps.current.ObjectManager();
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
            getAddress(coords);
        }
    };

    

    function sayHello() {
        setValue(count+1);
        if(count % 2 != 0){
            checkAddPlacemark(canAddPlacemark => !canAddPlacemark)
        }
        else{
            checkAddPlacemark(canAddPlacemark => !canAddPlacemark)
        }

    }


    return (
        <div>
            <Header/>
            <YMaps query={{
                // load: "package.full" ,
                apikey: "106e4ebf-abbc-41b9-9230-adfbc64f15d9" }}>
                <Map defaultState={{
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
                     onLoad={ymaps => setYmaps(ymaps)}
                     state={mapState}
                >
                    <Button  onClick={sayHello} data={{ content: 'Button' }} options={{ float: 'right' }} />
                    <Button  onClick={addMarkers} data={{ content: 'Вывод маркеров' }} options={{ float: 'right' }} />
                </Map>
            </YMaps>
        </div>

    )
}

export default YMap;
import React, { useState } from 'react';
import { YMaps, Map, Button } from '@pbe/react-yandex-maps';
const mapState = {
    center: [55.7924886417031, 49.12233672582469],
    zoom: 9
};
// https://api.geotree.ru/tree_geometry.php?lon="долгота"&lat="широта"&zoom=16&width=999&height=939&id=-2133462&type=t&n=6958 тут мы получаем полигон 
const YMap = () => {
    const ymaps = React.useRef(null);
    const placemarkRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const [address, SetAddress] = React.useState("");
    const [count, setValue] = useState(0);
    const [canAddPlacemark, checkAddPlacemark] = useState(false);
    const [oldRegionName, addOldRegionName] = useState();
    const [oldRegion, addOldRegion] = useState();

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
        
    //     placemarkRef.current.properties.set("iconCaption", "loading..");
    //     ymaps.current.geocode(coords).then((res) => {
    //         const firstGeoObject = res.geoObjects.get(0);

    //         const newAddress = [
    //             firstGeoObject.getLocalities().length
    //                 ? firstGeoObject.getLocalities()
    //                 : firstGeoObject.getAdministrativeAreas(),
    //             firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
    //         ]
    //             .filter(Boolean)
    //             .join(", ");

    //         SetAddress(newAddress);

    //         var geometry = firstGeoObject.geometry;
    //         var bounds = geometry.getBounds();
        
    //         // Получение координат границы объекта
    //         var topLeft = bounds[0];
    //         var bottomRight = bounds[1];
    //         var topRight = [bottomRight[0], topLeft[1]];
    //         var bottomLeft = [topLeft[0], bottomRight[1]];
        
            
    //         console.log(coordinates)

    // Добавление полигона на карту
    // ymaps.geoObjects.add(polygon);
    //         placemarkRef.current.properties.set({
    //             iconCaption: newAddress,
    //             balloonContent: firstGeoObject.getAddressLine()
    //         });
    //     });
        // ymaps.current.borders.load('001')
        // .then(function (geojson) {
        //     // var regions = ymaps.current.geoQuery(geojson);
        //     console.log(ymaps.current.geoQuery(geojson))
        //     // regions.addToMap(ymaps);
        // })
        // .catch(function (error) {
        //     console.error(error);
        // });
        // // ymaps.geocode([longitude, latitude]).then(function (res) {
        // //     var firstGeoObject = res.geoObjects.get(0);
        // //     var address = firstGeoObject.getAddressLine();
        // //     var region = firstGeoObject.getAdministrativeAreas()[1];
        // //     var bounds = firstGeoObject.properties.get('boundedBy');
        
        // //     console.log("Адрес: " + address);
        // //     console.log("Район: " + region);
        // //     console.log("Границы: " + bounds);
        // // });
        // // ymaps.current.geocode('Moscow', {
        
        // //     results: 1
            
        // // }).then((res) => {
            
        // //         let  firstGeoObject = res.geoObjects.get(0);
        // //         let coords = firstGeoObject.geometry.getCoordinates();
    
        // //         console.log(coords);
    
        // //         ymaps.current.borders.load('RU').then((geojson) => {
                    
        // //            console.log(geojson);
                   
        // //         }, (e) => {
                    
        // //            console.log(e);
                   
        // //         });
                
        // //     });
    // };
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
                balloonContent: firstGeoObject.getAddressLine()
            });
            regionName =firstGeoObject.getAdministrativeAreas()[0]; 
            console.log(firstGeoObject.getAdministrativeAreas()[0]);
        })
            
        ymaps.current.borders.load('RU').then(function (geojson) {
            addOldRegionName(regionName)
            console.log("addOldRegion " + oldRegionName)
            for (var i = 0; i < geojson.features.length; i++) {
                if(geojson.features[i].properties.name && geojson.features[i].properties.name === oldRegionName){
                    var geoObject = new ymaps.current.GeoObject(geojson.features[i]);
                    mapRef.current.geoObjects.remove(oldRegion);
                }
                if (geojson.features[i].properties.name && geojson.features[i].properties.name === regionName) {
                    var geoObject = new ymaps.current.GeoObject(geojson.features[i]);
                    mapRef.current.geoObjects.add(geoObject);
                    addOldRegion(geoObject)
                }
            }
        }) .catch(function (error) {
                console.error(error);
        });
    };
    //     if (mapRef && mapRef.current) {
    //       var objectManager = new ymaps.ObjectManager();
    //       ymaps.borders
    //         .load("KZ", {
    //           lang: "ru",
    //           quality: 2
    //         })
    //         .then(function(result) {
    //           // Очередь раскраски.
    //           var queue = [];
    //           // Создадим объект regions, где ключи это ISO код региона.
    //           var regions = result.features.reduce(function(acc, feature) {
    //             // Добавим ISO код региона в качестве feature.id для objectManager.
    //             var iso = feature.properties.iso3166;
    //             feature.id = iso;
    //             // Добавим опции региона по умолчанию.
    //             feature.options = {
    //               fillOpacity: 0.6,
    //               strokeColor: "#FFF",
    //               strokeOpacity: 0.5
    //             };
    //             acc[iso] = feature;
    //             return acc;
    //           }, {});
    //           // Функция, которая раскрашивает регион и добавляет всех нераскрасшенных соседей в очередь на раскраску.
    //           function paint(iso) {
    //             var allowedColors = COLORS.slice();
    //             // Получим ссылку на раскрашиваемый регион и на его соседей.
    //             var region = regions[iso];
    //             var neighbors = region.properties.neighbors;
    //             // Если у региона есть опция fillColor, значит мы его уже раскрасили.
    //             if (region.options.fillColor) {
    //               return;
    //             }
    //             // Если у региона есть соседи, то нужно проверить, какие цвета уже заняты.
    //             if (neighbors.length !== 0) {
    //               neighbors.forEach(function(neighbor) {
    //                 var fillColor = regions[neighbor].options.fillColor;
    //                 // Если регион раскрашен, то исключаем его цвет.
    //                 if (fillColor) {
    //                   var index = allowedColors.indexOf(fillColor);
    //                   if (index !== -1) {
    //                     allowedColors.splice(index, 1);
    //                   }
    //                   // Если регион не раскрашен, то добавляем его в очередь на раскраску.
    //                 } else if (queue.indexOf(neighbor) === -1) {
    //                   queue.push(neighbor);
    //                 }
    //               });
    //             }
    //             // Раскрасим регион в первый доступный цвет.
    //             region.options.fillColor = allowedColors[0];
    //           }
    //           for (var iso in regions) {
    //             // Если регион не раскрашен, добавим его в очередь на раскраску.
    //             if (!regions[iso].options.fillColor) {
    //               queue.push(iso);
    //             }
    //             // Раскрасим все регионы из очереди.
    //             while (queue.length > 0) {
    //               paint(queue.shift());
    //             }
    //           }
    //           // Добавим регионы на карту.
    //           result.features = [];
    //           for (var reg in regions) {
    //             result.features.push(regions[reg]);
    //           }
    //           objectManager.add(result);
    //           mapRef.current.geoObjects.add(objectManager);
    //         });
    //     }
    //   };
    const onMapClick = (e) => {
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
        // }
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
        <YMaps query={{ 
                        // load: "package.full" , 
                        apikey: "106e4ebf-abbc-41b9-9230-adfbc64f15d9" }}>
            <Map defaultState={{
                    center: [55.751574, 37.573856],
                    zoom: 9
                }} 
                modules={["GeoObject","geoQuery","control.ZoomControl", "control.FullscreenControl","Placemark", "geocode", "geoObject.addon.balloon","borders", "ObjectManager"]}
                style={{
                    flex: 2,
                    height: "calc(100vh - 57px)"
                }}
                onClick={onMapClick}    
                instanceRef={mapRef}
                onLoad={(ymapsInstance) => (ymaps.current = ymapsInstance)}
                state={mapState}
            >
                <Button  onClick={sayHello} data={{ content: 'Button' }} options={{ float: 'right' }} />
            </Map>
        </YMaps>
    )
}

export default YMap;
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
            })
                
            ymaps.current.borders.load('RU').then(function (geojson) {
                addOldRegionName(regionName)
                for (var i = 0; i < geojson.features.length; i++) {
                    if(geojson.features[i].properties.name && geojson.features[i].properties.name === oldRegionName){
                        var geoObject = new ymaps.current.GeoObject(geojson.features[i]);
                        mapRef.current.geoObjects.remove(oldRegion);
                    }
                    if (geojson.features[i].properties.name && geojson.features[i].properties.name === regionName) {
                        // var geoObject = new ymaps.current.GeoObject(geojson.features[i]);
                        // console.log(geojson.features[i].geometry.coordinates);
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
                        // mapRef.current.geoObjects.add(geoObject);
                        addOldRegion(polygon)
                    }
                }
            }) .catch(function (error) {
                    console.error(error);
            });
    };
    const onMapClick = (e) => {
        let objectManager = new ymaps.current.ObjectManager();
        objectManager.options.set('geoObjectInteractivityModel', 'default#transparent');
            console.log("test")
            const coords = e.get("coords");
        if (placemarkRef.current) {
            console.log("test")
            placemarkRef.current.geometry.setCoordinates(coords);
        } else {
            placemarkRef.current = createPlacemark(coords);            
            mapRef.current.geoObjects.add(placemarkRef.current);
            placemarkRef.current.events.add("dragend", function () {
                getAddress(placemarkRef.current.geometry.getCoordinates());
            });
        }
        getAddress(coords);
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
                modules={["Polygon","GeoObject","geoQuery","control.ZoomControl", "control.FullscreenControl","Placemark", "geocode", "geoObject.addon.balloon","borders", "ObjectManager"]}
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
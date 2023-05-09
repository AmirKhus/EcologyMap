import React, { useState } from 'react';
import { YMaps, Map, Button } from '@pbe/react-yandex-maps';
const mapState = {
    center: [55.753994, 37.622093],
    zoom: 9
};

const YMap = () => {
    const ymaps = React.useRef(null);
    const placemarkRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const [address, SetAddress] = React.useState("");
    const [count, setValue] = useState(0);
    const [canAddPlacemark, checkAddPlacemark] = useState(false);

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

    const getAddress = (coords) => {
        placemarkRef.current.properties.set("iconCaption", "loading..");
        ymaps.current.geocode(coords).then((res) => {
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
        });
    };

    const onMapClick = (e) => {
        if (canAddPlacemark){
        console.log(e.setApiKey)
        const coords = e.get("coords");
        console.log(coords)
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
        console.log(count)
        console.log(canAddPlacemark)
        if(count % 2 != 0){
            checkAddPlacemark(canAddPlacemark => !canAddPlacemark)
        }
        else{
            checkAddPlacemark(canAddPlacemark => !canAddPlacemark)
        }

    }


    return (    
        <YMaps query={{ apikey: "106e4ebf-abbc-41b9-9230-adfbc64f15d9" }}>
            <Map defaultState={{
                    center: [55.751574, 37.573856],
                    zoom: 9
                }} 
                modules={["control.ZoomControl", "control.FullscreenControl","Placemark", "geocode", "geoObject.addon.balloon"]}
                style={{
                    flex: 2,
                    height: "calc(100vh - 57px)"
                }}
                onClick={onMapClick}
                instanceRef={mapRef}
                onLoad={(ympasInstance) => (ymaps.current = ympasInstance)}
                state={mapState}
            >
                <Button  onClick={sayHello} data={{ content: 'Button' }} options={{ float: 'right' }} />
            </Map>
        </YMaps>
    )
}

export default YMap;
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import MapApiClient from "../../clients/api-client/api-client";
import {v4 as uuid} from "uuid";
import {coordinateConverter} from "../../../utils/converter";
import {WARNING_TEXT} from "../../../utils/const";

export const initialState = {
    results: [],
    routes: [],
    requestError: null,
    isSearchResultLoading: false,
    isRouteLoading: false,
    isPolylineVisible: true,
    mapState: {
        center: [55.75, 37.57],
        zoom: 10,
    }
}

export const fetchSearchResults = createAsyncThunk(
    'mapSlice/fetchSearchResults',
    async (value) => {
        return await MapApiClient.getGeoPosition(value);
    }
)

export const fetchAddressByCoordinates = createAsyncThunk(
    'mapSlice/fetchAddressByCoordinates',
    async ({coordinates, id}) => {
        const {response} = await MapApiClient.getGeoPosition(coordinates)
        return {
            response,
            coordinates,
            id
        };
    }
)

export const mapSlice = createSlice({
    name: 'mapSlice',
    initialState,
    reducers: {
        addRoute: (state, action) => {
            const newRoute = {...action.payload, id: uuid()};
            state.routes.push(newRoute);
            state.mapState = {
                center: action.payload.coordinates,
                zoom: 15,
            }
            state.results = [];
        },
        deleteRoute: (state, action) => {
            const routeIndex = state.routes.findIndex((route) => {
                return route.id === action.payload;
            })
            if (routeIndex >= 0) {
                state.routes.splice(routeIndex, 1);
            }
        },
        changeRoutePositionFromList: (state, action) => {
            state.routes.splice(action.payload.toIndex, 0, state.routes.splice(action.payload.fromIndex, 1)[0]);
        },
        hidePolyline: (state) => {
            state.isPolylineVisible = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, state => {
                state.requestError = null;
                state.isSearchResultLoading= true;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                const data = [...action.payload.response.GeoObjectCollection.featureMember];

                if (!data.length) {
                    state.requestError = WARNING_TEXT.SEARCH_ERROR;
                }

                state.results = data.reduce((result, curPosition) => {
                    const formattedCoordinates = coordinateConverter(curPosition.GeoObject.Point.pos);
                    result.push({
                        address: curPosition.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
                        coordinates: formattedCoordinates,
                    })
                    return result;
                }, []);

                state.isSearchResultLoading = false;
            })
            .addCase(fetchSearchResults.rejected, state => {
                state.isSearchResultLoading = false;
                state.requestError = WARNING_TEXT.REQUEST_ERROR;
            })
            .addCase(fetchAddressByCoordinates.pending, state => {
                state.isRouteLoading = true;
            })
            .addCase(fetchAddressByCoordinates.fulfilled, (state, action) => {
                const data = [...action.payload.response.GeoObjectCollection.featureMember];

                if (!data.length) {
                    throw new Error(WARNING_TEXT.SEARCH_ERROR);
                }

                const newRoute = {
                    address: data[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
                    coordinates: action.payload.coordinates,
                    id: action.payload.id,
                }

                const routeIndex = state.routes.findIndex((route) => {
                    return route.id === action.payload.id;
                })

                state.isPolylineVisible = true;

                state.routes[routeIndex] = newRoute;

                state.isRouteLoading = false;
            })
            .addCase(fetchAddressByCoordinates.rejected, state => {
                state.isRouteLoading = false;
            })
    }
})

export const {
    addRoute,
    deleteRoute,
    changeRoutePositionFromList,
    hidePolyline,
} = mapSlice.actions

export default mapSlice.reducer

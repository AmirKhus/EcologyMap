import {createSelector} from "@reduxjs/toolkit";

const selectMap = state => state.map
export const selectMapState= createSelector(selectMap, (state) => state.mapState)
export const selectSearchLoadingStatus = createSelector(selectMap, (state) => state.isSearchResultLoading)
export const selectRoutesLoadingStatus = createSelector(selectMap, (state) => state.isRouteLoading)
export const selectError = createSelector(selectMap, (state) => state.requestError)
export const selectPolylineVisibleStatus = createSelector(selectMap, (state) => state.isPolylineVisible)
export const selectRoutes = createSelector(selectMap, (state) => state.routes)
export const selectResults = createSelector(selectMap, (state) => state.results)
export const selectCoordinates = createSelector(selectRoutes, (routes) => {
    return routes.map((route) => {
        return route.coordinates;
    })
})

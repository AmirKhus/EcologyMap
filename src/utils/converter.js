export const coordinateConverter = (coordinates) => {
    return coordinates
        .split(" ")
        .map(parseFloat)
        .reverse()
}

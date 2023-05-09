import PropTypes from "prop-types";

export const ROUTE_TYPE = PropTypes.shape({
    address: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
});

class ApiClient {
    API_KEY = "106e4ebf-abbc-41b9-9230-adfbc64f15d9"; //добавлено в демонстрационных целях
    BASE_URL = `https://geocode-maps.yandex.ru/1.x/?apikey=${this.API_KEY}&format=json`;

    async _request(url, options)  {
        return fetch(url, options).then(res => this.checkResponse(res))
    }

    async getGeoPosition(geocode) {
        const query = Array.isArray(geocode) ? `${geocode[1]},${geocode[0]}` : geocode;
        return await this._request(`${this.BASE_URL}&geocode=${query}`);
    }

    async checkResponse(response) {
        if (response.ok) {
            return await response.json();
        } else {
            return Promise.reject();
        }
    }
}

const MapApiClient = new ApiClient();

export default MapApiClient;

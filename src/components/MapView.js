import React, { Component } from 'react'
import MapComponent from './MapComponent'
import axios from 'axios'

class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLatLng: {
                lat: 0,
                lng: 0
            },
            markers: [],
            localdate: [],
            isMarkerShown: false,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            places: []
        }
    }

    componentWillUpdate() {
    }

    componentDidMount() {
        this.delayedShowMarker();
    }

    getTimezone(lat, lng) {
        let location = lat + ',' + lng;
        var targetDate = new Date() // Current date/time of user computer
        var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
        axios.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location + '&timestamp=' + timestamp + '&key=AIzaSyDZ-FKhYjAXL2DNeuX_mAqDq0947Tp6J70')
            .then(res => {
                const timezones = res.data;
                this.setState({ timezones });
                var offsets = timezones.dstOffset * 1000 + timezones.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                var localdate = new Date(timestamp * 1000 + offsets) // (timestamp + dstOffset + rawOffset)
                this.setState({ localdate: localdate.toLocaleString() });
            })
            .catch(err => {
                console.log(err)
            });
    }

    getSunrise(lat, lng) {
        axios.get('https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lng + '&date=today')
            .then(res => {
                const sunrise = res.data.results.sunrise;
                this.setState({ sunrise });
                const sunset = res.data.results.sunset;
                this.setState({ sunset });
            }).catch(err => {
                console.log(err)
            });
    }

    reverseGeocoding(lat, lng) {
        let location = lat + ',' + lng;
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location + '&key=AIzaSyDZ-FKhYjAXL2DNeuX_mAqDq0947Tp6J70')
            .then(res => {
                const place = res.data.results[2].formatted_address;
                this.setState({ place });
            }).catch(err => {
                console.log(err)
            });
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.getInitialGeoLocation()
            this.setState({ isMarkerShown: true })
        }, 5000)
    }

    onMapClicked({ latLng }) {
        this.getTimezone(latLng.lat(), latLng.lng());
        this.reverseGeocoding(latLng.lat(), latLng.lng())
        this.setState(prevState => ({
            currentLatLng: {
                lat: latLng.lat(),
                lng: latLng.lng()
            }
        }))
    }

    getInitialGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.getTimezone(position.coords.latitude, position.coords.longitude);
                    this.reverseGeocoding(position.coords.latitude, position.coords.longitude);
                    this.getSunrise(position.coords.latitude, position.coords.longitude);
                    this.setState(prevState => ({
                        currentLatLng: {
                            ...prevState.currentLatLng,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }))
                }
            )
        } else {
            error => console.log(error)
        }
    };

    render() {
        return (
            <MapComponent
                isMarkerShown={this.state.isMarkerShown}
                onClick={this.onMapClicked.bind(this)}
                currentLocation={this.state.currentLatLng}
                localdate={this.state.localdate}
                place={this.state.place}
                newLocation={this.state.newLatLng}
                sunrise={this.state.sunrise}
                sunset={this.state.sunset}
            >
            </MapComponent>
        )
    }
}

export default MapView;
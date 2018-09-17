import React from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'

const MapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ-FKhYjAXL2DNeuX_mAqDq0947Tp6J70",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={8}
    center={{
      lat: props.currentLocation.lat, lng: props.currentLocation.lng
    }}
    onClick={props.onClick}
  >
    {props.isMarkerShown && <Marker
      position={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
      name={'current location'}
    >
      <InfoWindow onClose={this.onInfoWindowClose} style={{ padding: 0 }}>
        <div>
          <h4 style={{ fontWeight: 'bold', margin: 0, padding: 2 }}>{props.place}</h4>
          <p style={{ fontWeight: 'bold', margin: 0, padding: 2 }}>Local Time:{JSON.stringify(props.localdate)} </p>
          <p style={{ fontWeight: 'bold', margin: 0, padding: 2 }}> Sunrise: {props.sunrise} - Sunset: {props.sunset}</p>
        </div>
      </InfoWindow>
    </Marker>}
  </GoogleMap>
)

export default MapComponent
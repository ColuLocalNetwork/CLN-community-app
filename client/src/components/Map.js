import React, {Component} from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, withProps, withStateHandlers, withState, withHandlers } from "recompose"
import { mapStyle, googleMapsUrl, pagePath } from '../constants/uiConstants'
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	OverlayView
} from "react-google-maps"
import classNames from 'classnames'
import { isBrowser, isMobile, BrowserView, MobileView } from "react-device-detect"
import addresses from '../constants/addresses'
import Marker from 'components/Marker'
import * as uiActions from '../actions/ui'

const panByHorizontalOffset = isMobile ? 0 : 1.4 // because of the community sidebar, so it's a bit off the center
const defaultZoom = isMobile ? 3 : 4
const defaultCenter = isMobile ? { lat: 41.9, lng: 15.49 } : { lat:34.0507729, lng: 32.75446020000004 }

const GoogleMapComponent = compose(
	withProps({
		googleMapURL: googleMapsUrl,
		loadingElement: <div style={{ height: `100%`, backgroundColor: 'rgb(36, 35, 52)' }} />,
		containerElement: <div style={{ width: `100%`,  height: `100vh`, backgroundColor: 'rgb(36, 35, 52)'  }} />,
		mapElement: <div className="map-element" style={{ height: `100%`, backgroundColor: 'rgb(36, 35, 52)' }} />
	}),
	withScriptjs,
	withGoogleMap,
	//withState('zoom', 'zoomIn', 4),
	withHandlers(() => {
		const refs = {map: undefined}

		return {
			onMapMounted: () => ref => {
				refs.map = ref
			},
			onClick: ({zoomIn}) => (location, coinAddress, uiActions) => {
				let n = 5
				refs.map.panTo({lat: parseFloat(location.lat), lng: parseFloat(location.lng) + panByHorizontalOffset})

				uiActions.zoomToMarker(n)
				setTimeout(() => {uiActions.zoomToMarker(n + 1)}, 150)
				setTimeout(() => {uiActions.zoomToMarker(n + 2)}, 300)
				setTimeout(() => {uiActions.zoomToMarker(n + 3)}, 450)

				uiActions.setActiveMarker(coinAddress)
			}
		}
	})
)(props => (
	<GoogleMap
		defaultCenter={defaultCenter}
		defaultOptions={{styles: mapStyle, disableDefaultUI: true}}
		ref={props.onMapMounted}
		style={{backgroundColor: 'rgb(229, 227, 223)'}}
		zoom={props.ui.zoom || defaultZoom}>

		{ props.tokens && props.tokens[addresses.TelAvivCoin] && props.tokens[addresses.TelAvivCoin].metadata &&
			<OverlayView position={props.tokens[addresses.TelAvivCoin].metadata.location.geo}
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
				<Marker
					id={addresses.TelAvivCoin}
					pagePath={pagePath.telaviv.path}
					community={{name: props.tokens[addresses.TelAvivCoin].name, price: '0.9CLN'}}
					onClick={props.onClick.bind(this, props.tokens[addresses.TelAvivCoin].metadata.location.geo, addresses.TelAvivCoin,  props.uiActions)}/>
			</OverlayView>
		}

		{ props.tokens && props.tokens[addresses.HaifaCoin] && props.tokens[addresses.HaifaCoin].metadata &&
			<OverlayView position={props.tokens[addresses.HaifaCoin].metadata.location.geo}
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
				<Marker
					id={addresses.HaifaCoin}
					pagePath={pagePath.haifa.path}
					community={{name: props.tokens[addresses.HaifaCoin].name, price: '0.7CLN'}}
					onClick={props.onClick.bind(this, props.tokens[addresses.HaifaCoin].metadata.location.geo, addresses.HaifaCoin, props.uiActions)}/>
			</OverlayView>
		}

		{ props.tokens && props.tokens[addresses.LondonCoin] && props.tokens[addresses.LondonCoin].metadata &&
			<OverlayView position={props.tokens[addresses.LondonCoin].metadata.location.geo}
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
				<Marker
					id={addresses.LondonCoin}
					pagePath={pagePath.london.path}
					community={{name: props.tokens[addresses.LondonCoin].name, price: '0.7CLN'}}
					onClick={props.onClick.bind(this, props.tokens[addresses.LondonCoin].metadata.location.geo, addresses.LondonCoin, props.uiActions)}/>
			</OverlayView>
		}

		{ props.tokens && props.tokens[addresses.LiverpoolCoin] && props.tokens[addresses.LiverpoolCoin].metadata &&
			<OverlayView position={props.tokens[addresses.LiverpoolCoin].metadata.location.geo}
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
				<Marker
					id={addresses.LiverpoolCoin}
					pagePath={pagePath.liverpool.path}
					community={{name: props.tokens[addresses.LiverpoolCoin].name, price: '0.7CLN'}}
					onClick={props.onClick.bind(this, props.tokens[addresses.LiverpoolCoin].metadata.location.geo, addresses.LiverpoolCoin, props.uiActions)}/>
			</OverlayView>
		}
	</GoogleMap>
));

class MapComponent extends Component {
	render() {
		let mapWrapperClass = classNames({
			"active": this.props.active,
			"map-wrapper": true
		})

		return (
			<div className={mapWrapperClass} >
				<GoogleMapComponent tokens={this.props.tokens} ui={this.props.ui} uiActions={this.props.uiActions}/>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		tokens: state.tokens,
		ui: state.ui
	}
}

const mapDispatchToProps = dispatch => {
    return {
        uiActions: bindActionCreators(uiActions, dispatch),
    }
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MapComponent)

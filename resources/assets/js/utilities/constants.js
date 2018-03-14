import React from 'react';
import SVG  from 'react-inlinesvg';

/**
 * This file is used to define constants in one location that can be used throughout the application.
 * Many of the colors of the application can be changed here, as well as the images used in the application, 
 * and the names of each of the views.
 */

//COLORS
	/**
	 * Colors and labels associated with different ranges of severe ADR counts
	 */
	export const dmeColors = [
		{ color: '#A9A9A9', text: 'None' },
		{ color: '#9E9AC8', text: 'Low' },
		{ color: '#807DBA', text: 'Med. Low' },
		{ color: '#6A51A3', text: 'Med. High' },
		{ color: '#4A1486', text: 'High' }
	];

	/**
	 * Colors and labels associated with different score ranges
	 */
	export const scoreColors = [
		{ color: '#fecc5c', text: 'Low' },
		{ color: '#fd8d3c', text: 'Med. Low' },
		{ color: '#f03b20', text: 'Med. High' },
		{ color: 'hsl(0, 100%, 25%)', text: 'High' }
	];

	/**
	 * Colors associated with node borders for different score ranges (used in Interaction Profile)
	 */
	export const scoreBorderColors = [
		{ color: '#E8BA54' },
		{ color: '#E37E36' },
		{ color: '#C2230C' },
		{ color: '#610000' }
	];

	/**
	 * Color of base node in Interaction Profile (same as color of nodes in Overview).
	 */
	export const baseNodeColor = '#2C98F0';
	/**
	 * Border color of base node in Interaction Profile.
	 */
	export const baseNodeBorderColor = '#0069C0';

	/**
	 * Color of severe ADRs in Interaction Profile.
	 */
	export const severeADRColor = '#6A51A3';
	/**
	 * Color of non-severe ADRs in Interaction Profile.
	 */
	export const regularADRColor = '#A9B0B7';
	// export const adrBorderColor = '#A9B0B7'; not used

	/**
	 * Color of bars in barchart of Report View.
	 */
	export const barColor = '#73B8F0';
	/**
	 * Color of selected bar in barchart of Report View.
	 */
	export const barSelectedColor = '#2C98F0';

	/**
	 * Color used for bar indicating the selected tab.
	 */
	export const selectedColor = '#29ACBF';

	/**
	 * Primary color of the application (used as background of toolbar among others).
	 */
	export const primaryColor = '#AA2C3B';
	/**
	 * Secondary color of the application (used by score distribution).
	 */
	export const secondaryColor = '#A9B0B7';
	/**
	 * Color used for tabs, footer, etc.
	 */
	export const complementaryColor = '#2D3E46';


//images
	/**
	 * WPI logo shown on left of toolbar.
	 */
	export const wpiLogo = <img style={{
		height: 30,
		marginLeft: 20,
	}} 
	src={require('../../../images/WPI_Inst_Prim_White_Rev.png')} />;

	/**
	 * Team picture found on About Us page.
	 */
	export const teamPhoto = <img style={{
		width: '100%'
	}} 
	src={require('../../../images/team_picture.png')} />;

	/**
	 * Drug count icon for toolbar.
	 */
	export const medicines = <SVG src={require('../../../fonts/medicines.svg')} />;

	/**
	 * Interaction count icon for toolbar.
	 */
	export const connection = <SVG src={require('../../../fonts/connection.svg')} />;

//view names
	/**
	 * Display name for the view on the left (previously Overview).
	 */
	export const overviewName = 'Screening Overview';
	/**
	 * Display name for the middle view (previously Galaxy View).
	 */
	export const galaxyViewName = 'Signal Triage View';
	/**
	 * Display name for the view on the right (previously Interaction Profile).
	 */
	export const interactionProfileName = 'Signal Forensics View';
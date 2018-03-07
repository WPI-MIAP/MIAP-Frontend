import React from 'react';
import SVG  from 'react-inlinesvg';

//COLORS
	export const dmeColors = [
		{ color: '#A9A9A9', text: 'None' },
		{ color: '#9E9AC8', text: 'Low' },
		{ color: '#807DBA', text: 'Med. Low' },
		{ color: '#6A51A3', text: 'Med. High' },
		{ color: '#4A1486', text: 'High' }
	];

	export const scoreColors = [
		{ color: '#fecc5c', text: 'Low' },
		{ color: '#fd8d3c', text: 'Med. Low' },
		{ color: '#f03b20', text: 'Med. High' },
		{ color: 'hsl(0, 100%, 25%)', text: 'High' }
	];

	//used in the interaction profile
	export const scoreBorderColors = [
		{ color: '#E8BA54' },
		{ color: '#E37E36' },
		{ color: '#C2230C' },
		{ color: '#610000' }
	];

	export const baseNodeColor = '#2C98F0';
	export const baseNodeBorderColor = '#0069C0';

	export const severeADRColor = '#6A51A3';
	export const regularADRColor = '#A9B0B7';
	export const adrBorderColor = '#A9B0B7';

	export const barColor = '#73B8F0';
	export const barSelectedColor = '#2C98F0';

	export const selectedColor = '#29ACBF';

	export const primaryColor = '#AA2C3B';
	export const secondaryColor = '#A9B0B7';
	export const complementaryColor = '#2D3E46';


//images
	export const wpiLogo = <img style={{
		height: 30,
		marginLeft: 20,
	}} 
	src={require('../../../images/WPI_Inst_Prim_White_Rev.png')} />;

	export const teamPhoto = <img style={{
		width: '100%'
	}} 
	src={require('../../../images/team_picture.jpg')} />;

	export const medicines = <SVG src={require('../../../fonts/medicines.svg')} />;

	export const connection = <SVG src={require('../../../fonts/connection.svg')} />;
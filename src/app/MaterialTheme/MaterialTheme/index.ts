import { createTheme } from '@mui/material/styles';
import shadow from './shadow';
import typography from './typography';

/** "Espresso & Cream" — admin panel bilan bir xil brend ranglari */
export const brand = {
	bg: '#f6f1ea',
	surface: '#ffffff',
	espresso: '#2b1e16',
	espresso2: '#3a2a20',
	caramel: '#c08552',
	caramelDark: '#a46b3c',
	cream: '#efe4d6',
	text: '#2b1e16',
	muted: '#7a6a5d',
	border: '#e8ded2',
};

const light = {
	palette: {
		mode: 'light' as const,
		background: {
			default: brand.bg,
			paper: brand.surface,
		},
		primary: {
			main: brand.caramel,
			dark: brand.caramelDark,
			contrastText: '#ffffff',
		},
		secondary: {
			main: brand.espresso,
			contrastText: '#ffffff',
		},
		text: {
			primary: brand.text,
			secondary: brand.muted,
		},
		divider: brand.border,
	},
	shape: { borderRadius: 12 },
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: { background: brand.bg },
			},
		},
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: {
				root: {
					textTransform: 'none' as const,
					fontWeight: 600,
					borderRadius: 10,
					padding: '10px 20px',
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: { textTransform: 'none' as const, fontWeight: 600, fontSize: 15 },
			},
		},
		MuiPaper: {
			styleOverrides: {
				rounded: { borderRadius: 16 },
			},
		},
	},
	shadow,
	typography,
};

let theme = createTheme(light);
theme = createTheme(theme, {
	components: {
		MuiContainer: {
			styleOverrides: {
				maxWidthLg: {
					[theme.breakpoints.up('lg')]: {
						maxWidth: '1240px',
					},
				},
			},
		},
	},
});

export default theme;

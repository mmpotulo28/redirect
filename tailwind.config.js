import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)"],
				mono: ["var(--font-mono)"],
			},
		},
	},
	darkMode: "class",
	plugins: [
		heroui({
			themes: {
				light: {
					colors: {
						primary: {
							DEFAULT: "#06b6d4", // cyan-500
							foreground: "#ffffff",
						},
						focus: "#06b6d4",
					},
				},
				dark: {
					colors: {
						primary: {
							DEFAULT: "#22d3ee", // cyan-400
							foreground: "#000000",
						},
						focus: "#22d3ee",
					},
				},
			},
		}),
	],
};

module.exports = config;

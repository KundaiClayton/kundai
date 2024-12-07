/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				background: "#1a2027",
				secondary: {
				  100: "#E2E2D5",
				  200: "#888883",
				},
			  },
		},
	},
	plugins: [],
}

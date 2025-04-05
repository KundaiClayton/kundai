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
		typography: {
		  invert: {
			css: {
			  '--tw-prose-body': 'rgba(255, 255, 255, 0.8)',
			  '--tw-prose-headings': 'rgba(255, 255, 255, 0.9)',
			  '--tw-prose-links': 'rgba(251, 146, 60, 0.95)',
			  '--tw-prose-bold': 'rgba(255, 255, 255, 0.9)',
			  '--tw-prose-code': 'rgba(251, 146, 60, 0.95)',
			  '--tw-prose-quotes': 'rgba(255, 255, 255, 0.8)',
			  '--tw-prose-pre-bg': 'rgb(31, 41, 55)',
			  '--tw-prose-pre-code': 'rgba(255, 255, 255, 0.8)',
			  a: {
				color: 'rgba(251, 146, 60, 0.95)',
				'&:hover': {
				  color: 'rgba(251, 146, 60, 0.7)',
				},
			  },
			  code: {
				backgroundColor: 'rgb(31, 41, 55)',
				padding: '0.2em 0.4em',
				borderRadius: '0.375rem',
				fontSize: '0.875em',
			  },
			  'code::before': {
				content: '""',
			  },
			  'code::after': {
				content: '""',
			  },
			  pre: {
				backgroundColor: 'rgb(31, 41, 55)',
				code: {
				  backgroundColor: 'transparent',
				  padding: 0,
				},
			  },
			},
		  },
		},
	  },
	},
	plugins: [
	  require('@tailwindcss/typography'),
	],
  }
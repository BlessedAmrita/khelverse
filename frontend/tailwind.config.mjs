import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
    extend: {
      animation: {
        slowspin: 'slowspin 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        aurora: 'aurora 60s linear infinite',
        scroll:
          'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        gradientMove: 'gradient-animation 2s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'pulse-soft': 'pulse-soft 3s infinite ease-in-out',
				'float': 'float 3s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        slowspin: {
          from: {
						transform: 'rotate(0deg)'
					},
					to: {
						transform: 'rotate(360deg)'
					}
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
        backgroundImage: {
          'gradient-athlete': 'linear-gradient(to bottom right, #1A1F2C, #322A46)',
        },
        scroll: {
          to: { transform: 'translate(calc(-50% - 0.5rem))' },
        },
        gradientAnimation: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
        'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},

        'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},

        'slide-in': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},

        'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},

				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},

				'slide-up': {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
        'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
        
				'pulse-glow': {
					'0%, 100%': {
						filter: 'drop-shadow(0 0 0.75rem #9b87f5)',
					},
					'50%': {
						filter: 'drop-shadow(0 0 1.5rem #D6BCFA)',
					},
				}
      },
      colors: {
        violet: '#150721',

        purple: {
					DEFAULT: '#8E47FF',
					light: '#9b87f5',
          middle:'#7653B8',
					dark: '#4A3D70',
          darker: '#1E1233',
				},

        athletePurple: {
          DEFAULT: '#6E59A5',
          light: '#9b87f5',
          dark: '#1A1F2C',
      },

        khelverse: {
					purple: '#9b87f5',
					'deep-purple': '#7E69AB',
					'dark-purple': '#1A1F2C',
					'light-purple': '#D6BCFA',
					black: '#0F0F10',
					white: '#FFFFFF',
				}, 

        lavender: {
          DEFAULT:'#C2C3FB',
					50: '#f5f3ff',
					100: '#ede9fe',
					200: '#ddd6fe',
					300: '#c4b5fd',
					400: '#a78bfa',
					500: '#8b5cf6',
					600: '#7c3aed',
					700: '#6d28d9',
					800: '#5b21b6',
					900: '#4c1d95',
				},
 
        apts: {
          lightdark:'#222222',
					dark: '#121212',
					darker: '#0a0a0a',
					light: '#f8f8f8',
					lavender: '#9d8df1',
					'dark-purple': '#1A1F2C',
          purple: {
						light: '#9b87f5', 
						DEFAULT: '#9b87f5',
						dark: '#513B8B'
					},
          green: '#4CD964',
					orange: '#FF9500',
					blue: '#5AC8FA',
					black: '#000000',
					white: '#FFFFFF',
				},

        pastelBlue: '#AFC7FF',
        pastelYellow: '#FFF3C9',
        peach: '#FFCCAF',
        blue: '#4C9FF8',
        dustypink:'#9f87b6a1',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sprintura: 'var(--font-sprintura)',
        thuast: 'var(--font-thuast)',
        inter: 'var(--font-inter)',
        poppins: 'var(--font-poppins)',
        montserrat: 'var(--font-montserrat)',
        mindglow: 'var(--font-mindglow)',
        onfarming: 'var(--font-onfarming)',
        sans: ['Inter', 'sans-serif'],
        display: ['SPINTURA', 'Inter', 'sans-serif'],
        'hindi': ['Poppins', 'sans-serif'],
        'samarkan': ['Samarkan', 'sans-serif'],
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
				'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
				'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'elevated': '0 10px 30px rgba(0, 0, 0, 0.1)'
			},
    },
  },
  plugins: [addVariablesForColors, tailwindAnimate],
};

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

export default config;

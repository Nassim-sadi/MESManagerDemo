import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * MES Manager theme.
 *
 * Base: PrimeVue Aura.
 * Changes: a single industrial blue accent (#2563a6), cool neutral surface
 * ramp, compact data table density and squared off corners.
 */
const IndustrialPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f2f7fc',
      100: '#e3eef8',
      200: '#c7dcee',
      300: '#9cc2e0',
      400: '#679fcd',
      500: '#3f81b7',
      600: '#2563a6',
      700: '#1f4f84',
      800: '#1d446d',
      900: '#1c3b5c',
      950: '#13253a',
    },
    focusRing: {
      color: '{primary.color}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f9fa',
          100: '#eef2f5',
          200: '#e3e9ee',
          300: '#d7dee5',
          400: '#bcc7d1',
          500: '#94a3b1',
          600: '#6f7f8f',
          700: '#566473',
          800: '#3f4b57',
          900: '#29333d',
          950: '#18222b',
        },
        text: {
          color: '#182635',
          hoverColor: '#101d2a',
          mutedColor: '#64748b',
          hoverMutedColor: '#47576a',
        },
        formField: {
          color: '{text.color}',
          placeholderColor: '#94a3b1',
          background: '{surface.0}',
          filledBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          disabledBackground: '{surface.100}',
          disabledColor: '{surface.500}',
          iconColor: '{surface.400}',
          shadow: '0 0 0 0 transparent',
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.50}',
          borderColor: '{surface.300}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
      },
      dark: {
        /* Ramp follows Aura's dark convention (0 = white … 950 = near-black),
           so built-in token references stay correct; semantic groups below
           pin the actual dark palette literals. */
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a1120',
        },
        highlight: {
          background: '#22354d',
          focusBackground: '#28415f',
          color: '#c7dcee',
          focusColor: '#e3eef8',
        },
        mask: {
          background: 'rgba(0, 0, 0, 0.6)',
        },
        text: {
          color: '#dbe4ec',
          hoverColor: '#f2f6fa',
          mutedColor: '#94a3b1',
          hoverMutedColor: '#cbd5e1',
        },
        formField: {
          color: '{text.color}',
          placeholderColor: '#64748b',
          background: '{surface.800}',
          filledBackground: '{surface.800}',
          borderColor: '{surface.600}',
          hoverBorderColor: '{surface.500}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          disabledBackground: '{surface.700}',
          disabledColor: '{surface.500}',
          iconColor: '{surface.400}',
          shadow: '0 0 0 0 transparent',
        },
        content: {
          background: '{surface.900}',
          hoverBackground: '{surface.800}',
          borderColor: '{surface.700}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
      },
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '{border.radius.sm}',
        paddingX: '0.7rem',
        paddingY: '0.4rem',
        sm: {
          paddingX: '0.55rem',
          paddingY: '0.3rem',
        },
      },
      // Secondary buttons read as real buttons (bordered chips) instead of
      // PrimeVue's near-invisible gray defaults. Light + dark schemes mirror
      // the app's --mes-* ramps (see variables.css).
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: '{surface.0}',
              hoverBackground: '{surface.100}',
              activeBackground: '{surface.200}',
              borderColor: '{surface.300}',
              hoverBorderColor: '{surface.400}',
              activeBorderColor: '{surface.500}',
              color: '{surface.700}',
              hoverColor: '{surface.900}',
              activeColor: '{surface.950}',
            },
          },
          outlined: {
            secondary: {
              borderColor: '{surface.400}',
              color: '{surface.700}',
              /* White fill reads as elevation against the #eef2f5 canvas;
                 {surface.100} was identical to the canvas (invisible hover). */
              hoverBackground: '#ffffff',
              activeBackground: '#f0f4f8',
            },
          },
          text: {
            secondary: {
              color: '{surface.700}',
              hoverBackground: '{surface.100}',
              activeBackground: '{surface.200}',
            },
          },
        },
        dark: {
          root: {
            secondary: {
              background: '{surface.700}',
              hoverBackground: '{surface.600}',
              activeBackground: '{surface.500}',
              borderColor: '{surface.500}',
              hoverBorderColor: '{surface.400}',
              activeBorderColor: '{surface.400}',
              color: '#f2f6fa',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
            },
          },
          outlined: {
            secondary: {
              borderColor: '{surface.500}',
              color: '#dbe4ec',
              hoverBackground: '{surface.700}',
              activeBackground: '{surface.600}',
            },
          },
          text: {
            secondary: {
              color: '#dbe4ec',
              hoverBackground: '{surface.800}',
              activeBackground: '{surface.700}',
            },
          },
        },
      },
    },
    datatable: {
      headerCell: {
        padding: '0.45rem 0.75rem',
        background: '{surface.100}',
        color: '{surface.700}',
        borderColor: '{surface.300}',
      },
      bodyCell: {
        padding: '0.4rem 0.75rem',
        borderColor: '{surface.200}',
      },
      columnTitle: {
        fontWeight: '600',
      },
      row: {
        hoverBackground: '{surface.50}',
      },
    },
    paginator: {
      root: {
        padding: '0.35rem 0.75rem',
        background: '{surface.50}',
      },
    },
    dialog: {
      root: {
        borderRadius: '{border.radius.md}',
      },
    },
    tag: {
      root: {
        fontSize: '0.6875rem',
      },
    },
  },
})

export default IndustrialPreset

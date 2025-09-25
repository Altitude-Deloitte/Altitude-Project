//mypreset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const ThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#121212',
        },
        primary: {
          color: '#a855f7',
          contrastColor: '#ffffff',
          hoverColor: '#9333ea',
          activeColor: '#7c3aed',
        },
      },
      dark: {
        surface: {
          0: 'ffffff',
          50: '#1a1625',
          100: '#2a1f3d',
          200: '#3a2954',
          300: '#4a326c',
          400: '#5a3c83',
          500: '#6a459b',
          600: '#7a4fb2',
          700: '#8a58ca',
          800: '#9a62e1',
          900: '#121212',
          950: '#09040E',
        },
        primary: {
          color: '#c084fc',
          contrastColor: '#09040E',
          hoverColor: '#d8b4fe',
          activeColor: '#e9d5ff',
          // backgroundColor: '#8D4BFF',
        },
      },
    },
  },
});

export default ThemePreset;

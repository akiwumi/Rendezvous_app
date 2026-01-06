/**
 * Rendezvous Social Club Design System
 * 
 * Color scheme inspired by the Mallorca Rendezvous logo:
 * - Metallic gold/bronze accents
 * - Dark olive green backgrounds
 * 
 * Layout inspired by modern social media mobile app interfaces
 */

export const DesignSystem = {
  // ============================================
  // COLORS
  // ============================================
  colors: {
    // Primary Brand Colors (from logo)
    primary: {
      gold: '#D4AF37',        // Metallic gold
      goldLight: '#E5C158',   // Lighter gold for highlights
      goldDark: '#B8941F',    // Darker gold for depth
      olive: '#556B2F',       // Dark olive green
      oliveLight: '#6B8E3A',  // Lighter olive
      oliveDark: '#3D4F21',   // Darker olive
    },

    // UI Colors (from mobile app interface)
    background: {
      primary: '#FFFFFF',     // Main white background
      secondary: '#F8F9FA',   // Light grey for cards
      tertiary: '#E9ECEF',    // Subtle grey for dividers
      dark: '#556B2F',        // Olive for dark sections
      overlay: 'rgba(0, 0, 0, 0.5)', // For modals/overlays
    },

    // Text Colors
    text: {
      primary: '#1A1A1A',     // Main dark text
      secondary: '#6C757D',   // Secondary grey text
      tertiary: '#ADB5BD',    // Tertiary light grey
      inverse: '#FFFFFF',     // White text for dark backgrounds
      accent: '#D4AF37',      // Gold for accents
    },

    // Status Colors
    status: {
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      info: '#17A2B8',
    },

    // Social/Interactive Colors
    interactive: {
      blue: '#007AFF',        // Profile icons, links
      red: '#FF3B30',         // Notification badges
      purple: '#AF52DE',      // Accent elements
      orange: '#FF9500',      // Accent elements
    },

    // Border Colors
    border: {
      light: '#E9ECEF',
      medium: '#DEE2E6',
      dark: '#ADB5BD',
      accent: '#D4AF37',
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Font Families
    fontFamily: {
      primary: 'System',      // iOS: San Francisco, Android: Roboto
      display: 'System',      // For headings
      body: 'System',         // For body text
      accent: 'System',       // For special text (like "Rendezvous" script)
    },

    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },

    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },

    // Text Styles (predefined combinations)
    styles: {
      h1: {
        fontSize: 36,
        fontWeight: '700',
        lineHeight: 1.2,
        color: '#1A1A1A',
      },
      h2: {
        fontSize: 30,
        fontWeight: '700',
        lineHeight: 1.2,
        color: '#1A1A1A',
      },
      h3: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 1.3,
        color: '#1A1A1A',
      },
      h4: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 1.4,
        color: '#1A1A1A',
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 1.5,
        color: '#1A1A1A',
      },
      bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 1.5,
        color: '#6C757D',
      },
      caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 1.4,
        color: '#6C757D',
      },
      label: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 1.4,
        color: '#1A1A1A',
      },
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1, // Android
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Android
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4, // Android
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8, // Android
    },
  },

  // ============================================
  // LAYOUT
  // ============================================
  layout: {
    // Screen Padding
    screenPadding: {
      horizontal: 16,
      vertical: 16,
    },

    // Card Padding
    cardPadding: {
      horizontal: 16,
      vertical: 12,
    },

    // Component Sizes
    sizes: {
      avatar: {
        sm: 32,
        md: 40,
        lg: 56,
        xl: 80,
      },
      icon: {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
      },
      button: {
        height: {
          sm: 36,
          md: 44,
          lg: 52,
        },
        padding: {
          horizontal: {
            sm: 12,
            md: 16,
            lg: 24,
          },
        },
      },
      dailyCard: {
        width: 120,
        height: 160,
      },
      feedImage: {
        aspectRatio: 1, // Square or adjust as needed
        borderRadius: 12,
      },
    },

    // Navigation
    navigation: {
      height: 56,
      iconSize: 24,
      activeIndicator: {
        height: 2,
        width: 40,
      },
    },

    // Header
    header: {
      height: 56,
      padding: {
        horizontal: 16,
        vertical: 12,
      },
    },
  },

  // ============================================
  // COMPONENT STYLES
  // ============================================
  components: {
    // Button Styles
    button: {
      primary: {
        backgroundColor: '#D4AF37',
        color: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '600',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#D4AF37',
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '600',
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '500',
      },
    },

    // Card Styles
    card: {
      default: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        // Shadow applied via DesignSystem.shadows.md
      },
      daily: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: 120,
        height: 160,
        overflow: 'hidden',
      },
      feed: {
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
        marginBottom: 1,
      },
    },

    // Badge Styles
    badge: {
      notification: {
        backgroundColor: '#FF3B30',
        color: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontSize: 10,
        fontWeight: '600',
        minWidth: 18,
        height: 18,
        textAlign: 'center',
      },
      status: {
        backgroundColor: '#D4AF37',
        color: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
        fontWeight: '600',
      },
    },

    // Avatar Styles
    avatar: {
      default: {
        backgroundColor: '#007AFF',
        borderRadius: 9999,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: '#FFFFFF',
        fontWeight: '600',
      },
    },

    // Input Styles
    input: {
      default: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1A1A1A',
      },
      focused: {
        borderColor: '#D4AF37',
        borderWidth: 2,
      },
      error: {
        borderColor: '#DC3545',
      },
    },
  },

  // ============================================
  // ANIMATIONS
  // ============================================
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // ============================================
  // BREAKPOINTS (for responsive design)
  // ============================================
  breakpoints: {
    sm: 375,   // iPhone SE
    md: 414,   // iPhone Plus
    lg: 768,   // iPad
    xl: 1024,  // iPad Pro
  },
};

// Export individual sections for convenience
export const colors = DesignSystem.colors;
export const typography = DesignSystem.typography;
export const spacing = DesignSystem.spacing;
export const borderRadius = DesignSystem.borderRadius;
export const shadows = DesignSystem.shadows;
export const layout = DesignSystem.layout;
export const components = DesignSystem.components;
export const animations = DesignSystem.animations;
export const breakpoints = DesignSystem.breakpoints;

export default DesignSystem;


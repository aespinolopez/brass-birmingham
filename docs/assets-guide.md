# Assets Guide

This document provides guidelines for creating and managing assets in the Brass Birmingham digital implementation.

## Asset Types

### SVG Graphics
- **Board Elements** - Locations, connections, backgrounds  
- **Industry Tiles** - All industry types and levels
- **Icons** - UI elements, resource symbols
- **Cards** - Card backgrounds and designs

### Raster Images
- **Textures** - Background patterns, materials
- **Decorative Elements** - Historical imagery, embellishments
- **UI Assets** - Buttons, borders, frames

## Design Guidelines

### Visual Style
- **Historical Theme** - Industrial Revolution era aesthetics
- **Color Palette** - Earth tones, industrial colors
- **Typography** - Period-appropriate fonts
- **Iconography** - Clear, recognizable symbols

### Technical Requirements
- **SVG Optimization** - Minimize file size, clean code
- **Scalability** - Vector graphics for all sizes
- **Accessibility** - Good contrast ratios (WCAG AA)
- **Performance** - Optimized for web rendering

### Color Scheme

#### Primary Colors
- **Coal Black** - `#2C2C2C`
- **Iron Gray** - `#6B7280`
- **Brass Gold** - `#D97706`
- **Birmingham Red** - `#DC2626`

#### Player Colors  
- **Player 1** - `#EF4444` (Red)
- **Player 2** - `#3B82F6` (Blue)
- **Player 3** - `#10B981` (Green)
- **Player 4** - `#F59E0B` (Yellow)

#### Market Colors
- **Coal** - `#1F2937` (Dark Gray)
- **Iron** - `#6B7280` (Medium Gray)  
- **Cotton** - `#F3F4F6` (Light Gray)
- **Beer** - `#92400E` (Brown)

## Asset Creation

### SVG Best Practices
- Use semantic structure with proper grouping
- Include meaningful `id` attributes
- Optimize paths and remove unnecessary elements
- Use CSS custom properties for theming
- Include `aria-label` for accessibility

### File Naming
- Use kebab-case for file names
- Include asset type prefix
- Be descriptive but concise

Examples:
- `board-birmingham-map.svg`
- `tile-cotton-mill-level-1.svg`
- `icon-coal-resource.svg`
- `card-background-canal-era.svg`

### Directory Organization
```
assets/
├── svg/
│   ├── board/          # Board-related graphics
│   ├── tiles/          # Industry tile graphics
│   ├── icons/          # UI icons and symbols
│   ├── cards/          # Card designs
│   └── ui/             # General UI elements
└── images/
    ├── textures/       # Background textures
    ├── decorative/     # Decorative elements
    └── ui/             # UI raster images
```

## Implementation

### SVG in React
```typescript
// Import SVG as React component
import BoardMap from '@/assets/svg/board-birmingham-map.svg?react'

// Use in component
<BoardMap className="board-map" />
```

### CSS Integration
```css
.industry-tile {
  --tile-color: var(--color-primary);
  --tile-border: var(--color-border);
}

.industry-tile.coal-mine {
  --tile-color: var(--color-coal);
}
```

### Responsive Scaling
- Use `viewBox` for proper SVG scaling
- Implement CSS `clamp()` for responsive sizing
- Test on various screen sizes and devices

## Asset Quality Checklist

### Before Adding Assets
- [ ] Follows design guidelines
- [ ] Optimized for web performance  
- [ ] Accessible (proper contrast, labels)
- [ ] Consistent with existing style
- [ ] Properly named and organized

### SVG Specific
- [ ] Valid, clean SVG markup
- [ ] Reasonable file size
- [ ] Uses semantic structure
- [ ] Includes accessibility attributes
- [ ] Compatible with React integration

### Raster Images
- [ ] Appropriate format (PNG/JPG/WebP)
- [ ] Optimized compression
- [ ] Multiple resolutions if needed
- [ ] Proper alpha channel handling

---

Following these guidelines ensures consistent, high-quality assets that enhance the game experience while maintaining good performance and accessibility.
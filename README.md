# Sugi Bakery - React Version

Modern React conversion of the Sugi Bakery website with full shopping cart functionality.

## Features

- ⚛️ Built with React 18
- 🛒 Functional shopping cart with add/remove/quantity controls
- 📱 Responsive design
- 🎨 Modern gradient UI with smooth animations
- 🔄 State management with React hooks

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.js       # Navigation and cart button
│   ├── Hero.js         # Hero section
│   ├── Featured.js     # Products section
│   ├── ProductCard.js  # Individual product card
│   ├── About.js        # About section
│   ├── Contact.js      # Contact information
│   └── Cart.js         # Shopping cart sidebar
├── App.js              # Main app with state management
├── App.css             # All styles
└── index.js            # Entry point
```

## Components

- **Header**: Fixed navigation with cart counter
- **Hero**: Landing section with CTA
- **Featured**: Product grid with size/price options
- **ProductCard**: Reusable product display
- **About**: Company information and stats
- **Contact**: Contact details
- **Cart**: Sliding sidebar cart with full functionality

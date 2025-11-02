# Convoy Travels - Car Rental Website

A modern car rental website built with Next.js 15, React, and Tailwind CSS.

## Features

- **Next.js 15** with App Router (file-based routing)
- **JavaScript** (no TypeScript)
- **Tailwind CSS** for styling
- **Responsive Design** - Mobile-first approach
- **Reusable Components** - Navbar and Footer components
- **Multiple Pages** - Home, About, Vehicle Types, Travel, Contact

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

Build the production version:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── travel/            # Travel services page
│   ├── vehicle-types/     # Vehicle types page
│   ├── layout.js          # Root layout with Navbar & Footer
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Navbar.js         # Navigation component
│   ├── Footer.js         # Footer component
│   └── ...               # Other components
├── public/               # Static files
└── ...                   # Config files
```

## Technologies

- Next.js 15
- React 19
- Tailwind CSS
- React Icons
- React Slick (Carousel)
- Swiper (Slides)

## Pages

- **Home** (`/`) - Main landing page with all sections
- **About** (`/about`) - Company information
- **Vehicle Types** (`/vehicle-types`) - Available vehicle categories
- **Travel** (`/travel`) - Travel services and packages
- **Contact** (`/contact`) - Contact information and form

## License

© Copyright 2025 by Convoy Travels

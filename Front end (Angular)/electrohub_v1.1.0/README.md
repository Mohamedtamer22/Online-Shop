# ElectroHub v2 - Premium Electronics Store

ElectroHub is a complete, modern, and high-performance electronics e-commerce application built with **Angular 19**. This version features a clean architecture with separated files for HTML, CSS, and TypeScript, providing a professional-grade codebase.

## ⚡ Key Features

- **Angular 19 Standalone Architecture**: Using the latest stable Angular features.
- **Separated File Structure**: Each component has its own `.html`, `.css`, and `.ts` files for better maintainability.
- **Dynamic Product Catalog**: 20+ realistic products with categories, search, and filtering.
- **Full Shopping Cart**: Persistent cart using LocalStorage with quantity management.
- **Advanced Animations**: Smooth transitions and entrance animations using Angular Animations API.
- **Modern UI/UX**: Professional red/dark/yellow theme with a focus on usability and responsiveness.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

## 🛠️ Technology Stack

- **Framework**: Angular 19+
- **Styling**: Pure CSS3 (No external frameworks)
- **State Management**: RxJS (Reactive Programming)
- **Icons**: Emoji-based (Lightweight, no external dependencies)
- **Fonts**: Poppins (Google Fonts)

## 📂 Project Structure

```text
src/app/
├── components/
│   ├── navbar/         # Separated HTML, CSS, TS
│   ├── footer/         # Separated HTML, CSS, TS
│   └── product-card/   # Separated HTML, CSS, TS
├── pages/
│   ├── home/           # Separated HTML, CSS, TS
│   ├── products/       # Separated HTML, CSS, TS
│   ├── cart/           # Separated HTML, CSS, TS
│   ├── about/          # Separated HTML, CSS, TS
│   └── contact/        # Separated HTML, CSS, TS
├── services/           # Product, Cart, and Order services
└── models/             # TypeScript Interfaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation
1. Extract the project:
   ```bash
   tar -xzf electrohub-v2.tar.gz
   cd electrohub-v2
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the application:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200/`.

## 📦 Production Build
To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/electrohub-v2` directory.

---

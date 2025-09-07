# Chart Application

## Application Overview

This project is a React + TypeScript based task management dashboard that allows users to easily plan, visualize, and manage their work on a quarter-based timeline. The application provides a clear, interactive chart where tasks are displayed as horizontal bars, making it easy to see schedules, overlaps, and deadlines at a glance.

## Key Features

**Add New Tasks** – Users can create tasks with a name, start date, and end date. Input validation ensures correct format (DD.MM.YYYY) and logical date ranges.

**Interactive Timeline** – Tasks are displayed on a responsive timeline with unique colors for quick recognition. Users can view by quarter, with tasks spanning multiple periods shown as partial bars.

**Quarter Navigation** – Simple arrow buttons let users switch between previous and next quarters, updating the chart and visible tasks accordingly.

**Task Details** – Clicking a task opens a view with detailed information.

**Responsive Design** – Optimized for both desktop and mobile. On smaller screens, form fields stack vertically and the timeline scrolls horizontally for easy access.

## Running Locally

### Prerequisites

Before you start, make sure you have installed:

- **Node.js** (version 18 or later)
- **npm** (comes with Node.js)
- **Git** (to clone the repository)

### Installation Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fredkorts/chart-app.git
   cd chart-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open the browser:**
   - Navigate to `http://localhost:5173`
   - The app will load automatically and be ready to use

### Available Scripts

- `npm run dev` - Starts the development server (Vite)
- `npm run build` - Builds the production version
- `npm run preview` - Previews the built version
- `npm run test` - Runs unit tests
- `npm run test:watch` - Runs tests in watch mode
- `npm run lint` - Checks code quality with ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # General components (ErrorDisplay, LoadingSpinner)
│   └── ui/             # UI components (Button, Input, Modal, etc.)
├── features/           # Feature-based modules
│   ├── gantt/         # Gantt chart components and logic
│   └── tasks/         # Task management features
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utilities and constants
└── test/              # Test setup and helpers
```

## Running Unit Tests

The app uses the **Vitest** testing framework together with **React Testing Library**.

### Running Tests

1. **Run all tests:**

   ```bash
   npm run test
   ```

2. **Run tests in watch mode:**

   ```bash
   npm run test:watch
   ```

   This watches files and reruns tests automatically.

3. **Run tests with coverage report:**

   ```bash
   npm run test -- --coverage
   ```

### Testing Setup

- **Test framework:** Vitest
- **Rendering tests:** React Testing Library
- **Assertions:** Vitest built-in assertion library
- **Mocking:** Vitest built-in mocking capabilities

## Technologies

- **Frontend:** React 18, TypeScript
- **UI Library:** Ant Design
- **Styling:** CSS Modules
- **Build:** Vite
- **Testing:** Vitest, React Testing Library
- **Code Quality:** ESLint, TypeScript

## License

This project is licensed under the MIT license.

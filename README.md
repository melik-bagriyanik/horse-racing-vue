# Horse Racing Game

Professional Horse Racing Simulator built with Vue 3, Vuex, and TypeScript.

## Features

- **20 Unique Horses** with different conditions (40-100)
- **6 Race Rounds** with varying distances (1200m - 2200m)
- **Realtime Race Simulation** with animated horse movement
- **Program Generation** - Random horse selection for each round
- **Live Results** - Real-time race results as horses finish
- **Race Sounds** - start,finish and gallop sounds
- **Pause/Resume** functionality
- **Reset** capability
- **Responsive Design** for mobile and tablet

## 🛠️ Technology Stack

- **Frontend:** Vue 3 + TypeScript
- **State Management:** Vuex 4
- **Build Tool:** Vite
- **Testing:** Vitest (Unit) + Cypress (E2E)
- **Styling:** CSS3 with modern design patterns

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── atoms/          # Base components (BaseButton)
│   ├── molecules/      # Compound components (HorseItem)
│   └── organisms/      # Complex components (Header, Racefield, etc.)
├── store/
│   ├── modules/        # Vuex modules (horses, race)
│   ├── types.ts        # TypeScript interfaces
│   └── index.ts        # Main store configuration
├── assets/             # Global styles and assets
└── __tests__/          # Test files
```

## 🎯 Available Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start development server             |
| `npm run build`        | Build for production                 |
| `npm run preview`      | Preview production build             |
| `npm run test:unit`    | Run unit tests (Vitest)              |
| `npm run test:quick`   | Run quick E2E tests (5 tests, ~2s)   |
| `npm run test:full`    | Run full E2E tests (14 tests, ~1min) |
| `npm run test:e2e`     | Run all E2E tests (19 tests, ~1min)  |
| `npm run test:e2e:dev` | Interactive E2E tests                |

### Unit Tests (Vitest)

```sh
npm run test:unit
```

### E2E Tests (Cypress)

```sh
# Quick Tests (5 tests, ~2 seconds)
npm run test:quick

# Full Tests (14 tests, ~1 minute)
npm run test:full

# All E2E Tests (19 tests, ~1 minute)
npm run test:e2e

# Interactive E2E Tests
npm run test:e2e:dev
```

### Test Coverage

- **Unit Tests:** Vuex store modules, Vue components
- **E2E Tests:** Complete user workflows, responsive design
- **Quick Tests:** Essential functionality for fast feedback
- **Full Tests:** Comprehensive testing including edge cases

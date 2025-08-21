# ToniesApp — Expo React Native (MVVM + Clean Architecture)

A sample Expo React Native app using MVVM with a Clean Architecture layout. It uses Expo Router for navigation, Zustand for state management, Awilix for dependency injection, and the native Fetch API for network calls.

## Tech stack
- React Native (via Expo)
- TypeScript
- Expo Router (file-based navigation)
- Zustand (state management / ViewModel)
- Awilix (dependency injection)
- Fetch API (networking)
- Reanimated (animations)
- Nativewind (styling)
- expo-av (audio/video)
- react-native-safe-area-context (safe area handling)

## Getting started
1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```

Then press `i` (iOS), `a` (Android), or `w` (Web).

## Project structure

```
assets/                      # App assets (images, fonts)
app/                         # Expo Router entry & route files (kept minimal)
  _layout.tsx
  +not-found.tsx
  (tabs)/
    _layout.tsx
    index.tsx                # Exports UsersScreen
    explore.tsx              # Exports ExploreScreen

src/
  data/                      # Data layer (infrastructure)
    api/                     # HTTP client
      ApiClient.ts          # fetch-based http<T>() helper
    dtos/                    # Remote DTOs
      UserDto.ts
    mappers/                 # DTO <-> Domain mappers
      UserMapper.ts
    repositories/            # Repository implementations
      UserRepositoryImpl.ts
      RecorderRepositoryImpl.ts

  domain/                    # Domain layer (pure business logic)
    entities/
      User.ts
    repositories/            # Repository contracts
      UserRepository.ts
    usecases/
      GetUsersUseCase.ts

  presentation/              # Presentation layer (UI + ViewModels)
    components/
      ThemedText.tsx
      ThemedView.tsx
      Collapsible.tsx
      ExternalLink.tsx
      HelloWave.tsx
      ParallaxScrollView.tsx
      HapticTab.tsx
      ui/
        IconSymbol.tsx
        IconSymbol.ios.tsx
        TabBarBackground.tsx
        TabBarBackground.ios.tsx
    hooks/
      useColorScheme.ts
      useColorScheme.web.ts
      useThemeColor.ts
    screens/
      UsersScreen.tsx
      ExploreScreen.tsx
      RecorderScreen.tsx
    viewmodels/
      usersStore.ts          # Zustand store (ViewModel)
      recorderStore.ts

  di/                        # Dependency injection setup
    container.ts             # Awilix container (registrations)

  shared/
    constants/
      Colors.ts

expo-env.d.ts
app.json
package.json
tsconfig.json
```

## Architecture overview
- Presentation (React components/screens + Zustand stores as ViewModels)
  - View models expose simple state and actions for the UI
  - Example: `src/presentation/viewmodels/usersStore.ts`
- Domain (business logic, pure and testable)
  - Entities, repository interfaces, and use cases
  - Example: `GetUsersUseCase` depends on `UserRepository` (contract)
- Data (external/infrastructure)
  - Fetch-based HTTP client, DTOs, mappers, repository implementations
  - Example: `UserRepositoryImpl` calls the API and maps DTOs to domain entities
- DI (dependency injection)
  - Awilix container registers concrete implementations and use cases
  - Resolved in presentation layer where needed

### Data flow
UI (Screen) -> ViewModel (Zustand store) -> Use Case -> Repository (impl) -> HTTP Client -> API

## Navigation
- Uses Expo Router with file-based routing under `app/`
- Route files are intentionally thin and export screens from `src/presentation/screens`
- Main layout: `app/_layout.tsx`
- Tabs layout: `app/(tabs)/_layout.tsx`

## Dependency Injection (Awilix)
- Container: `src/di/container.ts`
- Proxy injection with object-arg constructors
  - Registers singletons for `userRepository` and `getUsersUseCase`
  - Resolve in code: `container.resolve<GetUsersUseCase>('getUsersUseCase')`

## State management (Zustand)
- Users ViewModel: `src/presentation/viewmodels/usersStore.ts`
- Provides `users`, `isLoading`, `errorMessage`, and actions `loadUsers`, `refresh`, `clearError`

## Networking (Fetch)
- HTTP helper: `src/data/api/ApiClient.ts`
- Base URL: `https://jsonplaceholder.typicode.com`
- Repository: `src/data/repositories/UserRepositoryImpl.ts`

## Path aliases
- Configured in `tsconfig.json`:
  - `@/*` -> project root (used as `@/src/...` throughout)

## Scripts
- `npm start` / `npx expo start`: run Metro bundler and launch app
- `npm run ios` / `npm run android` / `npm run web`: platform targets
- `npm run lint`: run ESLint
- `npm run reset-project`: reset example starter (provided by Expo template)

## Notes
- Keep `app/` (required by Expo Router). Use it solely for routing; keep UI in `src/presentation`.
- Add new features by creating domain entities/interfaces/use cases, data implementations/mappers, registering in the DI container, and wiring a new ViewModel + screen.

---

### Key Updates:
1. Added **Nativewind**, **expo-av**, and **react-native-safe-area-context** to the "New Packages Added" section.
2. Updated the project structure to include `RecorderScreen.tsx`, `RecorderRepositoryImpl.ts`, and `recorderStore.ts`.
3. Highlighted new features like audio recording and playback.


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
- NativeWind + Tailwind CSS (styling)
- expo-av (audio recording and playback)
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

src/
  data/                      # Data layer (infrastructure)
    api/                     # HTTP client
      ApiClient.ts           # fetch-based http<T>() helper
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
      RecordingItem.ts
    repositories/            # Repository contracts
      UserRepository.ts
      RecorderRepository.ts
    usecases/
      GetUsersUseCase.ts
      StartRecordingUseCase.ts
      StopAndSaveRecordingUseCase.ts
      ListRecordingsUseCase.ts
      PlayRecordingUseCase.ts
      PauseRecordingUseCase.ts
      ResumeRecordingUseCase.ts

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
tailwind.config.js
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
- Route files are thin and export screens from `src/presentation/screens`
- Main layout: `app/_layout.tsx`
- Tabs layout: `app/(tabs)/_layout.tsx`

## Dependency Injection (Awilix)
- Container: `src/di/container.ts`
- Proxy injection with object-arg constructors
  - Registers singletons for repositories and use cases
  - Example resolve: `container.resolve<GetUsersUseCase>('getUsersUseCase')`

## State management (Zustand)
- Users ViewModel: `src/presentation/viewmodels/usersStore.ts`
- Recorder ViewModel: `src/presentation/viewmodels/recorderStore.ts`
  - State: `items`, `isRecording`, `isPaused`, `isPreparing`, `isStopping`, `errorMessage`
  - Actions: `load`, `start`, `pause`, `resume`, `stopAndSave`, `play`, `clearError`

## Networking (Fetch)
- HTTP helper: `src/data/api/ApiClient.ts`
- Base URL: `https://jsonplaceholder.typicode.com`
- Repository: `src/data/repositories/UserRepositoryImpl.ts`

## Audio (expo-av)
- Recording and playback implemented in `src/data/repositories/RecorderRepositoryImpl.ts`
- iOS permission: `NSMicrophoneUsageDescription` in `app.json`
- Audio mode set with `Audio.setAudioModeAsync`
- Filenames saved as: `Recording YYYY-MM-DD HH:MM:SS.m4a`

## Styling (NativeWind + Tailwind)
- Tailwind config: `tailwind.config.js`
  - content: `['./app/**/*.{js,tsx,ts,jsx}', './src/**/**/*.{js,jsx,ts,tsx}']`
  - presets: `[require('nativewind/preset')]`
- Import styles in root layout: `import 'nativewind/css'`
- Components/screens use `className` utility classes

## Path aliases
- Configured in `tsconfig.json`:
  - `@/*` -> project root (used as `@/src/...`)

## Scripts
- `npm start` / `npx expo start`: run Metro bundler and launch app
- `npm run ios` / `npm run android` / `npm run web`: platform targets
- `npm run lint`: run ESLint
- `npm run reset-project`: reset example starter

## Notes
- Keep `app/` (required by Expo Router). Use it only for routing; keep UI in `src/presentation`.
- Add new features by creating domain entities/interfaces/use cases, data implementations/mappers, registering in the DI container, and wiring a new ViewModel + screen.
- On iOS Simulator: enable Features > Audio Input and grant microphone permissions in macOS System Settings if recording fails.


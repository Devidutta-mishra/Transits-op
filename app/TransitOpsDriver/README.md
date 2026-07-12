# TransitOps Driver App

The **TransitOps Driver App** is a native Android application designed specifically for the drivers in the TransitOps logistics network. It serves as the mobile companion to the web-based operations console, providing drivers with real-time access to their assigned trips, vehicle status, and navigation updates.

## Tech Stack

- **Platform:** Android (Native)
- **Language:** Kotlin
- **Build System:** Gradle (Kotlin DSL)
- **UI Toolkit:** Jetpack Compose (or XML depending on implementation)

## Features

- **Trip Management:** View active and upcoming trip assignments (Origin, Destination, ETA).
- **Vehicle Status:** Quickly report maintenance issues, fuel logs, and check the registration of the assigned vehicle.
- **Real-time Sync:** Connects to the TransitOps backend to sync statuses instantly with dispatchers on the web console.
- **Driver-first UI:** Built with large, accessible tap targets and a high-contrast mode for visibility while on the road.

## Getting Started

### Prerequisites

- [Android Studio](https://developer.android.com/studio) (Latest version recommended)
- Java Development Kit (JDK 17+)
- An Android Emulator or a physical Android device for testing

### Installation & Setup

1. **Open the Project:**
   Launch Android Studio, select **Open**, and navigate to the `TransitOpsDriver` directory.
   ```
   path/to/Transits-op/app/TransitOpsDriver
   ```

2. **Sync Gradle:**
   Allow Android Studio to sync the Gradle files and download all necessary dependencies automatically.

3. **Configure the Environment:**
   If the app requires connection to a local backend instance for development, ensure your backend server (e.g., the Node.js API) is running and your device/emulator can access its IP address. 

4. **Build and Run:**
   - Click the **Run** button (green play icon) in Android Studio, or press `Shift + F10`.
   - Select your target device or emulator.
   - The app will compile and launch automatically.

### Building via Command Line

If you prefer to build the APK without Android Studio, you can use the included Gradle wrapper:

```bash
# On Windows
gradlew.bat assembleDebug

# On macOS/Linux
./gradlew assembleDebug
```

The output APK will be generated in `app/build/outputs/apk/debug/`.

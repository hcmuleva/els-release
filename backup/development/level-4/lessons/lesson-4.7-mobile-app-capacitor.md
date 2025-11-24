# Lesson 4.7 - Mobile Development with Capacitor & Android Studio

**Duration**: 120 minutes  
**Difficulty**: Advanced

---

## 🎯 Learning Objectives

1. ✅ Understand Capacitor architecture and how it bridges web to native
2. ✅ Install and configure Android Studio and JDK
3. ✅ Set up Capacitor in your React project
4. ✅ Build Android project with Gradle
5. ✅ Generate signed APK files
6. ✅ Run app on Android emulator
7. ✅ Test on physical devices
8. ✅ Add native device features (camera, storage)
9. ✅ Configure app icons and splash screens
10. ✅ Prepare for Google Play Store deployment

---

## 📱 What is Capacitor?

**Capacitor** is a cross-platform native runtime that bridges your web app (React) to native mobile platforms (Android/iOS).

### Key Benefits:

- ✅ **Single Codebase**: Write once, deploy to web, Android, and iOS
- ✅ **Native Access**: Use device camera, GPS, storage, etc.
- ✅ **Live Reload**: Test changes instantly on emulator/device
- ✅ **Plugin Ecosystem**: 100+ plugins for native features
- ✅ **Web Standards**: Uses standard web APIs when available

### Architecture:

```
┌─────────────────────────────────────┐
│     React Web App (Vite)            │
│  (HTML, CSS, JavaScript)            │
└─────────────────┬───────────────────┘
                  │
                  │ Capacitor Bridge
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐  ┌───────▼────────┐
│   Android      │  │      iOS       │
│  (Java/Kotlin) │  │  (Swift/ObjC)  │
└────────────────┘  └────────────────┘
```

## a

## 🛠️ Step 1: Prerequisites Installation

### 1.1 Install Java Development Kit (JDK)

**Required**: JDK 17 or higher

**Download & Install**:

```bash
# Check if Java is installed
java -version

# If not installed, download from:
# https://www.oracle.com/java/technologies/downloads/
# OR use OpenJDK: https://adoptium.net/
```

After installation, verify:

```bash
java -version
# Should show: openjdk version "17.0.x" or higher
```

**Set JAVA_HOME** (Important!):

**Windows**:

```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
setx PATH "%PATH%;%JAVA_HOME%\bin"
```

**macOS/Linux**:

```bash
# Add to ~/.bashrc or ~/.zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

---

### 1.2 Install Android Studio

**Download**: https://developer.android.com/studio

**Installation Steps**:

1. Download Android Studio (Latest version)
2. Run installer and follow setup wizard
3. Install SDK components:
   - Android SDK Platform 33 (or latest)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (HAXM) - for Windows/macOS

**Set ANDROID_HOME** (Critical!):

**Windows**:

```cmd
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
```

**macOS/Linux**:

```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

**Verify Installation**:

```bash
# Check Android SDK location
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME%  # Windows

# Check ADB (Android Debug Bridge)
adb version
```

---

### 1.3 Install Gradle (Optional - bundled with Android Studio)

Gradle is the build system for Android. Android Studio includes it, but you can install separately:

```bash
# Check if Gradle is installed
gradle -v

# If not, Android Studio's Gradle wrapper will be used automatically
```

---

## 📦 Step 2: Install Capacitor

### 2.1 Install Capacitor Core and CLI

In your React project root:

```bash
cd college-app-client

# Install Capacitor
npm install @capacitor/core @capacitor/cli
```

### 2.2 Initialize Capacitor

```bash
npx cap init
```

**Interactive Prompts**:

```
? App name: College App
? App Package ID: com.yourname.collegeapp
? Web asset directory: dist
```

**Explanation**:

- **App name**: Display name shown on device
- **Package ID**: Unique identifier (reverse domain notation)
- **Web asset directory**: Where Vite builds your app (`dist/`)

This creates `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from "@capacitor/core";

const config: CapacitorConfig = {
  appId: "com.yourname.collegeapp",
  appName: "College App",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
```

---

## 🤖 Step 3: Add Android Platform

### 3.1 Install Android Platform

```bash
npm install @capacitor/android
```

### 3.2 Add Android Project

```bash
npx cap add android
```

**What This Does**:

- Creates `android/` folder
- Generates Android Studio project structure
- Copies web assets to native project
- Creates Gradle build files

**Folder Structure**:

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml  # App permissions
│   │       ├── java/                # Native code
│   │       └── res/                 # Resources (icons, etc)
│   └── build.gradle                 # App build config
├── build.gradle                     # Project build config
├── gradle/                          # Gradle wrapper
├── settings.gradle
└── capacitor.settings.gradle
```

---

## 🏗️ Step 4: Build Web Assets

Before syncing to Android, build your React app:

```bash
# Production build
npm run build
```

This creates optimized files in `dist/` folder.

---

## 🔄 Step 5: Sync Web Assets to Android

After each web build, sync assets:

```bash
npx cap sync android
```

**What `sync` Does**:

1. Copies `dist/` to `android/app/src/main/assets/public/`
2. Updates Capacitor plugins
3. Updates native dependencies

**When to Run `sync`**:

- After `npm run build`
- After installing Capacitor plugins
- After modifying `capacitor.config.ts`

---

## 🚀 Step 6: Open in Android Studio

```bash
npx cap open android
```

**What This Does**:

- Launches Android Studio
- Opens the `android/` project
- Loads Gradle configuration
- Indexes project files (first time takes 5-10 minutes)

**First-Time Setup**:

1. Android Studio will download Gradle dependencies (wait for completion)
2. Accept SDK licenses if prompted
3. Wait for "Gradle Build Finished" in bottom status bar

---

## 📱 Step 7: Run on Android Emulator

### 7.1 Create Emulator (First Time)

In Android Studio:

1. Click **Tools** → **Device Manager**
2. Click **Create Device**
3. Select **Phone** → **Pixel 6** (recommended)
4. Click **Next**
5. Download **System Image**: Android 13 (API 33)
6. Click **Next** → **Finish**

### 7.2 Start Emulator

1. In **Device Manager**, click ▶️ (Play icon) next to your device
2. Wait for emulator to boot (1-2 minutes first time)

### 7.3 Run App

**Method 1: Android Studio**

1. In Android Studio, click **Run** (green ▶️ icon) or press `Shift+F10`
2. Select your emulator from device list
3. Wait for app to install and launch

**Method 2: Command Line**

```bash
# List connected devices/emulators
adb devices

# Install and run app
cd android
./gradlew installDebug  # macOS/Linux
gradlew.bat installDebug  # Windows
```

---

## 📲 Step 8: Run on Physical Device

### 8.1 Enable Developer Options

On your Android phone:

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times (enables Developer Options)
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**

### 8.2 Connect Device

1. Connect phone to computer via USB
2. On phone, tap **Allow USB Debugging** when prompted
3. In terminal, verify connection:

```bash
adb devices
# Should show: <device-id>   device
```

### 8.3 Run App on Device

In Android Studio:

1. Your physical device will appear in device dropdown
2. Click **Run** (green ▶️)
3. App installs and launches on your phone

---

## 🔨 Step 9: Build APK File

### 9.1 Debug APK (Unsigned - for testing)

```bash
cd android

# Build debug APK
./gradlew assembleDebug  # macOS/Linux
gradlew.bat assembleDebug  # Windows
```

**Output Location**:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Install Debug APK**:

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 9.2 Release APK (Signed - for distribution)

**Step 9.2.1: Generate Keystore** (First time only)

```bash
cd android/app

# Generate keystore
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

**Prompts**:

```
Enter keystore password: [create password]
Re-enter password: [confirm password]
What is your first and last name? [Your Name]
What is the name of your organizational unit? [Your Team]
What is the name of your organization? [Your Company]
...
```

**IMPORTANT**: Save `my-release-key.jks` and password securely!

**Step 9.2.2: Configure Gradle Signing**

Create `android/key.properties`:

```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=my-key-alias
storeFile=my-release-key.jks
```

**Add to `.gitignore`**:

```bash
echo "android/key.properties" >> .gitignore
echo "android/app/my-release-key.jks" >> .gitignore
```

**Step 9.2.3: Update `android/app/build.gradle`**

Add before `android { ... }` block:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Step 9.2.4: Build Signed Release APK**

```bash
cd android

# Build release APK
./gradlew assembleRelease  # macOS/Linux
gradlew.bat assembleRelease  # Windows
```

**Output Location**:

```
android/app/build/outputs/apk/release/app-release.apk
```

This APK is ready for distribution!

---

## 🎨 Step 10: Customize App Icons & Splash Screen

### 10.1 Generate App Icons

**Method 1: Online Tool** (Recommended)

1. Visit: https://icon.kitchen/
2. Upload your logo (1024x1024 PNG)
3. Customize colors and style
4. Download Android icon pack
5. Extract to `android/app/src/main/res/`

**Method 2: Manual**

Create icons for different densities:

```
android/app/src/main/res/
├── mipmap-hdpi/
│   └── ic_launcher.png      (72x72)
├── mipmap-mdpi/
│   └── ic_launcher.png      (48x48)
├── mipmap-xhdpi/
│   └── ic_launcher.png      (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png      (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png      (192x192)
```

### 10.2 Add Splash Screen

Install Capacitor Splash Screen plugin:

```bash
npm install @capacitor/splash-screen
```

Sync:

```bash
npx cap sync android
```

**Configure in `capacitor.config.ts`**:

```typescript
import { CapacitorConfig } from "@capacitor/core";

const config: CapacitorConfig = {
  appId: "com.yourname.collegeapp",
  appName: "College App",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1890ff",
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: false,
    },
  },
};

export default config;
```

**Add splash image**:

Place `splash.png` (2732x2732) in:

```
android/app/src/main/res/drawable/splash.png
```

---

## 🔧 Step 11: Add Native Device Features

### 11.1 Camera Access

```bash
npm install @capacitor/camera
npx cap sync android
```

**Add Permission** to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

**Usage in React**:

```jsx
import { Camera, CameraResultType } from "@capacitor/camera";

const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    console.log("Image URI:", image.webPath);
  } catch (error) {
    console.error("Camera error:", error);
  }
};
```

### 11.2 Geolocation

```bash
npm install @capacitor/geolocation
npx cap sync android
```

**Add Permission**:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

**Usage**:

```jsx
import { Geolocation } from "@capacitor/geolocation";

const getCurrentPosition = async () => {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log("Lat:", coordinates.coords.latitude);
    console.log("Lng:", coordinates.coords.longitude);
  } catch (error) {
    console.error("Location error:", error);
  }
};
```

### 11.3 Local Storage (Capacitor Storage)

```bash
npm install @capacitor/preferences
npx cap sync android
```

**Usage**:

```jsx
import { Preferences } from "@capacitor/preferences";

// Save data
await Preferences.set({ key: "user", value: JSON.stringify(userData) });

// Retrieve data
const { value } = await Preferences.get({ key: "user" });
const user = JSON.parse(value);

// Remove data
await Preferences.remove({ key: "user" });
```

---

## 🐛 Step 12: Debugging

### 12.1 Chrome DevTools (Remote Debugging)

1. Connect device/emulator
2. Open Chrome on computer
3. Go to: `chrome://inspect`
4. Click **Inspect** under your app
5. Use DevTools as usual (console, network, etc.)

### 12.2 Android Studio Logcat

1. In Android Studio, click **Logcat** tab (bottom)
2. Filter by package: `com.yourname.collegeapp`
3. View native logs and errors

### 12.3 Live Reload (Development)

Update `capacitor.config.ts` for development:

```typescript
const config: CapacitorConfig = {
  appId: "com.yourname.collegeapp",
  appName: "College App",
  webDir: "dist",
  server: {
    url: "http://192.168.1.100:5173", // Your computer's local IP
    cleartext: true,
  },
};
```

**Steps**:

1. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (macOS/Linux)
2. Update `server.url` with your IP
3. Run `npm run dev` on computer
4. Run `npx cap sync android`
5. Launch app on device
6. Changes auto-reload!

**Revert before building APK**:

```typescript
server: {
  androidScheme: "https";
}
```

---

## 📋 Step 13: Common Capacitor Commands Cheatsheet

```bash
# Initial Setup
npx cap init                    # Initialize Capacitor
npx cap add android             # Add Android platform
npx cap add ios                 # Add iOS platform

# Development Workflow
npm run build                   # Build React app
npx cap sync                    # Sync web assets + plugins to native
npx cap sync android            # Sync to Android only
npx cap copy                    # Copy web assets only (no plugins)
npx cap update                  # Update Capacitor dependencies

# Opening Projects
npx cap open android            # Open Android Studio
npx cap open ios                # Open Xcode (macOS only)

# Running on Device
npx cap run android             # Build + run on Android device/emulator
npx cap run ios                 # Build + run on iOS device/simulator

# Plugin Management
npm install @capacitor/camera   # Install plugin
npx cap sync                    # Sync plugins to native

# Useful Info
npx cap doctor                  # Check Capacitor environment
npx cap ls                      # List installed plugins
```

---

## 🚀 Step 14: Publishing to Google Play Store

### 14.1 Prepare App for Release

**Update Version** in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        ...
        versionCode 1        // Increment for each release
        versionName "1.0.0"  // User-visible version
    }
}
```

### 14.2 Generate Signed APK

Follow **Step 9.2** (already covered above).

### 14.3 Create App Bundle (Recommended)

App Bundles are preferred by Google Play:

```bash
cd android

# Build release bundle
./gradlew bundleRelease
```

**Output**:

```
android/app/build/outputs/bundle/release/app-release.aab
```

### 14.4 Google Play Console Steps

1. Go to: https://play.google.com/console
2. Create new app
3. Fill app details (title, description, screenshots)
4. Upload `app-release.aab`
5. Complete content rating questionnaire
6. Set pricing (free/paid)
7. Submit for review (7-14 days)

---

## ✅ Step 15: Final Checklist

Before releasing your app:

- [ ] Tested on multiple devices/emulators
- [ ] All native permissions added to AndroidManifest.xml
- [ ] App icons configured (all densities)
- [ ] Splash screen working
- [ ] Version code and name updated
- [ ] Signed APK/Bundle generated
- [ ] No console errors in Chrome DevTools
- [ ] Tested offline functionality
- [ ] Privacy policy URL added (if collecting data)
- [ ] Terms of service added
- [ ] App tested in production mode (`assembleRelease`)

---

## 🎯 Final Exercise

**Task**: Build and Deploy Mobile App

Requirements:

1. Install Android Studio and JDK
2. Initialize Capacitor in your React project
3. Add Android platform
4. Build and sync web assets
5. Run app on Android emulator
6. Add camera plugin and test
7. Customize app icon and splash screen
8. Generate signed release APK
9. Test APK on physical device
10. (Optional) Upload to Google Play Store

---

## 🐛 Troubleshooting Common Errors

### Error: "ANDROID_HOME not set"

**Solution**:

```bash
# Set environment variable (see Step 1.2)
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### Error: "Gradle build failed"

**Solutions**:

```bash
# Clean Gradle cache
cd android
./gradlew clean

# Check Java version
java -version  # Should be 17+

# Invalidate Android Studio cache
# File → Invalidate Caches → Restart
```

### Error: "No devices found"

**Solutions**:

- Start emulator in Android Studio
- Enable USB debugging on physical device
- Check connection: `adb devices`
- Restart ADB: `adb kill-server && adb start-server`

### Error: "Could not find gradle wrapper"

**Solution**:

```bash
# Regenerate wrapper
cd android
gradle wrapper
```

### Error: "App not loading on device"

**Solutions**:

- Check `capacitor.config.ts` has correct `webDir`
- Run `npm run build`
- Run `npx cap sync android`
- Clear app data on device
- Check network permissions in AndroidManifest.xml

---

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Gradle Build System](https://developer.android.com/build)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Material Design for Android](https://material.io/design)

---

## 🎓 What You've Learned

Congratulations! You now know:

✅ How Capacitor bridges web to native  
✅ Setting up Android development environment  
✅ Building Android apps from React code  
✅ Generating signed APK files  
✅ Testing on emulators and devices  
✅ Adding native device features  
✅ Customizing app appearance  
✅ Debugging mobile apps  
✅ Publishing to Google Play Store

---

## 🚀 Next Steps

1. **iOS Development**: Add iOS platform (`npx cap add ios`)
2. **Push Notifications**: Integrate Firebase Cloud Messaging
3. **App Performance**: Use React Native Performance monitoring
4. **Analytics**: Add Firebase Analytics
5. **Monetization**: Implement in-app purchases
6. **CI/CD**: Automate builds with GitHub Actions

---

**You're now a full-stack mobile developer!** 📱🎉

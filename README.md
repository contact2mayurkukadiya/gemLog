# Gem Log 📊💎

[![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-19.2.0-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)


A modern, responsive Progressive Web App (PWA) designed for diamond traders and jewelers to efficiently log and manage daily diamond entries with customizable price tiers. Built with Angular and powered by Firebase for seamless data management.


## 🌐 Live Demo

[🚀 View Live Demo](https://contact2mayurkukadiya.github.io/gemLog/#/auth/login)

## ✨ Features

- 🔐 **Authentication**: Secure user authentication with Firebase Auth
- 📅 **Daily Logging**: Log diamond entries with price tiers and quantities
- 💰 **Price Tiers Management**: Create and manage custom price tiers for different diamond categories
- 🌍 **Internationalization**: Support for multiple languages (English, French, German, etc.)
- 🌓 **Theme Support**: Light and dark themes for comfortable viewing
- 📱 **PWA Ready**: Installable on mobile devices with offline capabilities
- 🔄 **Real-time Sync**: Data synchronization across devices via Firebase Firestore
- 📊 **Dashboard**: Overview of monthly logs and statistics
- 🎨 **Modern UI**: Built with ng-zorro-antd for a professional interface

## 🛠️ Tech Stack

- **Frontend**: Angular 19.2.0
- **Backend**: Firebase (Auth, Firestore)
- **UI Library**: ng-zorro-antd
- **Internationalization**: ngx-translate
- **Styling**: SCSS with custom themes
- **PWA**: Angular Service Worker
- **Build Tool**: Angular CLI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gem-log.git
cd gem-log
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Copy your Firebase configuration to `src/environments/environment.ts` and `src/environments/environment.prod.ts`

Example configuration:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  }
};
```

### 4. Run the Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200/`. It will automatically reload when you make changes to the source files.

## 📖 Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Set Up Price Tiers**: Configure your diamond price tiers in the Settings section
3. **Log Entries**: Add daily diamond entries with quantities and price tiers
4. **View Dashboard**: Monitor your monthly logs and statistics
5. **Install PWA**: On mobile devices, you can install the app for offline access

## 🏗️ Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/gem-log/browser/` directory.

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### End-to-End Tests

```bash
npm run e2e
```

## 📱 PWA Features

- **Offline Support**: Core functionality works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Push Notifications**: Stay updated with new features (configurable)
- **Background Sync**: Data syncs when connection is restored

## 🌐 Supported Languages

- English
- French
- German
- Gujarati
- Hebrew
- Hindi
- Dutch
- Portuguese
- Russian
- Thai
- Chinese (Simplified)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular](https://angular.io/) - The web framework used
- [Firebase](https://firebase.google.com/) - Backend services
- [ng-zorro-antd](https://ng.ant.design/) - UI component library
- [ngx-translate](https://github.com/ngx-translate/core) - Internationalization

---

## 🚀 Deployment

### Option 1: Deploy to GitHub Pages

1. **Install angular-cli-ghpages** (if not already installed globally):

   ```bash
   npm install -g angular-cli-ghpages
   ```

2. **Build the project** for production:

   ```bash
   ng build --configuration production
   ```

3. **Deploy to GitHub Pages**:

   ```bash
   angular-cli-ghpages --dir=dist/gem-log/browser
   ```

   > **Note**: Ensure your GitHub repository is configured for Pages deployment from the `gh-pages` branch in the repository settings.

### Option 2: Deploy to Firebase Hosting

Since this project uses Firebase, you can deploy directly to Firebase Hosting for better integration:

1. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting** in your project (if not done):

   ```bash
   firebase init hosting
   ```

   Select your Firebase project and configure the public directory as `dist/gem-log/browser`.

4. **Build and deploy**:

   ```bash
   ng build --configuration production
   firebase deploy
   ```

   Your app will be available at your Firebase hosting URL (e.g., `https://your-project.web.app`).

### Additional Deployment Tips

- **Environment Configuration**: Make sure `environment.prod.ts` has the correct Firebase configuration for production.
- **Base Href**: For GitHub Pages with a repository name, you may need to add `--base-href=/your-repo-name/` to the build command.
- **CORS Issues**: If deploying to custom domains, ensure CORS is properly configured in Firebase.
- **SSL**: Firebase Hosting provides automatic SSL certificates.

---

Made with ❤️ for the diamond trading community

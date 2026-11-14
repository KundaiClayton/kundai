---
title: "Setting Up Dual Apps with Expo: Development and UAT"
description: "Learn how to set up and manage separate Development and UAT apps using Expo, streamlining your React Native development process with automated builds and TestFlight deployments."
date: 2024-07-28
type: Article
status: complete
tags: ["react", "expo", "github actions", "eas", "testflight"]
featured: false
published: true
slug: "expo-dual-app-setup-dev-uat-workflow"
cover: "/garden/expo-dual-app-setup-dev-uat-workflow/cover.png"
---

## Introduction
This document outlines our specific process for setting up and managing two separate apps using Expo: a Development app and a User Acceptance Testing (UAT) app. This dual-app approach allows our team to rapidly iterate on new features while maintaining a stable version for stakeholder testing and demos.
## Prerequisites and Assumptions
Before proceeding, ensure you have:
- An Expo account and the Expo CLI installed
- An Apple Developer account
- EAS (Expo Application Services) set up for your project
- Basic familiarity with React Native and Expo
- Git installed and configured
We assume you have already initialized your Expo project according to the [official documentation](https://docs.expo.dev/tutorial/create-your-first-app/).
## Git Workflow
We use a modified GitFlow workflow:
1. **Feature Development**:
	- Developers work on feature branches locally.
	- Use local simulators for initial testing and development.
2. **Integration with Develop Branch**:
	- When a feature is complete, merge the feature branch into the develop branch.
	- The develop branch represents our latest integrated state of all features.
3. **Development App Deployment**:
	- Deployments to the Louvelle Dev app are triggered manually from GitHub Actions.
	- This builds the app from the develop branch and submits it to TestFlight.
4. **UAT Preparation**:
	- Once satisfied with the Development app, merge the develop branch into the uat branch.
	- Pushing changes to the uat branch automatically triggers the UAT deployment.
5. **UAT App Deployment**:
	- The UAT app is automatically built from the uat branch and submitted to TestFlight.
Understanding this workflow is crucial for following the setup process below.
## Step-by-Step Setup Guide
### 1. Convert app.json to app.config.js
Convert the default `app.json` to `app.config.js` to enable dynamic configuration:
```javascript
const IS_DEV = process.env.APP_VARIANT === 'dev';

export default {
  name: IS_DEV ? 'Appy Dev' : 'Appy',
  slug: 'louvelle-mobile',
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? 'app.appy.dev' : 'app.appy.prod',
  },
  // ... other configurations
};

```
For more on dynamic configuration, see the [Expo documentation](https://docs.expo.dev/workflow/configuration/#dynamic-configuration).
### 2. Create Apps in App Store Connect
Before configuring EAS, create your apps in App Store Connect:
1. Log in to your Apple Developer account and go to App Store Connect.
2. Create two separate apps:
	- Main app (e.g., "Appy")
	- Development app (e.g., "Appy Dev")
3. Note down for each app:
	- Bundle ID
	- Apple ID (your Apple developer account email)
	- App Store Connect App ID (ascAppId)
	- Apple Team ID
### 3. Configure eas.json
Set up your `eas.json` file with the information from App Store Connect:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "dev": {
      "autoIncrement": true,
      "channel": "dev",
      "env": {
        "APP_VARIANT": "dev"
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-production-asc-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    },
    "dev": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-dev-asc-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}

```
Replace the placeholders with your actual values.
### 4. Generate App Signing Credentials
Run the following command to set up credentials for both apps:
```shell
expo credentials

```
For more information, see:

- [Generating App Signing Credentials](https://docs.expo.dev/app-signing/managed-credentials/#generating-app-signing-credentials)
- [Inspecting Credentials Configuration](https://docs.expo.dev/app-signing/managed-credentials/#inspecting-credentials-configuration)
### 5. Build and Submit Your Apps
Build and submit your apps using EAS:
For the development app:
```shell
eas build --profile dev --platform ios
eas submit --profile dev --platform ios

```
For the production app:
```shell
eas build --profile production --platform ios
eas submit --profile production --platform ios

```
## Automated Builds with GitHub Actions
We use a daily cron job with GitHub Actions to build and deploy the app to TestFlight for all changes in the last 24 hours. This ensures a new build in TestFlight every morning for dev builds.
To manually trigger a build for the louvelle-dev app:
1. Go to the Louvelle Mobile GitHub repository.
2. Click on the "Actions" tab.
3. Select "EAS Build and Submit-Dev" in the left sidebar.
4. Click "Run workflow", choose the branch (typically develop), and start the build.
## Conclusion
This dual app setup with Expo streamlines our development process, allowing rapid feature iteration while maintaining a stable version for stakeholders. While initial setup requires effort, the long-term benefits in flexibility and reliability are substantial.
Remember, you can further customize this setup to fit specific needs, such as adding more environments or configuring different backend URLs for each app.

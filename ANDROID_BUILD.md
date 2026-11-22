# HẢI AI VIDEO PRO — Android build

## Current milestone
The repository now contains the first responsive Vietnamese dashboard prototype. Product URL parsing is client-side and recognizes Shopee/TikTok domains; the current list is session-only demo state. No real product scraping, Veo generation, or MP4 export is claimed yet.

## Build Android shell
Requires Node.js 20+, Android Studio, Android SDK, and a JDK supported by the installed Android Gradle Plugin.

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio, wait for Gradle sync, then Build > Build Bundle(s) / APK(s) > Build APK(s).

## Next integration milestones
1. Persist projects and uploaded product assets via authenticated backend storage.
2. Add safe product metadata input/manual image upload. Do not ask users for marketplace passwords, OTPs, or cookies. Only use official/authorized product APIs where available.
3. Add server-side Gemini script generation and a provider adapter for video generation. Google Flow is a user-facing creative interface; do not assume it exposes a public automation API. Connect Veo only through an officially supported API/product flow and user-authorized credentials.
4. Add TTS, subtitle timing, FFmpeg render queue, H.264/AAC export, job progress and retry handling.
5. Store all API keys server-side; never bundle secrets in the APK.

## Environment
Use server-side environment variables only. Never commit .env files or API keys.

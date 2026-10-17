# Android WebView back integration

The web app registers `window.solhandleAndroidBack()`, a synchronous function returning `true` when it handles the gesture and `false` at the app root when Android should use its normal exit behavior. Listeners are removed when the app unmounts.

The separate Android host project is now included under `src/components/solhandle/android/project/` and can be downloaded as a ZIP from `/android`. It forwards AndroidX `OnBackPressedDispatcher` to this function, includes an origin-restricted native Mobile Wallet Adapter bridge, and local signing/build scripts. The project is source, not a prebuilt APK; build and validate it on a real device before publishing a release. AndroidX routes both physical Back and completed system back gestures through the callback.

Example inside the Activity, with `webView` referring to the app's existing WebView:

```kotlin
onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
    override fun handleOnBackPressed() {
        webView.evaluateJavascript(
            "Boolean(window.solhandleAndroidBack && window.solhandleAndroidBack())"
        ) { handled ->
            if (handled != "true") {
                isEnabled = false
                onBackPressedDispatcher.onBackPressed()
                isEnabled = true
            }
        }
    }
})
```

Imports: `androidx.activity.OnBackPressedCallback` and, when using the extension overload elsewhere, `androidx.activity.addCallback`. Configure Android's predictive-back manifest opt-in as required by the host's target SDK and AndroidX version.

Existing event-based shells may dispatch either `document.dispatchEvent(new Event('backbutton', { cancelable: true }))` or `window.dispatchEvent(new Event('solhandle:android-back', { cancelable: true }))` instead. Send only one signal per completed gesture. Do not also call `webView.goBack()` for the same gesture: that would pop twice. Browser-originated `popstate` is already handled by React Router and must not be forwarded as another Back request.

Back first dismisses an open dialog/menu using its existing Escape handling. Otherwise it pops the current tab's route stack through React Router, falls back to the browser's in-app previous entry, or returns a deep link to the app root. It does not sign transactions or authorize payments.

Visited bottom tabs remain mounted in memory, preserving drafts, filters and local component state when switching tabs. Hidden tabs are excluded from scrolling and accessibility. Double-tapping the active tab clears that tab's cache. Connecting a first wallet preserves the current draft; changing or disconnecting an existing wallet clears cached private state. A full reload or leaving the mobile app surface clears the mounted-state cache; no transaction or signing state is serialized.

The root `next-themes` provider uses `attribute="class"`, `defaultTheme="system"`, `enableSystem`, and `enableColorScheme`; it replaces the previous manual media-query listener.
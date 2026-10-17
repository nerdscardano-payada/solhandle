package io.solhandle.android

import android.content.Intent
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.widget.LinearLayout
import android.widget.ProgressBar
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature

class MainActivity : ComponentActivity() {
    private lateinit var web: WebView
    private lateinit var wallet: WalletBridge
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal)
        web = WebView(this)
        layout.addView(progress, LinearLayout.LayoutParams(-1, 4))
        layout.addView(web, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(layout)
        ViewCompat.setOnApplyWindowInsetsListener(layout) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.ime())
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom); insets
        }
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            android.app.AlertDialog.Builder(this).setMessage("Update Android System WebView before using SolHandle.")
                .setPositiveButton("Close") { _, _ -> finish() }.setCancelable(false).show()
            return
        }
        with(web.settings) {
            javaScriptEnabled = true; domStorageEnabled = true
            allowFileAccess = false; allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            javaScriptCanOpenWindowsAutomatically = false
            userAgentString += " SolHandleAndroid/1"
        }
        android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(web, false)
        web.webViewClient = TrustedNavigation.client(this)
        web.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, value: Int) { progress.progress = value; progress.visibility = if (value == 100) android.view.View.GONE else android.view.View.VISIBLE }
        }
        wallet = WalletBridge(this, web)
        wallet.attach()
        web.setDownloadListener { url, _, _, _, _ -> TrustedNavigation.openExternal(this, android.net.Uri.parse(url)) }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (wallet.busy) return
                web.evaluateJavascript("Boolean(window.solhandleAndroidBack && window.solhandleAndroidBack())") { handled ->
                    if (handled != "true") {
                        if (web.canGoBack()) web.goBack() else finish()
                    }
                }
            }
        })
        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null)
            web.loadUrl(TrustedNavigation.appLink(intent) ?: BuildConfig.APP_ORIGIN)
    }
    override fun onNewIntent(intent: Intent) { super.onNewIntent(intent); setIntent(intent); TrustedNavigation.appLink(intent)?.let { web.loadUrl(it) } }
    override fun onSaveInstanceState(outState: Bundle) { web.saveState(outState); super.onSaveInstanceState(outState) }
    override fun onDestroy() { if (::web.isInitialized) { web.stopLoading(); web.destroy() }; super.onDestroy() }
}
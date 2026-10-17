package io.solhandle.android

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast

object TrustedNavigation {
    fun isTrusted(uri: Uri): Boolean = uri.scheme == "https" && uri.host == Uri.parse(BuildConfig.APP_ORIGIN).host && (uri.port == -1 || uri.port == 443) && uri.userInfo == null
    fun openExternal(activity: MainActivity, uri: Uri) {
        if (uri.scheme !in setOf("https", "mailto", "tel")) return
        try {
            activity.startActivity(Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE))
        } catch (_: ActivityNotFoundException) {
            Toast.makeText(activity, "No app available to open this link.", Toast.LENGTH_LONG).show()
        }
    }
    fun client(activity: MainActivity) = object : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            if (!request.isForMainFrame) return !isTrusted(request.url)
            if (isTrusted(request.url)) return false
            // Do not execute arbitrary intent:// or javascript/file/content URLs from pages.
            openExternal(activity, request.url)
            return true
        }
        override fun onReceivedError(view: WebView, request: WebResourceRequest, error: android.webkit.WebResourceError) {
            if (request.isForMainFrame) android.app.AlertDialog.Builder(activity)
                .setTitle("Unable to load SolHandle").setMessage("Check your connection and try again.")
                .setPositiveButton("Retry") { _, _ -> view.loadUrl(BuildConfig.APP_ORIGIN) }
                .setNegativeButton("Close") { _, _ -> activity.finish() }.show()
        }
    }
    fun appLink(intent: Intent?): String? {
        val uri = intent?.data ?: return null
        if (uri.scheme != "solhandle" || uri.host != "open") return null
        val path = uri.getQueryParameter("path") ?: "/"
        if (!path.startsWith("/") || path.startsWith("//") || path.contains('\\')) return null
        val target = Uri.parse(BuildConfig.APP_ORIGIN + path)
        return target.toString().takeIf { isTrusted(target) }
    }
}
package io.solhandle.android

import android.net.Uri
import android.webkit.WebView
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewCompat
import com.solana.mobilewalletadapter.clientlib.*
import kotlinx.coroutines.launch
import org.json.JSONObject

class WalletBridge(private val activity: MainActivity, private val web: WebView) {
    private val sender = ActivityResultSender(activity)
    private val adapter = MobileWalletAdapter(ConnectionIdentity(Uri.parse(BuildConfig.APP_ORIGIN), Uri.parse("favicon.ico"), "SolHandle"))
        .apply { blockchain = Solana.Mainnet }
    var busy = false
        private set
    fun attach() {
        WebViewCompat.addWebMessageListener(web, "SolHandleNative", setOf(BuildConfig.APP_ORIGIN)) { _, message, origin, mainFrame, reply ->
            if (!mainFrame || !TrustedNavigation.isTrusted(origin) || !TrustedNavigation.isTrusted(Uri.parse(web.url ?: ""))) return@addWebMessageListener
            val raw = message.data ?: return@addWebMessageListener
            if (raw.length > 100000) return@addWebMessageListener
            val request = runCatching { JSONObject(raw) }.getOrNull() ?: return@addWebMessageListener
            val id = request.optString("id").takeIf { it.length in 1..80 } ?: return@addWebMessageListener
            fun respond(value: JSONObject) { reply.postMessage(value.put("id", id).toString()) }
            if (busy) { respond(JSONObject().put("error", "A wallet request is already open.")); return@addWebMessageListener }
            busy = true
            activity.lifecycleScope.launch {
                try {
                    val method = request.getString("method")
                    if (method == "disconnect") {
                        try {
                            if (adapter.authToken != null) adapter.disconnect(sender)
                        } finally { adapter.authToken = null }
                        respond(JSONObject().put("result", JSONObject()))
                    } else {
                        val result = adapter.transact(sender) { auth -> WalletOperations.execute(this, auth, request) }
                        when (result) {
                            is TransactionResult.Success -> respond(JSONObject().put("result", result.payload))
                            is TransactionResult.NoWalletFound -> respond(JSONObject().put("error", "Install an MWA-compatible Solana wallet, such as Solflare, and try again."))
                            is TransactionResult.Failure -> respond(JSONObject().put("error", "Wallet request failed or was declined. Return to SolHandle and review before retrying."))
                        }
                    }
                } catch (_: Exception) {
                    respond(JSONObject().put("error", "Wallet request could not be completed. Review before retrying."))
                } finally { busy = false }
            }
        }
    }
}
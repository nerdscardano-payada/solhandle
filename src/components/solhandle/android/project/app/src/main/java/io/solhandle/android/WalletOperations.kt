package io.solhandle.android

import android.util.Base64
import com.solana.mobilewalletadapter.clientlib.AdapterOperations
import com.solana.mobilewalletadapter.clientlib.protocol.MobileWalletAdapterClient.AuthorizationResult
import org.json.JSONArray
import org.json.JSONObject

object WalletOperations {
    private fun encode(bytes: ByteArray) = Base64.encodeToString(bytes, Base64.NO_WRAP)
    suspend fun execute(ops: AdapterOperations, auth: AuthorizationResult, request: JSONObject): JSONObject {
        val method = request.getString("method")
        if (method == "connect") return JSONObject().put("accounts", JSONArray(auth.accounts.map { account ->
            JSONObject().put("publicKey", encode(account.publicKey)).put("label", account.accountLabel ?: "Solana wallet")
        }))
        require(method == "signTransaction" || method == "signMessage") { "Unsupported wallet method" }
        val publicKey = Base64.decode(request.getString("publicKey"), Base64.DEFAULT)
        require(auth.accounts.any { it.publicKey.contentEquals(publicKey) }) { "Account changed; connect again" }
        val payload = Base64.decode(request.getString("payload"), Base64.DEFAULT)
        require(payload.isNotEmpty() && payload.size <= if (method == "signTransaction") 1232 else 4096)
        return if (method == "signTransaction") {
            val signed = ops.signTransactions(arrayOf(payload)).signedPayloads.single()
            JSONObject().put("signedTransaction", encode(signed))
        } else {
            val signed = ops.signMessagesDetached(arrayOf(payload), arrayOf(publicKey)).messages.single()
            JSONObject().put("signature", encode(signed.signatures.single())).put("signedMessage", encode(signed.message))
        }
    }
}
plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android {
    namespace = "io.solhandle.android"
    compileSdk = 35
    defaultConfig {
        applicationId = "io.solhandle.android"
        minSdk = 26
        targetSdk = 35
        versionCode = providers.gradleProperty("releaseCode").orElse("1").get().toInt()
        versionName = providers.gradleProperty("releaseVersion").orElse("1.0.0").get()
        buildConfigField("String", "APP_ORIGIN", "\"https://solhandle.io\"")
    }
    buildFeatures { buildConfig = true }
    signingConfigs {
        create("release") {
            System.getenv("SOLHANDLE_KEYSTORE")?.let { storeFile = file(it) }
            storePassword = System.getenv("SOLHANDLE_STORE_PASSWORD")
            keyAlias = "solhandle"
            keyPassword = System.getenv("SOLHANDLE_KEY_PASSWORD")
        }
    }
    buildTypes { getByName("release") { signingConfig = signingConfigs.getByName("release"); isMinifyEnabled = false } }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("androidx.activity:activity-ktx:1.10.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.9.0")
    implementation("androidx.webkit:webkit:1.13.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2")
    implementation("com.solanamobile:mobile-wallet-adapter-clientlib-ktx:2.0.8")
}
package app.pulse.compose

import app.pulse.compose.models.AppData
import compose.composeapp.generated.resources.Res
import org.jetbrains.compose.resources.ExperimentalResourceApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString

@OptIn(ExperimentalResourceApi::class)
suspend fun fetchAppData(): AppData {
    val bytes = Res.readBytes("files/data.json")
    val jsonString = bytes.decodeToString()
    return Json { ignoreUnknownKeys = true }.decodeFromString(jsonString)
}

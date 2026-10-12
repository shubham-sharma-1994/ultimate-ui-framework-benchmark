package app.pulse.compose.models

import kotlinx.serialization.Serializable

@Serializable
data class ItemData(
    val id: Int,
    val title: String,
    val subtitle: String,
    val score: Int,
    val colors: List<String>,
    val body: String
)

@Serializable
data class AppData(
    val items: List<ItemData>
)

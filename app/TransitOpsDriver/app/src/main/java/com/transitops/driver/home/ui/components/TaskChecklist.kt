package com.transitops.driver.home.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp

// Backend currently doesn't provide a specific task list, but we keep this for UI placeholder
// and future integration if needed.
@Composable
fun TaskChecklist(
    onTaskToggle: (String, Boolean) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Today's Tasks",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Placeholder tasks
            val tasks = listOf("Check Vehicle Oil", "Update Logbook", "Verify Cargo")
            tasks.forEach { title ->
                TaskItem(title = title, isCompleted = false, onToggle = { /* TODO */ })
            }
        }
    }
}

@Composable
private fun TaskItem(
    title: String,
    isCompleted: Boolean,
    onToggle: (Boolean) -> Unit
) {
    val iconColor by animateColorAsState(
        targetValue = if (isCompleted) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
        label = "iconColor"
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = { onToggle(!isCompleted) }) {
            Icon(
                imageVector = if (isCompleted) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                contentDescription = null,
                tint = iconColor
            )
        }
        Text(
            text = title,
            style = MaterialTheme.typography.bodyLarge,
            textDecoration = if (isCompleted) TextDecoration.LineThrough else null,
            color = if (isCompleted) MaterialTheme.colorScheme.outline else MaterialTheme.colorScheme.onSurface
        )
    }
}

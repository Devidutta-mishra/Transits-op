package com.transitops.driver.home.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

import com.transitops.driver.home.model.QuickActionsDto

data class QuickAction(
    val title: String,
    val icon: ImageVector,
    val color: androidx.compose.ui.graphics.Color
)


@Composable
fun QuickActionsGrid(
    quickActions: QuickActionsDto?,
    onActionClick: (String) -> Unit
) {
    val actions = mutableListOf<QuickAction>()
    
    if (quickActions?.canStartTrip == true) {
        actions.add(QuickAction("Start Trip", Icons.Default.PlayArrow, MaterialTheme.colorScheme.primary))
    }
    if (quickActions?.canEndTrip == true) {
        actions.add(QuickAction("End Trip", Icons.Default.Stop, MaterialTheme.colorScheme.error))
    }
    
    actions.addAll(listOf(
        QuickAction("Scan QR", Icons.Default.QrCodeScanner, MaterialTheme.colorScheme.secondary),
        QuickAction("Report Issue", Icons.Default.ReportProblem, androidx.compose.ui.graphics.Color(0xFFF57C00)),
        QuickAction("Fuel Entry", Icons.Default.LocalGasStation, MaterialTheme.colorScheme.tertiary),
        QuickAction("Maintenance", Icons.Default.Build, MaterialTheme.colorScheme.outline),
        QuickAction("Documents", Icons.Default.Description, MaterialTheme.colorScheme.primary),
        QuickAction("Schedule", Icons.Default.Event, MaterialTheme.colorScheme.secondary)
    ))

    Column(modifier = Modifier.padding(vertical = 16.dp)) {
        Text(
            text = "Quick Actions",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 12.dp)
        )
        
        // We use a fixed height for the grid or just use a Column if we want it to scroll with the main list.
        // For a dashboard, a non-scrolling grid is often better if inside a scrolling parent.
        // We can use a custom FlowRow or just 2 rows of 4 items.
        
        Column {
            for (i in 0 until 2) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    for (j in 0 until 4) {
                        val index = i * 4 + j
                        if (index < actions.size) {
                            ActionItem(
                                action = actions[index],
                                onClick = { onActionClick(actions[index].title) },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun ActionItem(
    action: QuickAction,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        modifier = modifier.aspectRatio(1f),
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        shadowElevation = 1.dp
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(8.dp)
        ) {
            Icon(
                imageVector = action.icon,
                contentDescription = null,
                tint = action.color,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = action.title,
                style = MaterialTheme.typography.labelSmall,
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

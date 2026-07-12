package com.transitops.driver.home.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.transitops.driver.R

@Composable
fun MapPreviewCard(
    onOpenNavigation: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(240.dp)
            .padding(vertical = 8.dp),
        shape = MaterialTheme.shapes.large,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Map Placeholder Background
            // In a real app, this would be a Google Map or a static map image
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFE0E0E0)) // Light gray map background
            ) {
                // Drawing a fake route line
                // This is just a placeholder for the map
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Navigation,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                    )
                    Text(
                        "Live Map Preview",
                        color = MaterialTheme.colorScheme.outline,
                        style = MaterialTheme.typography.labelLarge
                    )
                }
            }

            // ETA Overlay
            Surface(
                modifier = Modifier
                    .padding(12.dp)
                    .align(Alignment.TopStart),
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f),
                tonalElevation = 4.dp
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Navigation,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "12 min (4.5 km)",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Open Navigation Button
            Button(
                onClick = onOpenNavigation,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(12.dp),
                contentPadding = PaddingValues(horizontal = 16.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Fullscreen, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("OPEN NAV")
            }
            
            // Current Speed Overlay
            Surface(
                modifier = Modifier
                    .padding(12.dp)
                    .align(Alignment.BottomStart),
                shape = androidx.compose.foundation.shape.CircleShape,
                color = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Column(
                    modifier = Modifier.size(56.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("65", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("km/h", fontSize = 10.sp)
                }
            }
        }
    }
}

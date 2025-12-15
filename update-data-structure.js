#!/usr/bin/env node
/**
 * Script to transform restaurant data structure from single resort to multiple resorts
 * Usage: node update-data-structure.js
 * 
 * This script:
 * 1. Reads data.js
 * 2. Calculates distances from each restaurant to all resorts
 * 3. Only includes resorts within 30 miles
 * 4. Sorts resorts by distance (closest first)
 * 5. Transforms restaurant.resort (string) to restaurant.resorts (array)
 * 6. Writes updated data back to data.js
 */

const fs = require('fs');
const path = require('path');

// Distance calculation (Haversine formula) - returns distance in miles
function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Read and evaluate data.js
const dataPath = path.join(__dirname, 'data.js');
console.log('Reading data.js...');

// Use require to load the data module
// First, we need to make it exportable, so we'll eval it in a controlled way
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Create a safe evaluation context
const vm = require('vm');
const context = { module: {}, exports: {}, require: require, console: console };
vm.createContext(context);

// Execute the data.js content
try {
    vm.runInContext(dataContent, context);
    // If data.js doesn't export, try to extract it
    const skiEatsData = context.skiEatsData || eval('(' + dataContent.replace(/^const skiEatsData = /, '').replace(/;?\s*$/, '') + ')');
} catch (e) {
    // Fallback: use eval with the const declaration removed
    const modifiedContent = dataContent.replace(/^const skiEatsData = /, 'let skiEatsData = ');
    eval(modifiedContent);
}

const MAX_DISTANCE_MILES = 30;
const restaurants = skiEatsData.restaurants;
const resorts = skiEatsData.resorts;

console.log(`Processing ${restaurants.length} restaurants across ${resorts.length} resorts...`);

let transformedCount = 0;
let skippedCount = 0;
let multiResortCount = 0;

const transformedRestaurants = restaurants.map((restaurant, index) => {
    if ((index + 1) % 50 === 0) {
        console.log(`Processing restaurant ${index + 1}/${restaurants.length}...`);
    }

    if (!restaurant.coordinates || !restaurant.coordinates.lat || !restaurant.coordinates.lng) {
        skippedCount++;
        // Restaurant has no coordinates - convert old resort to array format
        if (restaurant.resort) {
            return {
                ...restaurant,
                resorts: [{ id: restaurant.resort, distance: null }]
            };
        }
        return restaurant;
    }

    const restaurantLat = restaurant.coordinates.lat;
    const restaurantLng = restaurant.coordinates.lng;
    const nearbyResorts = [];

    // Calculate distance to all resorts
    resorts.forEach(resort => {
        if (resort.coordinates && resort.coordinates.lat && resort.coordinates.lng) {
            const distance = calculateDistanceMiles(
                restaurantLat,
                restaurantLng,
                resort.coordinates.lat,
                resort.coordinates.lng
            );

            // Only include resorts within 30 miles
            if (distance <= MAX_DISTANCE_MILES) {
                nearbyResorts.push({
                    id: resort.id,
                    distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
                });
            }
        }
    });

    // Sort by distance (closest first)
    nearbyResorts.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
    });

    // If restaurant had an old resort property, ensure it's included
    // (it might be slightly over 30 miles but we want to preserve the relationship)
    if (restaurant.resort) {
        const existingResort = nearbyResorts.find(r => r.id === restaurant.resort);
        if (!existingResort) {
            // Calculate distance to the old resort
            const oldResort = resorts.find(r => r.id === restaurant.resort);
            if (oldResort && oldResort.coordinates) {
                const distance = calculateDistanceMiles(
                    restaurantLat,
                    restaurantLng,
                    oldResort.coordinates.lat,
                    oldResort.coordinates.lng
                );
                // Include even if over 30 miles (preserve existing relationships)
                nearbyResorts.push({
                    id: restaurant.resort,
                    distance: Math.round(distance * 10) / 10
                });
                // Re-sort
                nearbyResorts.sort((a, b) => {
                    if (a.distance === null && b.distance === null) return 0;
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                });
            } else {
                // Resort data missing coordinates, add with null distance at beginning
                nearbyResorts.unshift({
                    id: restaurant.resort,
                    distance: null
                });
            }
        }
    }

    transformedCount++;
    if (nearbyResorts.length > 1) {
        multiResortCount++;
    }

    // Create new restaurant object
    const newRestaurant = { ...restaurant };
    delete newRestaurant.resort; // Remove old single resort property
    newRestaurant.resorts = nearbyResorts.length > 0 ? nearbyResorts : [];

    return newRestaurant;
});

// Update the data object
skiEatsData.restaurants = transformedRestaurants;

// Write back to file - we need to stringify properly
console.log('Writing transformed data back to data.js...');

// Create the new file content
const newContent = `// SNOGRUB - Ski Resort and Dining Data
const skiEatsData = ${JSON.stringify(skiEatsData, null, 4)};
`;

// Write to file
fs.writeFileSync(dataPath, newContent, 'utf8');

console.log('\n✅ Transformation complete!');
console.log(`   - Processed: ${transformedCount} restaurants`);
console.log(`   - Skipped (no coordinates): ${skippedCount} restaurants`);
console.log(`   - Restaurants with multiple resorts: ${multiResortCount}`);
console.log(`   - Updated data.js with new structure`);




#!/usr/bin/env node
/**
 * Transform data.js file: Change restaurant.resort to restaurant.resorts array
 * This script uses regex to safely transform the data structure
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

const dataPath = path.join(__dirname, 'data.js');
console.log('Reading data.js...');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Load the data using a safer method
// Since data.js exports skiEatsData as const, we need to parse it differently
try {
    // Create a temporary file that exports the data
    const tempFile = path.join(__dirname, 'temp-data-loader.js');
    const exportContent = dataContent.replace(/^const skiEatsData = /, 'module.exports = ');
    fs.writeFileSync(tempFile, exportContent, 'utf8');
    
    // Load the data
    delete require.cache[require.resolve('./temp-data-loader.js')];
    const skiEatsData = require('./temp-data-loader.js');
    
    console.log(`Loaded: ${skiEatsData.resorts?.length || 0} resorts, ${skiEatsData.restaurants?.length || 0} restaurants`);
    
    const MAX_DISTANCE_MILES = 30;
    const restaurants = skiEatsData.restaurants || [];
    const resorts = skiEatsData.resorts || [];
    
    let transformedCount = 0;
    let multiResortCount = 0;
    
    const transformedRestaurants = restaurants.map((restaurant, index) => {
        if ((index + 1) % 20 === 0) {
            console.log(`Processing ${index + 1}/${restaurants.length}...`);
        }
        
        if (!restaurant.coordinates || !restaurant.coordinates.lat || !restaurant.coordinates.lng) {
            // No coordinates - convert old resort to array
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
                
                if (distance <= MAX_DISTANCE_MILES) {
                    nearbyResorts.push({
                        id: resort.id,
                        distance: Math.round(distance * 10) / 10
                    });
                }
            }
        });
        
        // Sort by distance
        nearbyResorts.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
        
        // Ensure original resort is included if it exists
        if (restaurant.resort) {
            const hasOriginal = nearbyResorts.some(r => r.id === restaurant.resort);
            if (!hasOriginal) {
                const originalResort = resorts.find(r => r.id === restaurant.resort);
                if (originalResort && originalResort.coordinates) {
                    const distance = calculateDistanceMiles(
                        restaurantLat,
                        restaurantLng,
                        originalResort.coordinates.lat,
                        originalResort.coordinates.lng
                    );
                    nearbyResorts.push({
                        id: restaurant.resort,
                        distance: Math.round(distance * 10) / 10
                    });
                    nearbyResorts.sort((a, b) => a.distance - b.distance);
                } else {
                    nearbyResorts.unshift({ id: restaurant.resort, distance: null });
                }
            }
        }
        
        transformedCount++;
        if (nearbyResorts.length > 1) {
            multiResortCount++;
        }
        
        const newRestaurant = { ...restaurant };
        delete newRestaurant.resort;
        newRestaurant.resorts = nearbyResorts.length > 0 ? nearbyResorts : [];
        
        return newRestaurant;
    });
    
    // Update the data object
    skiEatsData.restaurants = transformedRestaurants;
    
    // Write back - need to format as JavaScript, not JSON
    console.log('Writing transformed data...');
    
    // Create formatted output
    let output = '// SNOGRUB - Ski Resort and Dining Data\n';
    output += 'const skiEatsData = ' + JSON.stringify(skiEatsData, null, 4) + ';\n';
    
    fs.writeFileSync(dataPath, output, 'utf8');
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    console.log('\n✅ Transformation complete!');
    console.log(`   - Processed: ${transformedCount} restaurants`);
    console.log(`   - Restaurants with multiple resorts: ${multiResortCount}`);
    console.log(`   - Updated data.js with new structure`);
    
} catch (error) {
    console.error('Error transforming data:', error);
    process.exit(1);
}







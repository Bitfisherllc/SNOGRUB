// Transformation script to convert restaurant.resort (single) to restaurant.resorts (array)
// This script calculates distances to all resorts within 30 miles and creates the new structure

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
    return R * c; // Distance in miles
}

// Transform restaurants to include multiple resorts within 30 miles
function transformRestaurantResorts(restaurants, resorts) {
    const MAX_DISTANCE_MILES = 30;
    const transformed = restaurants.map(restaurant => {
        if (!restaurant.coordinates || !restaurant.coordinates.lat || !restaurant.coordinates.lng) {
            // If restaurant has no coordinates, keep old structure but convert to array format
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
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });

        // If restaurant had an old resort property but it's not in nearbyResorts, add it
        // This handles edge cases where distance calculation might miss valid relationships
        if (restaurant.resort) {
            const existingResort = nearbyResorts.find(r => r.id === restaurant.resort);
            if (!existingResort) {
                // Resort might be just outside 30 miles, but we'll include it with calculated distance
                const oldResort = resorts.find(r => r.id === restaurant.resort);
                if (oldResort && oldResort.coordinates) {
                    const distance = calculateDistanceMiles(
                        restaurantLat,
                        restaurantLng,
                        oldResort.coordinates.lat,
                        oldResort.coordinates.lng
                    );
                    nearbyResorts.push({
                        id: restaurant.resort,
                        distance: Math.round(distance * 10) / 10
                    });
                    // Re-sort after adding
                    nearbyResorts.sort((a, b) => a.distance - b.distance);
                } else {
                    // Resort data missing, add with null distance
                    nearbyResorts.unshift({
                        id: restaurant.resort,
                        distance: null
                    });
                }
            }
        }

        // Create new restaurant object with resorts array
        const newRestaurant = { ...restaurant };
        delete newRestaurant.resort; // Remove old single resort property
        newRestaurant.resorts = nearbyResorts.length > 0 ? nearbyResorts : [];

        return newRestaurant;
    });

    return transformed;
}

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { transformRestaurantResorts, calculateDistanceMiles };
}

// For browser environment
if (typeof window !== 'undefined') {
    window.transformRestaurantResorts = transformRestaurantResorts;
    window.calculateDistanceMiles = calculateDistanceMiles;
}




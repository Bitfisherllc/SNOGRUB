#!/usr/bin/env node

/**
 * Restaurant Validator Helper
 * 
 * Validates that a restaurant is within 40 miles of its associated resort
 * before adding it to the data.
 * 
 * Usage:
 *   node add-restaurant-validator.js <restaurant-lat> <restaurant-lng> <resort-id>
 * 
 * Example:
 *   node add-restaurant-validator.js 39.5080 -79.3800 wisp-resort
 */

const { calculateDistance, loadData } = require('./validate-restaurant-distances.js');

const MAX_DISTANCE_MILES = 40;

function validateNewRestaurant(restaurantLat, restaurantLng, resortId) {
    const lat = parseFloat(restaurantLat);
    const lng = parseFloat(restaurantLng);
    
    if (isNaN(lat) || isNaN(lng)) {
        console.error('❌ Error: Invalid coordinates. Please provide valid numbers.');
        console.error('   Example: node add-restaurant-validator.js 39.5080 -79.3800 wisp-resort');
        process.exit(1);
    }
    
    const skiEatsData = loadData();
    const resort = skiEatsData.resorts.find(r => r.id === resortId);
    
    if (!resort) {
        console.error(`❌ Error: Resort '${resortId}' not found.`);
        console.error('\nAvailable resorts:');
        skiEatsData.resorts.forEach(r => {
            console.error(`   - ${r.id} (${r.name})`);
        });
        process.exit(1);
    }
    
    if (!resort.coordinates || !resort.coordinates.lat || !resort.coordinates.lng) {
        console.error(`❌ Error: Resort '${resort.name}' does not have coordinates.`);
        process.exit(1);
    }
    
    const distance = calculateDistance(
        lat,
        lng,
        resort.coordinates.lat,
        resort.coordinates.lng
    );
    
    console.log('\n' + '='.repeat(80));
    console.log('RESTAURANT DISTANCE VALIDATION');
    console.log('='.repeat(80));
    console.log(`Restaurant coordinates: ${lat}, ${lng}`);
    console.log(`Resort: ${resort.name} (${resortId})`);
    console.log(`Resort coordinates: ${resort.coordinates.lat}, ${resort.coordinates.lng}`);
    console.log(`Distance: ${distance.toFixed(2)} miles`);
    console.log(`Maximum allowed: ${MAX_DISTANCE_MILES} miles`);
    console.log('='.repeat(80));
    
    if (distance <= MAX_DISTANCE_MILES) {
        console.log('\n✅ VALID: Restaurant is within the allowed distance!');
        console.log(`   You can safely add this restaurant to the data.`);
        return true;
    } else {
        console.log('\n❌ INVALID: Restaurant is beyond the allowed distance!');
        console.log(`   This restaurant is ${(distance - MAX_DISTANCE_MILES).toFixed(2)} miles too far.`);
        console.log(`   Please find a restaurant closer to ${resort.name}.`);
        return false;
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.error('Usage: node add-restaurant-validator.js <restaurant-lat> <restaurant-lng> <resort-id>');
        console.error('\nExample:');
        console.error('  node add-restaurant-validator.js 39.5080 -79.3800 wisp-resort');
        console.error('\nTo find restaurant coordinates, use Google Maps:');
        console.error('  1. Search for the restaurant on Google Maps');
        console.error('  2. Right-click on the location');
        console.error('  3. Click on the coordinates to copy them');
        process.exit(1);
    }
    
    const [restaurantLat, restaurantLng, resortId] = args;
    const isValid = validateNewRestaurant(restaurantLat, restaurantLng, resortId);
    process.exit(isValid ? 0 : 1);
}

module.exports = { validateNewRestaurant };




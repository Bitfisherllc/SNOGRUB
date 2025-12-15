#!/usr/bin/env node

/**
 * Restaurant Distance Validation Script
 * 
 * This script validates that all restaurants are within 40 miles of their associated resort.
 * It can also filter the data to only include restaurants that meet this criteria.
 * 
 * Usage:
 *   node validate-restaurant-distances.js [--filter] [--report-only]
 * 
 * Options:
 *   --filter: Filter data.js to only include restaurants within 40 miles
 *   --report-only: Only generate a report without making changes
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Maximum allowed distance in miles
const MAX_DISTANCE_MILES = 40;

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Load and parse data.js
function loadData() {
    const dataPath = path.join(__dirname, 'data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    
    // Extract the skiEatsData object
    const skiEatsDataMatch = dataContent.match(/const skiEatsData = ({[\s\S]*});/);
    if (!skiEatsDataMatch) {
        throw new Error('Could not find skiEatsData in data.js');
    }
    
    // Use vm to safely evaluate the data
    const context = vm.createContext({});
    const code = `(${skiEatsDataMatch[1]})`;
    const skiEatsData = vm.runInContext(code, context);
    
    return skiEatsData;
}

// Validate restaurant distances
function validateRestaurants(skiEatsData) {
    const results = {
        valid: [],
        invalid: [],
        missingCoordinates: [],
        missingResort: [],
        missingResortData: []
    };
    
    // Create a map of resorts by ID for quick lookup
    const resortMap = new Map();
    skiEatsData.resorts.forEach(resort => {
        resortMap.set(resort.id, resort);
    });
    
    skiEatsData.restaurants.forEach(restaurant => {
        // Check if restaurant has a resort reference
        if (!restaurant.resort) {
            results.missingResort.push({
                restaurant: restaurant.name || restaurant.id,
                id: restaurant.id,
                reason: 'No resort reference'
            });
            return;
        }
        
        // Check if resort exists in data
        const resort = resortMap.get(restaurant.resort);
        if (!resort) {
            results.missingResortData.push({
                restaurant: restaurant.name || restaurant.id,
                id: restaurant.id,
                resortId: restaurant.resort,
                reason: `Resort '${restaurant.resort}' not found in data`
            });
            return;
        }
        
        // Check if restaurant has coordinates
        if (!restaurant.coordinates || !restaurant.coordinates.lat || !restaurant.coordinates.lng) {
            results.missingCoordinates.push({
                restaurant: restaurant.name || restaurant.id,
                id: restaurant.id,
                resort: resort.name,
                resortId: restaurant.resort,
                reason: 'Restaurant missing coordinates'
            });
            return;
        }
        
        // Check if resort has coordinates
        if (!resort.coordinates || !resort.coordinates.lat || !resort.coordinates.lng) {
            results.missingCoordinates.push({
                restaurant: restaurant.name || restaurant.id,
                id: restaurant.id,
                resort: resort.name,
                resortId: restaurant.resort,
                reason: 'Resort missing coordinates'
            });
            return;
        }
        
        // Calculate distance
        const distance = calculateDistance(
            restaurant.coordinates.lat,
            restaurant.coordinates.lng,
            resort.coordinates.lat,
            resort.coordinates.lng
        );
        
        if (distance <= MAX_DISTANCE_MILES) {
            results.valid.push({
                restaurant: restaurant.name || restaurant.id,
                id: restaurant.id,
                resort: resort.name,
                resortId: restaurant.resort,
                distance: distance.toFixed(2)
            });
        } else {
            results.invalid.push({
                restaurant: restaurant.name || restaurant.id,
                id: restaurant.id,
                resort: resort.name,
                resortId: restaurant.resort,
                distance: distance.toFixed(2)
            });
        }
    });
    
    return results;
}

// Generate report
function generateReport(results) {
    console.log('\n' + '='.repeat(80));
    console.log('RESTAURANT DISTANCE VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`Maximum allowed distance: ${MAX_DISTANCE_MILES} miles\n`);
    
    const total = results.valid.length + results.invalid.length + 
                  results.missingCoordinates.length + results.missingResort.length + 
                  results.missingResortData.length;
    
    console.log(`Total restaurants: ${total}`);
    console.log(`✅ Valid (within ${MAX_DISTANCE_MILES} miles): ${results.valid.length}`);
    console.log(`❌ Invalid (beyond ${MAX_DISTANCE_MILES} miles): ${results.invalid.length}`);
    console.log(`⚠️  Missing coordinates: ${results.missingCoordinates.length}`);
    console.log(`⚠️  Missing resort reference: ${results.missingResort.length}`);
    console.log(`⚠️  Missing resort data: ${results.missingResortData.length}`);
    console.log('\n' + '-'.repeat(80));
    
    if (results.valid.length > 0) {
        console.log(`\n✅ VALID RESTAURANTS (${results.valid.length}):`);
        console.log('-'.repeat(80));
        results.valid.slice(0, 10).forEach(item => {
            console.log(`  ✓ ${item.restaurant} → ${item.resort} (${item.distance} mi)`);
        });
        if (results.valid.length > 10) {
            console.log(`  ... and ${results.valid.length - 10} more valid restaurants`);
        }
    }
    
    if (results.invalid.length > 0) {
        console.log(`\n❌ INVALID RESTAURANTS (${results.invalid.length}) - Beyond ${MAX_DISTANCE_MILES} miles:`);
        console.log('-'.repeat(80));
        results.invalid.forEach(item => {
            console.log(`  ✗ ${item.restaurant} → ${item.resort} (${item.distance} mi)`);
        });
    }
    
    if (results.missingCoordinates.length > 0) {
        console.log(`\n⚠️  RESTAURANTS WITH MISSING COORDINATES (${results.missingCoordinates.length}):`);
        console.log('-'.repeat(80));
        results.missingCoordinates.forEach(item => {
            console.log(`  ⚠ ${item.restaurant} → ${item.resort || 'N/A'} (${item.reason})`);
        });
    }
    
    if (results.missingResort.length > 0) {
        console.log(`\n⚠️  RESTAURANTS WITH MISSING RESORT REFERENCE (${results.missingResort.length}):`);
        console.log('-'.repeat(80));
        results.missingResort.forEach(item => {
            console.log(`  ⚠ ${item.restaurant} (${item.reason})`);
        });
    }
    
    if (results.missingResortData.length > 0) {
        console.log(`\n⚠️  RESTAURANTS WITH MISSING RESORT DATA (${results.missingResortData.length}):`);
        console.log('-'.repeat(80));
        results.missingResortData.forEach(item => {
            console.log(`  ⚠ ${item.restaurant} → Resort ID: ${item.resortId} (${item.reason})`);
        });
    }
    
    console.log('\n' + '='.repeat(80));
    
    return {
        total,
        valid: results.valid.length,
        invalid: results.invalid.length,
        missingCoordinates: results.missingCoordinates.length,
        missingResort: results.missingResort.length,
        missingResortData: results.missingResortData.length
    };
}

// Filter data to only include valid restaurants
function filterData(skiEatsData, validIds) {
    const validIdsSet = new Set(validIds);
    const filteredRestaurants = skiEatsData.restaurants.filter(restaurant => {
        return validIdsSet.has(restaurant.id);
    });
    
    return {
        ...skiEatsData,
        restaurants: filteredRestaurants
    };
}

// Write filtered data back to data.js
function writeData(filteredData, outputPath) {
    const dataPath = outputPath || path.join(__dirname, 'data.js');
    const backupPath = path.join(__dirname, `data.js.backup.${Date.now()}`);
    
    // Create backup
    const originalData = fs.readFileSync(dataPath, 'utf8');
    fs.writeFileSync(backupPath, originalData);
    console.log(`\n📦 Backup created: ${backupPath}`);
    
    // Convert data back to JavaScript format with proper formatting
    // Use a custom replacer to handle undefined values and maintain formatting
    const dataString = JSON.stringify(filteredData, (key, value) => {
        // Remove undefined values
        if (value === undefined) return undefined;
        return value;
    }, 4);
    
    const jsContent = `// SNOGRUB - Ski Resort and Dining Data
const skiEatsData = ${dataString};
`;
    
    // Write to file
    fs.writeFileSync(dataPath, jsContent, 'utf8');
    console.log(`✅ Filtered data written to ${dataPath}`);
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    const shouldFilter = args.includes('--filter');
    const reportOnly = args.includes('--report-only');
    
    try {
        console.log('Loading data...');
        const skiEatsData = loadData();
        
        console.log('Validating restaurant distances...');
        const results = validateRestaurants(skiEatsData);
        
        const summary = generateReport(results);
        
        if (shouldFilter && !reportOnly) {
            console.log('\n🔧 FILTERING DATA...');
            const validIds = results.valid.map(r => r.id);
            const filteredData = filterData(skiEatsData, validIds);
            writeData(filteredData);
            
            console.log(`\n✅ Filtered ${summary.total} restaurants down to ${summary.valid} valid restaurants.`);
            console.log(`   Removed ${summary.invalid + summary.missingCoordinates + summary.missingResort + summary.missingResortData} restaurants.`);
        } else if (shouldFilter) {
            console.log('\n⚠️  --report-only flag set. Use --filter without --report-only to apply changes.');
        }
        
        // Exit with error code if there are invalid restaurants
        if (summary.invalid > 0 || summary.missingCoordinates > 0 || 
            summary.missingResort > 0 || summary.missingResortData > 0) {
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { calculateDistance, validateRestaurants, loadData };




#!/usr/bin/env node

/**
 * Batch Insert Restaurants
 * 
 * Inserts multiple restaurants from a JSON array file.
 * 
 * Usage:
 *   node batch-insert-restaurants.js <restaurants-array-file.json>
 * 
 * The file should contain a JSON array of restaurant objects:
 * [
 *   { "id": "restaurant1", "name": "...", ... },
 *   { "id": "restaurant2", "name": "...", ... }
 * ]
 */

const fs = require('fs');
const path = require('path');
const { insertRestaurantIntoData } = require('./insert-restaurant.js');

function batchInsert(restaurantsArray) {
    if (!Array.isArray(restaurantsArray)) {
        throw new Error('Input must be a JSON array of restaurants');
    }
    
    console.log(`\n📦 Batch inserting ${restaurantsArray.length} restaurant(s)...\n`);
    
    const results = {
        success: [],
        failed: []
    };
    
    restaurantsArray.forEach((restaurant, index) => {
        console.log(`[${index + 1}/${restaurantsArray.length}] Processing: ${restaurant.name || restaurant.id}...`);
        
        try {
            insertRestaurantIntoData(restaurant);
            results.success.push(restaurant.id || restaurant.name);
            console.log(`   ✅ Successfully inserted\n`);
        } catch (error) {
            results.failed.push({
                restaurant: restaurant.id || restaurant.name,
                error: error.message
            });
            console.log(`   ❌ Failed: ${error.message}\n`);
        }
    });
    
    // Summary
    console.log('='.repeat(80));
    console.log('BATCH INSERT SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully inserted: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    
    if (results.success.length > 0) {
        console.log('\n✅ Successfully inserted:');
        results.success.forEach(id => console.log(`   - ${id}`));
    }
    
    if (results.failed.length > 0) {
        console.log('\n❌ Failed:');
        results.failed.forEach(item => {
            console.log(`   - ${item.restaurant}: ${item.error}`);
        });
    }
    
    console.log('\n' + '='.repeat(80));
    
    return results;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('Usage: node batch-insert-restaurants.js <restaurants-array-file.json>');
        console.error('\nExample:');
        console.error('  node batch-insert-restaurants.js restaurants-batch.json');
        process.exit(1);
    }
    
    const filePath = args[0];
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
    
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const restaurantsArray = JSON.parse(fileContent);
        batchInsert(restaurantsArray);
    } catch (error) {
        console.error(`❌ Error reading/parsing file: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { batchInsert };




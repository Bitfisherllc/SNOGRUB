#!/usr/bin/env node

/**
 * List all available resorts
 * 
 * Usage: node list-resorts.js
 */

const { loadData } = require('./validate-restaurant-distances.js');

const data = loadData();

console.log('\n' + '='.repeat(80));
console.log('AVAILABLE RESORTS');
console.log('='.repeat(80));
console.log(`\nTotal Resorts: ${data.resorts.length}\n`);

data.resorts.forEach((resort, index) => {
    const restaurantCount = data.restaurants.filter(r => r.resort === resort.id).length;
    console.log(`${index + 1}. ${resort.name}`);
    console.log(`   ID: ${resort.id}`);
    console.log(`   Location: ${resort.location}`);
    console.log(`   Coordinates: ${resort.coordinates?.lat || 'N/A'}, ${resort.coordinates?.lng || 'N/A'}`);
    console.log(`   Restaurants: ${restaurantCount}`);
    console.log('');
});

console.log('='.repeat(80));
console.log('\nTo add a restaurant, use:');
console.log('  node generate-restaurant-data.js\n');







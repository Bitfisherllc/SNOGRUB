#!/usr/bin/env node

/**
 * Restaurant Data Generator
 * 
 * Helps generate restaurant data entries that match the existing format
 * and ensures all required fields are present for the restaurant-detail.html page.
 * 
 * Usage:
 *   node generate-restaurant-data.js
 * 
 * This will prompt you for restaurant information and generate a properly formatted
 * restaurant object that you can add to data.js
 */

const readline = require('readline');
const { validateNewRestaurant, loadData } = require('./add-restaurant-validator.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function generateRestaurantId(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function collectRestaurantData() {
    console.log('\n' + '='.repeat(80));
    console.log('RESTAURANT DATA GENERATOR');
    console.log('='.repeat(80));
    console.log('This tool will help you create a restaurant entry for data.js\n');
    
    // Basic Information
    const name = await question('Restaurant Name: ');
    if (!name) {
        console.error('❌ Restaurant name is required');
        process.exit(1);
    }
    
    const suggestedId = generateRestaurantId(name);
    const id = await question(`Restaurant ID (suggested: ${suggestedId}): `) || suggestedId;
    
    const location = await question('Location (City, State): ');
    const description = await question('Description: ');
    
    // Coordinates
    console.log('\n📍 Coordinates:');
    const lat = await question('  Latitude: ');
    const lng = await question('  Longitude: ');
    
    if (!lat || !lng) {
        console.error('❌ Coordinates are required');
        process.exit(1);
    }
    
    // Resort Association
    console.log('\n🏔️  Resort Association:');
    const skiEatsData = loadData();
    console.log('\nAvailable resorts:');
    skiEatsData.resorts.forEach((resort, index) => {
        console.log(`  ${index + 1}. ${resort.name} (${resort.id})`);
    });
    
    const resortId = await question('\nResort ID: ');
    if (!resortId) {
        console.error('❌ Resort ID is required');
        process.exit(1);
    }
    
    // Validate distance
    console.log('\n🔍 Validating distance...');
    const isValid = validateNewRestaurant(lat, lng, resortId);
    if (!isValid) {
        console.error('\n❌ Cannot proceed: Restaurant is not within 40 miles of the resort');
        process.exit(1);
    }
    
    // Category and Cuisine
    console.log('\n🍽️  Category and Cuisine:');
    const category = await question('Category (restaurant/bar/cafe) [restaurant]: ') || 'restaurant';
    const cuisine = await question('Cuisine Type: ');
    const priceRange = await question('Price Range ($/$$/$$$/$$$$) [$$]: ') || '$$';
    
    // Ratings
    console.log('\n⭐ Ratings:');
    const rating = await question('Rating (0-5) [0]: ') || '0';
    const reviewCount = await question('Review Count [0]: ') || '0';
    
    // Contact Information
    console.log('\n📞 Contact Information:');
    const address = await question('Full Address: ');
    const phone = await question('Phone Number: ');
    const website = await question('Website URL: ');
    
    // Images
    console.log('\n🖼️  Images (optional):');
    const logo = await question('Logo URL: ');
    const backgroundPhoto = await question('Background Photo URL: ');
    const image = await question('Image URL: ');
    
    // Hours (optional)
    console.log('\n🕐 Hours (optional, press Enter to skip):');
    const hours = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of days) {
        const hoursInput = await question(`  ${day.charAt(0).toUpperCase() + day.slice(1)}: `);
        if (hoursInput) {
            hours[day] = hoursInput;
        }
    }
    
    // Menu (optional)
    console.log('\n📋 Menu (optional):');
    const hasMenu = await question('Add menu information? (y/n) [n]: ');
    let menu = null;
    
    if (hasMenu.toLowerCase() === 'y') {
        const bestItemsDescription = await question('Best Items Description: ');
        menu = {
            bestItemsDescription: bestItemsDescription || '',
            highlights: [],
            fullMenu: {
                starters: [],
                entrees: [],
                sides: []
            }
        };
        
        console.log('\n  Add menu highlights (press Enter with empty name to finish):');
        while (true) {
            const itemName = await question('    Item name: ');
            if (!itemName) break;
            const itemPrice = await question('    Price: ');
            const itemDesc = await question('    Description: ');
            menu.highlights.push({
                name: itemName,
                price: itemPrice || '',
                description: itemDesc || ''
            });
        }
    }
    
    // Platform Reviews (optional)
    console.log('\n📱 Platform Reviews (optional):');
    const addReviews = await question('Add platform reviews? (y/n) [n]: ');
    const platformReviews = {};
    
    if (addReviews.toLowerCase() === 'y') {
        const platforms = ['Google Business Profile', 'Yelp', 'TripAdvisor', 'OpenTable', 'Foursquare'];
        for (const platform of platforms) {
            const addPlatform = await question(`  Add ${platform}? (y/n) [n]: `);
            if (addPlatform.toLowerCase() === 'y') {
                const platformRating = await question(`    Rating: `);
                const platformReviewCount = await question(`    Review Count: `);
                const positive = await question(`    Positive feedback: `);
                const negative = await question(`    Negative feedback: `);
                const url = await question(`    URL: `);
                
                platformReviews[platform] = {
                    rating: parseFloat(platformRating) || 0,
                    reviewCount: parseInt(platformReviewCount) || 0,
                    url: url || '',
                    positive: positive || '',
                    negative: negative || ''
                };
            }
        }
    }
    
    // Generate the restaurant object
    const restaurant = {
        id: id,
        name: name,
        location: location,
        coordinates: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        },
        description: description,
        category: category,
        cuisine: cuisine,
        priceRange: priceRange,
        rating: parseFloat(rating),
        reviewCount: parseInt(reviewCount),
        resort: resortId,
        address: address,
        phone: phone,
        website: website
    };
    
    if (logo) restaurant.logo = logo;
    if (backgroundPhoto) restaurant.backgroundPhoto = backgroundPhoto;
    if (image) restaurant.image = image;
    if (Object.keys(hours).length > 0) restaurant.hours = hours;
    if (menu) restaurant.menu = menu;
    if (Object.keys(platformReviews).length > 0) restaurant.platformReviews = platformReviews;
    
    return restaurant;
}

function formatRestaurantForDataJs(restaurant) {
    // Use JSON.stringify with proper formatting, then convert to JavaScript format
    const jsonString = JSON.stringify(restaurant, null, 4);
    
    // Convert JSON format to JavaScript format (handle single quotes in strings)
    // This is a simple approach - for production, consider using a proper JS formatter
    return jsonString;
}

async function main() {
    try {
        const restaurant = await collectRestaurantData();
        
        console.log('\n' + '='.repeat(80));
        console.log('GENERATED RESTAURANT DATA');
        console.log('='.repeat(80));
        console.log('\nAdd this to the restaurants array in data.js:\n');
        console.log(formatRestaurantForDataJs(restaurant));
        console.log('\n' + '='.repeat(80));
        console.log('\n✅ Restaurant data generated successfully!');
        console.log('📝 Copy the output above and add it to data.js in the restaurants array');
        console.log('🔍 Remember to add a comma after the previous restaurant entry\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = { collectRestaurantData, formatRestaurantForDataJs };







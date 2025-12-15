#!/usr/bin/env node

/**
 * Build Place Pages Script
 * 
 * Generates static HTML pages for each place (bars, restaurants, cafés) from data.js
 * Places are all stored in the restaurants array but have a category field:
 * - 'bar' → Après Bar
 * - 'cafe' → Café  
 * - 'restaurant' → Restaurant (default)
 * Category can be a string or an array of strings for places with multiple categories
 * 
 * This improves SEO and performance compared to dynamic JavaScript population
 */

const fs = require('fs');
const path = require('path');

// Helper function to normalize category - handles both string and array
function normalizeCategory(category, fallback = 'restaurant') {
    if (!category) return [fallback];
    if (Array.isArray(category)) {
        return category.map(c => String(c).toLowerCase());
    }
    return [String(category).toLowerCase()];
}

// Helper function to get the primary category (first in array, or single value)
function getPrimaryCategory(place, fallback = 'restaurant') {
    const categories = normalizeCategory(place.category, fallback);
    return categories[0];
}

// Read the data file
const dataPath = path.join(__dirname, 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract the data object (simple eval - in production, use a proper parser)
// Remove the const declaration and execute to get the data
const dataMatch = dataContent.match(/const skiEatsData = ({[\s\S]*});/);
if (!dataMatch) {
    console.error('Could not parse data.js');
    process.exit(1);
}

const skiEatsData = eval(`(${dataMatch[1]})`);

// Read template files
const resortTemplatePath = path.join(__dirname, 'resort-detail.html');
const restaurantTemplatePath = path.join(__dirname, 'restaurant-detail.html');

const resortTemplate = fs.readFileSync(resortTemplatePath, 'utf8');
const restaurantTemplate = fs.readFileSync(restaurantTemplatePath, 'utf8');

// Create output directories
const resortsDir = path.join(__dirname, 'resorts');
const placesDir = path.join(__dirname, 'places'); // All places (bars, restaurants, cafés) go here

if (!fs.existsSync(resortsDir)) {
    fs.mkdirSync(resortsDir, { recursive: true });
}
if (!fs.existsSync(placesDir)) {
    fs.mkdirSync(placesDir, { recursive: true });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Generate static HTML for a resort
 */
function generateResortPage(resort) {
    let html = resortTemplate;
    
    // Replace dynamic content
    html = html.replace(/id="pageTitle"[^>]*>.*?<\/title>/, `id="pageTitle">${escapeHtml(resort.name)} - SNOGRUB</title>`);
    html = html.replace(/id="metaDescription"[^>]*content="[^"]*"/, `id="metaDescription" name="description" content="${escapeHtml(resort.description || `Discover the best dining options at ${resort.name} in ${resort.location}.`)}"`);
    
    // Update meta tags
    html = html.replace(/id="ogTitle"[^>]*content="[^"]*"/, `id="ogTitle" property="og:title" content="${escapeHtml(resort.name)} - SNOGRUB"`);
    html = html.replace(/id="ogDescription"[^>]*content="[^"]*"/, `id="ogDescription" property="og:description" content="${escapeHtml(resort.description || `Discover the best dining options at ${resort.name}.`)}"`);
    if (resort.image) {
        html = html.replace(/id="ogImage"[^>]*content=""/, `id="ogImage" property="og:image" content="${escapeHtml(resort.image)}"`);
    }
    
    // Update Twitter tags
    html = html.replace(/id="twitterTitle"[^>]*content="[^"]*"/, `id="twitterTitle" name="twitter:title" content="${escapeHtml(resort.name)} - SNOGRUB"`);
    html = html.replace(/id="twitterDescription"[^>]*content="[^"]*"/, `id="twitterDescription" name="twitter:description" content="${escapeHtml(resort.description || `Discover the best dining options at ${resort.name}.`)}"`);
    if (resort.image) {
        html = html.replace(/id="twitterImage"[^>]*content=""/, `id="twitterImage" name="twitter:image" content="${escapeHtml(resort.image)}"`);
    }
    
    // Update breadcrumb
    html = html.replace(/id="breadcrumbResortName"[^>]*>.*?<\/span>/, `id="breadcrumbResortName" class="text-gray-900">${escapeHtml(resort.name)}</span>`);
    
    // Update hero image
    if (resort.image) {
        html = html.replace(/id="resortHeroImage"[^>]*src=""/, `id="resortHeroImage" src="${escapeHtml(resort.image)}" alt="${escapeHtml(resort.name)}"`);
    }
    
    // Update main content
    html = html.replace(/id="resortName"[^>]*>.*?<\/h1>/, `id="resortName" class="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">${escapeHtml(resort.name)}</h1>`);
    html = html.replace(/id="resortLocation"[^>]*>.*?<\/p>/, `id="resortLocation" class="text-xl text-gray-600 mb-6">${escapeHtml(resort.location)}</p>`);
    html = html.replace(/id="restaurantCount"[^>]*>.*?<\/span>/, `id="restaurantCount" class="text-gray-600">${resort.restaurantCount || 0}+ Dining Options</span>`);
    html = html.replace(/id="resortDescription"[^>]*>.*?<\/p>/, `id="resortDescription" class="text-gray-600 leading-relaxed text-lg">${escapeHtml(resort.description || 'No description available.')}</p>`);
    
    // Update structured data (JSON-LD)
    const locationParts = (resort.location || '').split(',').map(s => s.trim());
    const schema = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": resort.name,
        "image": resort.image || '',
        "description": resort.description || `Ski resort in ${resort.location}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": locationParts[0] || resort.location,
            "addressRegion": locationParts[1] || '',
            "addressCountry": resort.location && (resort.location.includes('QC') || resort.location.includes('BC') || resort.location.includes('Canada')) ? 'CA' : 'US'
        },
        "geo": resort.coordinates ? {
            "@type": "GeoCoordinates",
            "latitude": resort.coordinates.lat,
            "longitude": resort.coordinates.lng
        } : undefined,
        "url": `https://snogrub.com/resorts/${resort.id}.html`
    };
    
    if (!schema.geo) {
        delete schema.geo;
    }
    
    html = html.replace(/<script type="application\/ld\+json" id="resortSchema">[\s\S]*?<\/script>/, 
        `<script type="application/ld+json" id="resortSchema">\n    ${JSON.stringify(schema, null, 2)}\n    </script>`);
    
    // Replace the JavaScript that loads data with pre-populated data
    // We'll keep the JavaScript but pre-populate the resort variable
    const scriptStart = html.indexOf('<script>');
    const scriptEnd = html.lastIndexOf('</script>');
    if (scriptStart !== -1 && scriptEnd !== -1) {
        const beforeScript = html.substring(0, scriptStart);
        const afterScript = html.substring(scriptEnd + 9);
        const scriptContent = html.substring(scriptStart + 8, scriptEnd);
        
        // Pre-populate resort data
        const prePopulatedScript = `
        // Pre-populated resort data
        const prePopulatedResort = ${JSON.stringify(resort, null, 8)};
        const prePopulatedRestaurants = ${JSON.stringify((skiEatsData.restaurants || []).filter(r => r.resort === resort.id), null, 8)};
        
        ${scriptContent}
        
        // Override loadResortData to use pre-populated data
        const originalLoadResortData = loadResortData;
        loadResortData = function() {
            resort = prePopulatedResort;
            // Find restaurants for this resort
            const restaurants = prePopulatedRestaurants;
            // Continue with original logic but use pre-populated data
            if (typeof skiEatsData === 'undefined') {
                window.skiEatsData = { resorts: [prePopulatedResort], restaurants: prePopulatedRestaurants };
            }
            originalLoadResortData();
        };
        `;
        
        html = beforeScript + '<script>' + prePopulatedScript + '</script>' + afterScript;
    }
    
    return html;
}

/**
 * Generate static HTML for a place (bar, restaurant, or café)
 */
function generatePlacePage(place) {
    let html = restaurantTemplate;
    
    // Determine category label (use primary category)
    const primaryCategory = getPrimaryCategory(place, 'restaurant');
    const categoryLabel = primaryCategory === 'bar' ? 'Après Bar' : 
                         primaryCategory === 'cafe' ? 'Café' : 
                         'Restaurant';
    
    // Similar replacements as resort but for place data
    html = html.replace(/id="pageTitle"[^>]*>.*?<\/title>/, `id="pageTitle">${escapeHtml(place.name)} - ${categoryLabel} - SNOGRUB</title>`);
    html = html.replace(/id="metaDescription"[^>]*content="[^"]*"/, `id="metaDescription" name="description" content="${escapeHtml(place.description || `Discover ${place.name}, a ${categoryLabel.toLowerCase()} at ${place.location || 'this ski resort'}.`)}"`);
    
    // Update meta tags
    html = html.replace(/id="ogTitle"[^>]*content="[^"]*"/, `id="ogTitle" property="og:title" content="${escapeHtml(place.name)} - ${categoryLabel} - SNOGRUB"`);
    html = html.replace(/id="ogDescription"[^>]*content="[^"]*"/, `id="ogDescription" property="og:description" content="${escapeHtml(place.description || `Discover ${place.name}, a ${categoryLabel.toLowerCase()}.`)}"`);
    if (place.image) {
        html = html.replace(/id="ogImage"[^>]*content=""/, `id="ogImage" property="og:image" content="${escapeHtml(place.image)}"`);
    }
    
    // Update Twitter tags
    html = html.replace(/id="twitterTitle"[^>]*content="[^"]*"/, `id="twitterTitle" name="twitter:title" content="${escapeHtml(place.name)} - ${categoryLabel} - SNOGRUB"`);
    html = html.replace(/id="twitterDescription"[^>]*content="[^"]*"/, `id="twitterDescription" name="twitter:description" content="${escapeHtml(place.description || `Discover ${place.name}, a ${categoryLabel.toLowerCase()}.`)}"`);
    if (place.image) {
        html = html.replace(/id="twitterImage"[^>]*content=""/, `id="twitterImage" name="twitter:image" content="${escapeHtml(place.image)}"`);
    }
    
    // Update structured data (JSON-LD) - use appropriate schema type (use primary category)
    const schemaType = primaryCategory === 'bar' ? 'BarOrPub' : 
                      primaryCategory === 'cafe' ? 'CafeOrCoffeeShop' : 
                      'Restaurant';
    
    const locationParts = (place.location || '').split(',').map(s => s.trim());
    const schema = {
        "@context": "https://schema.org",
        "@type": schemaType,
        "name": place.name,
        "image": place.image || '',
        "description": place.description || `${categoryLabel} in ${place.location || 'ski resort'}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": locationParts[0] || place.location,
            "addressRegion": locationParts[1] || '',
            "addressCountry": place.location && (place.location.includes('QC') || place.location.includes('BC') || place.location.includes('Canada')) ? 'CA' : 'US'
        },
        "geo": place.coordinates ? {
            "@type": "GeoCoordinates",
            "latitude": place.coordinates.lat,
            "longitude": place.coordinates.lng
        } : undefined,
        "url": `https://snogrub.com/places/${place.id}.html`,
        "servesCuisine": place.cuisine || '',
        "priceRange": place.priceRange || '',
        "aggregateRating": place.rating ? {
            "@type": "AggregateRating",
            "ratingValue": place.rating.toString(),
            "reviewCount": (place.reviewCount || 0).toString()
        } : undefined
    };
    
    if (!schema.geo) delete schema.geo;
    if (!schema.aggregateRating) delete schema.aggregateRating;
    if (!schema.servesCuisine) delete schema.servesCuisine;
    if (!schema.priceRange) delete schema.priceRange;
    
    html = html.replace(/<script type="application\/ld\+json" id="restaurantSchema">[\s\S]*?<\/script>/, 
        `<script type="application/ld+json" id="restaurantSchema">\n    ${JSON.stringify(schema, null, 2)}\n    </script>`);
    
    // Pre-populate place data in script
    const scriptStart = html.indexOf('<script>');
    const scriptEnd = html.lastIndexOf('</script>');
    if (scriptStart !== -1 && scriptEnd !== -1) {
        const beforeScript = html.substring(0, scriptStart);
        const afterScript = html.substring(scriptEnd + 9);
        const scriptContent = html.substring(scriptStart + 8, scriptEnd);
        
        const prePopulatedScript = `
        // Pre-populated place data (${categoryLabel})
        const prePopulatedPlace = ${JSON.stringify(place, null, 8)};
        
        ${scriptContent}
        
        // Override load function to use pre-populated data
        if (typeof skiEatsData === 'undefined') {
            window.skiEatsData = { restaurants: [prePopulatedPlace], resorts: [] };
        }
        `;
        
        html = beforeScript + '<script>' + prePopulatedScript + '</script>' + afterScript;
    }
    
    return html;
}

// Generate pages for all resorts
console.log('Generating resort pages...');
let resortCount = 0;
for (const resort of skiEatsData.resorts || []) {
    const html = generateResortPage(resort);
    const outputPath = path.join(resortsDir, `${resort.id}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    resortCount++;
    console.log(`  ✓ Generated: ${resort.id}.html`);
}

// Generate pages for all places (bars, restaurants, cafés)
console.log('Generating place pages (bars, restaurants, cafés)...');
let placeCount = 0;
const placeCategories = { bar: 0, restaurant: 0, cafe: 0 };

for (const place of skiEatsData.restaurants || []) {
    const html = generatePlacePage(place);
    const outputPath = path.join(placesDir, `${place.id}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    placeCount++;
    
    // Track by category
    const category = place.category || 'restaurant';
    placeCategories[category] = (placeCategories[category] || 0) + 1;
    
    const categoryLabel = category === 'bar' ? 'Après Bar' : 
                         category === 'cafe' ? 'Café' : 
                         'Restaurant';
    console.log(`  ✓ Generated: ${place.id}.html (${categoryLabel})`);
}

console.log(`\n✅ Generated ${resortCount} resort pages and ${placeCount} place pages`);
console.log(`   Places breakdown: ${placeCategories.restaurant || 0} restaurants, ${placeCategories.bar || 0} bars, ${placeCategories.cafe || 0} cafés`);
console.log(`   Output: ${resortsDir}/ and ${placesDir}/`);


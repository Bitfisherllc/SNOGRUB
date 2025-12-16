#!/usr/bin/env node

/**
 * Scrapes logos and photos from restaurant websites
 * Usage: node scrape-logos-and-photos.js
 * 
 * Requires: npm install cheerio node-fetch
 */

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Load the data file
const DATA_FILE = path.join(__dirname, 'data.js');

/**
 * Fetch HTML content from a URL
 */
async function fetchHTML(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.text();
    } catch (error) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
}

/**
 * Extract logo URL from HTML using cheerio
 * Looks for:
 * - Open Graph image (og:image)
 * - Twitter card image (twitter:image)
 * - Logo in meta tags
 * - Common logo image patterns
 */
function extractLogo(html, baseUrl) {
    const $ = cheerio.load(html);
    const urlObj = new URL(baseUrl);
    const base = `${urlObj.protocol}//${urlObj.hostname}`;
    
    // Try Open Graph image first
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
        const resolved = resolveUrl(ogImage, base);
        // Check if it looks like a logo (smaller image, not a hero photo)
        if (!resolved.includes('hero') && !resolved.includes('banner') && !resolved.includes('background')) {
            return resolved;
        }
    }
    
    // Try Twitter card image
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage) {
        const resolved = resolveUrl(twitterImage, base);
        if (!resolved.includes('hero') && !resolved.includes('banner')) {
            return resolved;
        }
    }
    
    // Try logo in link tags
    const logoLink = $('link[rel*="icon"], link[rel*="logo"], link[rel*="apple-touch-icon"]').first().attr('href');
    if (logoLink) {
        return resolveUrl(logoLink, base);
    }
    
    // Try to find logo in img tags with logo-related classes/ids
    const logoImg = $('img[class*="logo"], img[id*="logo"], img[alt*="logo" i]').first().attr('src');
    if (logoImg && !logoImg.includes('placeholder') && !logoImg.includes('data:')) {
        return resolveUrl(logoImg, base);
    }
    
    // Try to find any image with "logo" in src
    $('img').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && src.toLowerCase().includes('logo') && 
            !src.includes('placeholder') && 
            !src.includes('data:')) {
            return resolveUrl(src, base);
        }
    });
    
    return null;
}

/**
 * Extract background photo URL from HTML using cheerio
 * Looks for:
 * - Hero images
 * - Background images in CSS
 * - Large featured images
 * - Gallery images
 */
function extractBackgroundPhoto(html, baseUrl) {
    const $ = cheerio.load(html);
    const urlObj = new URL(baseUrl);
    const base = `${urlObj.protocol}//${urlObj.hostname}`;
    
    const foundImages = [];
    
    // Try hero/banner/header images first
    const heroImages = $('img[class*="hero"], img[class*="banner"], img[class*="header"], img[class*="background"], img[class*="featured"], img[class*="splash"]');
    heroImages.each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && !src.includes('logo') && !src.includes('icon') && 
            !src.includes('placeholder') && !src.includes('data:') &&
            !src.match(/\.svg$/i)) {
            foundImages.push(resolveUrl(src, base));
        }
    });
    
    // Try background images in style attributes
    $('[style*="background-image"]').each((i, elem) => {
        const style = $(elem).attr('style');
        const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
        if (match) {
            const imgUrl = match[1];
            if (!imgUrl.includes('logo') && !imgUrl.includes('icon') && 
                !imgUrl.includes('placeholder') && !imgUrl.includes('data:')) {
                foundImages.push(resolveUrl(imgUrl, base));
            }
        }
    });
    
    // Try gallery/slideshow images
    const galleryImages = $('img[class*="gallery"], img[class*="slide"], img[class*="carousel"], .gallery img, .slideshow img, .carousel img');
    galleryImages.each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && !src.includes('logo') && !src.includes('icon') && 
            !src.includes('placeholder') && !src.includes('data:') &&
            !src.match(/\.svg$/i)) {
            foundImages.push(resolveUrl(src, base));
        }
    });
    
    // Try images with food/restaurant/dining related keywords in src or alt
    $('img').each((i, elem) => {
        const src = $(elem).attr('src') || '';
        const alt = $(elem).attr('alt') || '';
        const keywords = ['food', 'restaurant', 'dining', 'interior', 'exterior', 'dish', 'meal', 'cuisine'];
        
        const hasKeyword = keywords.some(keyword => 
            src.toLowerCase().includes(keyword) || alt.toLowerCase().includes(keyword)
        );
        
        if (hasKeyword && src && !src.includes('logo') && !src.includes('icon') && 
            !src.includes('placeholder') && !src.includes('data:') &&
            !src.match(/\.svg$/i) && src.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
            foundImages.push(resolveUrl(src, base));
        }
    });
    
    // Return the first image found (prioritize hero images)
    return foundImages.length > 0 ? foundImages[0] : null;
}

/**
 * Resolve relative URLs to absolute URLs
 */
function resolveUrl(url, base) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    if (url.startsWith('//')) {
        return 'https:' + url;
    }
    if (url.startsWith('/')) {
        return base + url;
    }
    return base + '/' + url;
}

/**
 * Load restaurant data from data.js
 * Extracts restaurants with their IDs, names, and website URLs
 */
async function loadRestaurantData() {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const restaurants = [];
    const lines = content.split('\n');
    
    let currentRestaurant = null;
    let braceDepth = 0;
    let inRestaurantsArray = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if we're entering the restaurants array
        if (line.includes('restaurants:') && line.includes('[')) {
            inRestaurantsArray = true;
            continue;
        }
        
        if (!inRestaurantsArray) continue;
        
        // Count braces to track object depth
        braceDepth += (line.match(/\{/g) || []).length;
        braceDepth -= (line.match(/\}/g) || []).length;
        
        // Extract restaurant ID
        if (line.match(/^\s*id:\s*['"]([^'"]+)['"]/)) {
            const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
            if (idMatch) {
                if (currentRestaurant) {
                    restaurants.push(currentRestaurant);
                }
                currentRestaurant = { id: idMatch[1] };
            }
        }
        
        // Extract restaurant name
        if (currentRestaurant && line.match(/^\s*name:\s*['"]([^'"]+)['"]/)) {
            const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
            if (nameMatch) {
                currentRestaurant.name = nameMatch[1];
            }
        }
        
        // Extract website URL
        if (currentRestaurant && line.match(/^\s*website:\s*['"]([^'"]*)['"]/)) {
            const websiteMatch = line.match(/website:\s*['"]([^'"]*)['"]/);
            if (websiteMatch) {
                currentRestaurant.website = websiteMatch[1];
            }
        }
        
        // Check if we're leaving the restaurants array
        if (inRestaurantsArray && line.includes(']') && braceDepth === 0) {
            if (currentRestaurant) {
                restaurants.push(currentRestaurant);
            }
            break;
        }
    }
    
    return restaurants;
}

/**
 * Scrape logo and photo for a single restaurant
 */
async function scrapeRestaurant(restaurant) {
    if (!restaurant.website || !restaurant.website.startsWith('http')) {
        console.log(`Skipping ${restaurant.name} - no valid website`);
        return {
            logo: null,
            backgroundPhoto: null
        };
    }
    
    try {
        console.log(`Scraping ${restaurant.name} from ${restaurant.website}...`);
        const html = await fetchHTML(restaurant.website);
        const logo = extractLogo(html, restaurant.website);
        const backgroundPhoto = extractBackgroundPhoto(html, restaurant.website);
        
        console.log(`  Logo: ${logo || 'Not found'}`);
        console.log(`  Background Photo: ${backgroundPhoto || 'Not found'}`);
        
        return {
            logo: logo,
            backgroundPhoto: backgroundPhoto
        };
    } catch (error) {
        console.error(`  Error scraping ${restaurant.name}:`, error.message);
        return {
            logo: null,
            backgroundPhoto: null
        };
    }
}

/**
 * Update data.js with scraped logos and photos
 */
async function updateDataFile(results) {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const lines = content.split('\n');
    let updatedContent = content;
    
    // For each restaurant result, add logo and backgroundPhoto fields
    for (const [restaurantId, assets] of Object.entries(results)) {
        if (!assets.logo && !assets.backgroundPhoto) continue;
        
        // Find the restaurant in the file and add logo/backgroundPhoto after website
        const restaurantPattern = new RegExp(`(id:\\s*['"]${restaurantId}['"][\\s\\S]*?website:\\s*['"][^'"]*['"])`, 'm');
        const match = updatedContent.match(restaurantPattern);
        
        if (match) {
            let additions = [];
            if (assets.logo) {
                additions.push(`            logo: '${assets.logo}',`);
            }
            if (assets.backgroundPhoto) {
                additions.push(`            backgroundPhoto: '${assets.backgroundPhoto}',`);
            }
            
            if (additions.length > 0) {
                const insertAfter = match[1];
                const replacement = insertAfter + ',\n' + additions.join('\n');
                updatedContent = updatedContent.replace(match[0], replacement);
            }
        }
    }
    
    // Write updated content back
    await fs.writeFile(DATA_FILE, updatedContent, 'utf-8');
    console.log('Updated data.js with scraped logos and photos');
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('Loading restaurant data...');
        const restaurants = await loadRestaurantData();
        
        const restaurantsWithWebsites = restaurants.filter(r => 
            r.website && r.website.startsWith('http')
        );
        
        console.log(`Found ${restaurantsWithWebsites.length} restaurants with websites`);
        console.log(`Total restaurants: ${restaurants.length}\n`);
        
        // Scrape each restaurant
        const results = {};
        for (let i = 0; i < restaurantsWithWebsites.length; i++) {
            const restaurant = restaurantsWithWebsites[i];
            console.log(`[${i + 1}/${restaurantsWithWebsites.length}] Processing ${restaurant.name}...`);
            
            const scraped = await scrapeRestaurant(restaurant);
            results[restaurant.id] = scraped;
            
            // Add delay to avoid overwhelming servers (except for last item)
            if (i < restaurantsWithWebsites.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // Save results to a JSON file
        const outputFile = path.join(__dirname, 'scraped-logos-photos.json');
        await fs.writeFile(outputFile, JSON.stringify(results, null, 2));
        console.log(`\nResults saved to ${outputFile}`);
        
        // Also output as JavaScript that can be merged into data.js
        const jsOutput = `// Scraped logos and photos\n// Generated: ${new Date().toISOString()}\nconst scrapedAssets = ${JSON.stringify(results, null, 2)};\n`;
        const jsOutputFile = path.join(__dirname, 'scraped-assets.js');
        await fs.writeFile(jsOutputFile, jsOutput);
        console.log(`JavaScript output saved to ${jsOutputFile}`);
        
        // Ask user if they want to update data.js
        console.log('\nTo update data.js with these results, you can manually add the logo and backgroundPhoto fields to each restaurant object.');
        console.log('Or run: node update-data-with-assets.js (if you create that script)');
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { scrapeRestaurant, extractLogo, extractBackgroundPhoto };







# Logo and Photo Scraping Instructions

This document explains how to scrape logos and background photos from restaurant websites and add them to your cards.

## What Was Implemented

1. **Scraping Script** (`scrape-logos-and-photos.js`)
   - Fetches HTML from restaurant websites
   - Extracts logos (from meta tags, img tags, etc.)
   - Extracts background photos (hero images, gallery images, etc.)
   - Saves results to JSON and JS files

2. **Updated Card Rendering**
   - Updated `index.html` to display logos with background photos
   - Updated `restaurants.html` with the same logo/photo display logic
   - Cards now show:
     - Background photo (darker, as background)
     - Logo centered on top of background photo
     - Fallback to map view or category icon if no logo/photo available

## How to Use

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `cheerio` - for HTML parsing
- `node-fetch` - for HTTP requests

### Step 2: Run the Scraping Script

```bash
node scrape-logos-and-photos.js
```

The script will:
- Read restaurant data from `data.js`
- Scrape each restaurant website for logos and photos
- Save results to:
  - `scraped-logos-photos.json` (JSON format)
  - `scraped-assets.js` (JavaScript format)

### Step 3: Add Scraped Data to data.js

You need to manually add the `logo` and `backgroundPhoto` fields to each restaurant object in `data.js`.

For example, if the scraped data shows:
```json
{
  "aces-run-restaurant-pub": {
    "logo": "https://www.acesrun.com/logo.png",
    "backgroundPhoto": "https://www.acesrun.com/hero-image.jpg"
  }
}
```

Add to the restaurant object in `data.js`:
```javascript
{
    id: 'aces-run-restaurant-pub',
    name: 'Ace\'s Run Restaurant & Pub',
    // ... other fields ...
    website: 'https://www.acesrun.com',
    logo: 'https://www.acesrun.com/logo.png',
    backgroundPhoto: 'https://www.acesrun.com/hero-image.jpg',
    // ... rest of fields ...
}
```

### Alternative: Automated Update Script

You can create a script to automatically merge the scraped data into `data.js`. The scraping script outputs the data in a format that can be easily integrated.

## Card Display Logic

The cards now display in this priority order:

1. **Best Case**: Background photo + Logo
   - Background photo is darkened (brightness: 0.7)
   - Logo is centered on top with drop shadow
   
2. **Fallback 1**: Custom image + Logo (if available)
   - Uses existing restaurant.image field
   
3. **Fallback 2**: Map view + Logo (if available)
   - Uses OpenStreetMap tiles
   
4. **Fallback 3**: Category icon
   - Shows default icon for restaurant/bar/cafe

## Notes

- The scraping script includes a 2-second delay between requests to avoid overwhelming servers
- Some websites may block automated scraping - you may need to adjust headers or use a proxy
- Logos are resized to max 60% width/height to fit nicely on cards
- Background photos are filtered with `brightness(0.7)` to make logos more visible

## Troubleshooting

**No logos/photos found:**
- Check if the website URL is correct in `data.js`
- Some websites require JavaScript to load images - the script only parses static HTML
- Try manually inspecting the website to find image URLs

**CORS errors:**
- This is normal - images are loaded by the browser, not the scraping script
- Make sure image URLs are absolute (start with http:// or https://)

**Rate limiting:**
- Increase the delay in `scrape-logos-and-photos.js` (currently 2000ms)
- Run the script during off-peak hours
- Consider using a proxy service for large-scale scraping







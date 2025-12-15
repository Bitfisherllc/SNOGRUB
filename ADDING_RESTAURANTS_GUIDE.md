# Guide: Adding New Restaurants

This guide explains how to add new restaurants to your site. All restaurant detail pages use the same template (`restaurant-detail.html`), so you just need to add restaurant data to `data.js`.

## Quick Start

1. **Validate the restaurant location** (must be within 40 miles of a resort)
2. **Generate the restaurant data** using the interactive tool
3. **Add it to `data.js`** in the restaurants array
4. **Verify it works** by visiting `restaurant-detail.html?id=<restaurant-id>`

## Tools Available

### 1. `add-restaurant-validator.js`
**Quick validation before adding a restaurant**

```bash
node add-restaurant-validator.js <lat> <lng> <resort-id>
```

**Example:**
```bash
node add-restaurant-validator.js 39.5080 -79.3800 wisp-resort
```

This checks if a restaurant location is within 40 miles of the specified resort.

### 2. `generate-restaurant-data.js`
**Interactive tool to create restaurant data**

```bash
node generate-restaurant-data.js
```

This will:
- Prompt you for all restaurant information
- Validate the distance automatically
- Generate properly formatted JSON code
- Output code ready to save or insert

**What it asks for:**
- Basic info (name, location, description)
- Coordinates (lat/lng)
- Resort association
- Category, cuisine, price range
- Ratings and reviews
- Contact information
- Images (logo, background photo)
- Hours (optional)
- Menu items (optional)
- Platform reviews (optional)

**Tip:** Save output to a file: `node generate-restaurant-data.js > restaurant.json`

### 3. `insert-restaurant.js`
**Automatically insert restaurant into data.js**

```bash
node insert-restaurant.js <restaurant-json-file>
```

This will:
- Validate the restaurant data
- Check distance automatically
- Create a backup of data.js
- Insert the restaurant in the correct location
- Maintain proper formatting

**Example:**
```bash
node insert-restaurant.js new-restaurant.json
```

### 4. `validate-restaurant-distances.js`
**Validate all existing restaurants**

```bash
# Just check (no changes)
node validate-restaurant-distances.js --report-only

# Filter data.js to remove restaurants beyond 40 miles
node validate-restaurant-distances.js --filter
```

### 5. `restaurant-template.json`
**Template file for manual restaurant creation**

Copy this file and fill in the details, then use `insert-restaurant.js` to add it.

## Step-by-Step Process

### Step 1: Find Restaurant Information

1. **Get coordinates:**
   - Open Google Maps
   - Search for the restaurant
   - Right-click on the location
   - Click the coordinates to copy them

2. **Identify the resort:**
   - Check `data.js` for available resorts
   - Note the resort ID (e.g., `wisp-resort`, `vail`, `whistler-blackcomb`)

3. **Gather restaurant details:**
   - Name, address, phone, website
   - Description
   - Category (restaurant/bar/cafe)
   - Cuisine type
   - Price range
   - Hours of operation
   - Menu items (if available)
   - Reviews from platforms (Google, Yelp, etc.)

### Step 2: Validate Distance

```bash
node add-restaurant-validator.js <lat> <lng> <resort-id>
```

If it's valid (within 40 miles), proceed. If not, find a different restaurant or a closer resort.

### Step 3: Generate Restaurant Data

```bash
node generate-restaurant-data.js
```

Follow the prompts. The tool will:
- Ask for all required information
- Validate the distance automatically
- Generate formatted code

#### Step 4: Add to data.js

**Option A: Automatic Insertion (Recommended)**
```bash
# Save the generated output to a file
node generate-restaurant-data.js > new-restaurant.json

# Automatically insert it into data.js
node insert-restaurant.js new-restaurant.json
```

**Option B: Manual Insertion**
1. Open `data.js`
2. Find the `restaurants` array
3. Add a comma after the last restaurant entry
4. Paste the generated code
5. Make sure the syntax is correct (trailing comma, etc.)

**Example:**
```javascript
restaurants: [
    {
        // ... existing restaurant ...
    },
    {
        // ... your new restaurant (paste here) ...
    }
]
```

### Step 5: Test the Page

1. Open `restaurant-detail.html?id=<your-restaurant-id>` in a browser
2. Verify all information displays correctly
3. Check that images load
4. Test the map shows the correct location

## Required Fields

These fields are **required** for the restaurant detail page to work properly:

- `id` - Unique identifier (lowercase, hyphens)
- `name` - Restaurant name
- `location` - City, State format
- `coordinates` - `{ lat: number, lng: number }`
- `description` - Restaurant description
- `category` - `'restaurant'`, `'bar'`, or `'cafe'`
- `cuisine` - Cuisine type(s)
- `priceRange` - `'$'`, `'$$'`, `'$$$'`, or `'$$$$'`
- `rating` - Number (0-5)
- `reviewCount` - Number
- `resort` - Resort ID (must match a resort in data.js)
- `address` - Full address
- `phone` - Phone number
- `website` - Website URL

## Optional Fields

These enhance the page but aren't required:

- `logo` - Logo image URL
- `backgroundPhoto` - Background photo URL
- `image` - Main image URL
- `hours` - Object with day-of-week hours
- `menu` - Menu object with items
- `platformReviews` - Reviews from various platforms

## Restaurant Detail Page Features

The `restaurant-detail.html` page automatically displays:

- ✅ Hero section with map showing restaurant and resort
- ✅ Restaurant name, location, and description
- ✅ Rating and review count
- ✅ Contact information (address, phone, website)
- ✅ Hours of operation
- ✅ Menu items (if provided)
- ✅ Platform reviews (Google, Yelp, TripAdvisor, etc.)
- ✅ User reviews (stored in localStorage)
- ✅ Distance to resort
- ✅ Breadcrumb navigation
- ✅ SEO metadata
- ✅ Structured data (JSON-LD)

## Example Restaurant Entry

```javascript
{
    id: 'example-restaurant',
    name: 'Example Restaurant',
    location: 'City, State',
    coordinates: { lat: 39.5080, lng: -79.3800 },
    description: 'A great restaurant description...',
    category: 'restaurant',
    cuisine: 'American',
    priceRange: '$$',
    rating: 4.3,
    reviewCount: 245,
    resort: 'wisp-resort',
    address: '123 Main St, City, State 12345',
    phone: '(301) 123-4567',
    website: 'https://example.com',
    logo: 'https://example.com/logo.png',
    backgroundPhoto: 'https://example.com/photo.jpg',
    hours: {
        monday: '11:00 AM - 10:00 PM',
        tuesday: '11:00 AM - 10:00 PM',
        // ... etc
    },
    menu: {
        bestItemsDescription: 'Description of best items...',
        highlights: [
            { name: 'Item Name', price: '$18', description: 'Item description' }
        ],
        fullMenu: {
            starters: [],
            entrees: [],
            sides: []
        }
    },
    platformReviews: {
        'Google Business Profile': {
            rating: 4.4,
            reviewCount: 312,
            url: 'https://www.google.com/maps',
            positive: 'Positive feedback...',
            negative: 'Negative feedback...'
        }
    }
}
```

## Troubleshooting

**Restaurant page shows "Restaurant not found":**
- Check that the `id` in the URL matches the `id` in `data.js`
- Verify the restaurant is in the `restaurants` array
- Check browser console for JavaScript errors

**Map doesn't show:**
- Verify `coordinates.lat` and `coordinates.lng` are valid numbers
- Check that the resort also has valid coordinates

**Images don't load:**
- Verify image URLs are accessible
- Check for CORS issues with external images
- Ensure URLs start with `http://` or `https://`

**Distance validation fails:**
- Restaurant must be within 40 miles of the resort
- Verify both restaurant and resort have correct coordinates
- Use `add-restaurant-validator.js` to check distance

## Tips

1. **Use the generator tool** - It ensures proper formatting and validates distance
2. **Test immediately** - After adding, test the page right away
3. **Keep IDs unique** - Use lowercase, hyphens, no spaces
4. **Validate coordinates** - Double-check lat/lng are correct
5. **Add images** - Restaurants with logos and photos look much better
6. **Include menu items** - Makes the page more useful for visitors
7. **Add platform reviews** - Provides social proof and detailed feedback

## Next Steps

Once you've added restaurants:
1. Run `validate-restaurant-distances.js --report-only` to verify all restaurants
2. Test each restaurant page
3. Update the resort's `restaurantCount` in `data.js` if needed
4. Consider adding restaurants to the homepage featured section




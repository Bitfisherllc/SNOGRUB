# Restaurant Management System

Complete toolkit for adding and managing restaurants on SNOGRUB.

## 🎯 Overview

All restaurant detail pages use the same dynamic template (`restaurant-detail.html`). You just need to add restaurant data to `data.js`, and the pages will automatically work.

**Key Requirement:** All restaurants must be within 40 miles of their associated resort.

## ⚡ Quick Start

```bash
# 1. Generate restaurant data (interactive)
node generate-restaurant-data.js > my-restaurant.json

# 2. Insert into data.js automatically
node insert-restaurant.js my-restaurant.json

# 3. Verify everything works
node validate-restaurant-distances.js --report-only
```

## 📚 Documentation

- **[QUICK_START_RESTAURANTS.md](QUICK_START_RESTAURANTS.md)** - Fast reference guide
- **[ADDING_RESTAURANTS_GUIDE.md](ADDING_RESTAURANTS_GUIDE.md)** - Complete step-by-step guide
- **[RESTAURANT_VALIDATION_GUIDE.md](RESTAURANT_VALIDATION_GUIDE.md)** - Validation tools guide
- **[RESTAURANT_TOOLS_SUMMARY.md](RESTAURANT_TOOLS_SUMMARY.md)** - Tools reference

## 🛠️ Tools

### Core Tools

1. **`generate-restaurant-data.js`** - Interactive data generator
   - Prompts for all restaurant information
   - Validates distance automatically
   - Outputs JSON ready to insert

2. **`insert-restaurant.js`** - Automatic insertion
   - Validates restaurant data
   - Creates backup of data.js
   - Inserts restaurant in correct location
   - Maintains proper formatting

3. **`add-restaurant-validator.js`** - Quick distance check
   - Validates single restaurant location
   - Shows exact distance to resort

4. **`validate-restaurant-distances.js`** - Full validation
   - Checks all restaurants
   - Generates comprehensive report
   - Can filter invalid restaurants

### Templates

- **`restaurant-template.json`** - Manual template for creating restaurant data

## 📊 Current Status

- **Total Restaurants:** 9
- **Valid Restaurants:** 9 (100%)
- **Resorts with Restaurants:** 1 (Wisp Resort)
- **Average Distance:** 3.16 miles
- **Farthest Restaurant:** 4.03 miles
- **Closest Restaurant:** 2.81 miles

## ✅ Validation Rules

1. **Distance:** Must be within 40 miles of associated resort
2. **Coordinates:** Both restaurant and resort must have valid coordinates
3. **Resort ID:** Must match an existing resort in data.js
4. **Required Fields:** id, name, location, coordinates, description, category, cuisine, priceRange, rating, reviewCount, resort, address, phone, website

## 🔄 Workflow Examples

### Adding a Single Restaurant

```bash
# Generate data
node generate-restaurant-data.js > restaurant.json

# Insert it
node insert-restaurant.js restaurant.json

# Test it
open restaurant-detail.html?id=<restaurant-id>
```

### Adding Multiple Restaurants

```bash
# Generate each one
node generate-restaurant-data.js > r1.json
node generate-restaurant-data.js > r2.json
node generate-restaurant-data.js > r3.json

# Insert all
node insert-restaurant.js r1.json
node insert-restaurant.js r2.json
node insert-restaurant.js r3.json

# Verify all
node validate-restaurant-distances.js --report-only
```

### Manual Creation

```bash
# Copy template
cp restaurant-template.json my-restaurant.json

# Edit with your favorite editor
# ... edit my-restaurant.json ...

# Validate distance first
node add-restaurant-validator.js <lat> <lng> <resort-id>

# Insert
node insert-restaurant.js my-restaurant.json
```

## 🎨 Restaurant Detail Page Features

The `restaurant-detail.html` page automatically displays:

- ✅ Hero section with interactive map
- ✅ Restaurant and resort location markers
- ✅ Distance to resort
- ✅ Restaurant information (name, description, rating)
- ✅ Contact details (address, phone, website)
- ✅ Hours of operation
- ✅ Menu items (if provided)
- ✅ Platform reviews (Google, Yelp, TripAdvisor, etc.)
- ✅ User reviews (stored locally)
- ✅ SEO metadata
- ✅ Structured data (JSON-LD)

## 🚨 Troubleshooting

### Restaurant page shows "Restaurant not found"
- Check that the `id` in URL matches `id` in data.js
- Verify restaurant is in the `restaurants` array
- Check browser console for errors

### Distance validation fails
- Restaurant must be within 40 miles
- Verify coordinates are correct
- Check resort coordinates are valid

### Insert script fails
- Ensure JSON is valid (use JSON validator)
- Check restaurant ID is unique
- Verify all required fields are present
- Make sure distance validation passes

### Map doesn't display
- Verify coordinates are valid numbers
- Check both restaurant and resort have coordinates
- Ensure Leaflet library loads correctly

## 📝 Best Practices

1. **Always validate distance first** - Use `add-restaurant-validator.js` before generating full data
2. **Save JSON files** - Keep backups for easy re-insertion
3. **Test immediately** - Check the page right after adding
4. **Use the generator** - Ensures proper formatting and validation
5. **Batch process** - Create multiple JSON files, then insert all at once
6. **Update resort counts** - Update `restaurantCount` in resort data after adding

## 🔗 Related Files

- `data.js` - Main data file (contains all restaurants)
- `restaurant-detail.html` - Dynamic detail page template
- `restaurants.html` - Browse page (auto-updates with new restaurants)

## 📈 Next Steps

1. **Expand coverage** - Add restaurants for other resorts
2. **Enrich data** - Add more menu items, reviews, photos
3. **Update counts** - Update resort `restaurantCount` fields
4. **Test pages** - Verify all restaurant pages work correctly

## 💡 Tips

- Use Google Maps to get accurate coordinates
- Copy restaurant IDs from existing entries for consistency
- Include images (logo, background photo) for better presentation
- Add menu items to make pages more useful
- Include platform reviews for social proof

---

**Need Help?** Check the detailed guides:
- Quick start: `QUICK_START_RESTAURANTS.md`
- Full guide: `ADDING_RESTAURANTS_GUIDE.md`
- Validation: `RESTAURANT_VALIDATION_GUIDE.md`




        // ============================================
        // COMPREHENSIVE REDESIGN JAVASCRIPT
        // ============================================
        
        // 1. Hero Carousel
        let currentSlide = 0;
        const heroSlides = document.querySelectorAll('.hero-slide');
        const carouselDots = document.querySelectorAll('.carousel-dot');
        
        function initHeroCarousel() {
            if (heroSlides.length === 0) return;
            
            setInterval(() => {
                heroSlides[currentSlide].classList.remove('active');
                carouselDots[currentSlide]?.classList.remove('active');
                
                currentSlide = (currentSlide + 1) % heroSlides.length;
                
                heroSlides[currentSlide].classList.add('active');
                carouselDots[currentSlide]?.classList.add('active');
            }, 5000);
            
            // Dot click handlers
            carouselDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    heroSlides[currentSlide].classList.remove('active');
                    carouselDots[currentSlide].classList.remove('active');
                    currentSlide = index;
                    heroSlides[currentSlide].classList.add('active');
                    carouselDots[currentSlide].classList.add('active');
                });
            });
        }
        
        // 2. Floating Search Bar
        function initFloatingSearch() {
            const floatingSearch = document.getElementById('floatingSearch');
            const mainSearch = document.getElementById('searchInput');
            const floatingSearchInput = document.getElementById('floatingSearchInput');
            
            if (!floatingSearch || !mainSearch) return;
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    floatingSearch.classList.add('active');
                } else {
                    floatingSearch.classList.remove('active');
                }
            });
            
            // Sync search inputs
            if (floatingSearchInput) {
                floatingSearchInput.addEventListener('input', (e) => {
                    mainSearch.value = e.target.value;
                    if (typeof filterAndSortRestaurants === 'function') {
                        filterAndSortRestaurants();
                    }
                });
                
                mainSearch.addEventListener('input', (e) => {
                    floatingSearchInput.value = e.target.value;
                });
            }
        }
        
        // 3. Filter Presets
        function initFilterPresets() {
            const presets = document.querySelectorAll('.filter-preset');
            presets.forEach(preset => {
                preset.addEventListener('click', () => {
                    const presetType = preset.dataset.preset;
                    applyFilterPreset(presetType);
                });
            });
        }
        
        function applyFilterPreset(preset) {
            // Reset filters first
            document.getElementById('searchInput').value = '';
            document.getElementById('resortFilter').value = '';
            document.getElementById('cuisineFilter').value = '';
            
            switch(preset) {
                case 'quick-lunch':
                    document.getElementById('cuisineFilter').value = 'casual';
                    if (typeof filterAndSortRestaurants === 'function') filterAndSortRestaurants();
                    break;
                case 'romantic-dinner':
                    document.getElementById('cuisineFilter').value = 'fine-dining';
                    if (typeof filterAndSortRestaurants === 'function') filterAndSortRestaurants();
                    break;
                case 'family-friendly':
                    // Apply family-friendly filters
                    if (typeof filterAndSortRestaurants === 'function') filterAndSortRestaurants();
                    break;
                case 'mountain-views':
                    // Filter for restaurants with views
                    if (typeof filterAndSortRestaurants === 'function') filterAndSortRestaurants();
                    break;
                case 'apres-ski':
                    // Filter for après-ski spots
                    if (typeof filterAndSortRestaurants === 'function') filterAndSortRestaurants();
                    break;
            }
        }
        
        // 4. Parallax Effect
        function initParallax() {
            const heroSection = document.querySelector('.hero-section');
            if (!heroSection) return;
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                heroSection.style.transform = `translateY(${rate}px)`;
            });
        }
        
        // 5. FAB Button
        function initFAB() {
            const fabButton = document.getElementById('fabButton');
            const mobileFilterSheet = document.getElementById('mobileFilterSheet');
            
            if (!fabButton) return;
            
            // Show FAB on mobile after scrolling
            window.addEventListener('scroll', () => {
                if (window.innerWidth < 768 && window.scrollY > 200) {
                    fabButton.classList.remove('hidden');
                } else {
                    fabButton.classList.add('hidden');
                }
            });
            
            fabButton.addEventListener('click', () => {
                if (mobileFilterSheet) {
                    mobileFilterSheet.classList.add('active');
                }
            });
        }
        
        // 6. Mobile Bottom Sheet
        function initMobileBottomSheet() {
            const mobileFilterSheet = document.getElementById('mobileFilterSheet');
            const closeBtn = document.getElementById('closeMobileFilters');
            const sheetHandle = mobileFilterSheet?.querySelector('.sheet-handle');
            
            if (!mobileFilterSheet) return;
            
            // Close button
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    mobileFilterSheet.classList.remove('active');
                });
            }
            
            // Close on outside click
            mobileFilterSheet.addEventListener('click', (e) => {
                if (e.target === mobileFilterSheet) {
                    mobileFilterSheet.classList.remove('active');
                }
            });
            
            // Swipe down to close
            let startY = 0;
            if (sheetHandle) {
                sheetHandle.addEventListener('touchstart', (e) => {
                    startY = e.touches[0].clientY;
                });
                
                sheetHandle.addEventListener('touchmove', (e) => {
                    const currentY = e.touches[0].clientY;
                    if (currentY - startY > 50) {
                        mobileFilterSheet.classList.remove('active');
                    }
                });
            }
        }
        
        // 7. Pull to Refresh
        function initPullToRefresh() {
            const indicator = document.getElementById('pullToRefreshIndicator');
            if (!indicator) return;
            
            let startY = 0;
            let isPulling = false;
            
            document.addEventListener('touchstart', (e) => {
                if (window.scrollY === 0) {
                    startY = e.touches[0].clientY;
                    isPulling = true;
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isPulling) return;
                
                const currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 80) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            document.addEventListener('touchend', () => {
                if (indicator.classList.contains('active')) {
                    // Refresh data
                    if (typeof filterAndSortRestaurants === 'function') {
                        filterAndSortRestaurants();
                    }
                    setTimeout(() => {
                        indicator.classList.remove('active');
                    }, 1000);
                }
                isPulling = false;
            });
        }
        
        // 8. Update Stats
        function updateHeroStats() {
            // This will be called after restaurants are loaded
            const totalRestaurants = allRestaurants.length || 1234;
            const totalResorts = new Set(
                allRestaurants.flatMap(r => {
                    const resorts = getRestaurantResorts(r);
                    return resorts.map(res => res.id);
                })
            ).size || 45;
            const totalCuisines = new Set(allRestaurants.map(r => r.cuisine)).size || 12;
            
            const restaurantsEl = document.getElementById('totalRestaurants');
            const resortsEl = document.getElementById('totalResorts');
            const cuisinesEl = document.getElementById('totalCuisines');
            
            if (restaurantsEl) restaurantsEl.textContent = totalRestaurants.toLocaleString();
            if (resortsEl) resortsEl.textContent = totalResorts;
            if (cuisinesEl) cuisinesEl.textContent = totalCuisines;
        }
        
        // Initialize all new features
        document.addEventListener('DOMContentLoaded', () => {
            initHeroCarousel();
            initFloatingSearch();
            initFilterPresets();
            initParallax();
            initFAB();
            initMobileBottomSheet();
            initPullToRefresh();
        });
        
        // Core Data
        let allRestaurants = [];
        let filteredRestaurants = [];
        let sortedRestaurants = [];
        let displayedRestaurantCount = 0;
        const INITIAL_RESTAURANT_COUNT = 12;
        const LOAD_MORE_COUNT = 12;
        
        // Feature State
        let currentView = 'grid'; // 'grid' or 'list'
        let comparisonMode = false;
        let selectedForComparison = new Set();
        let infiniteScrollEnabled = true;
        let advancedFilters = {
            priceMin: 1,
            priceMax: 4,
            ratingMin: 0,
            distanceMax: 100,
            dietary: [],
            mealType: []
        };
        
        // Feature 29: Filter Persistence
        function saveFiltersToStorage() {
            const filters = {
                search: document.getElementById('searchInput').value,
                resort: document.getElementById('resortFilter').value,
                cuisine: document.getElementById('cuisineFilter').value,
                sort: document.getElementById('sortSelect').value,
                view: currentView,
                advanced: advancedFilters
            };
            localStorage.setItem('snogrub_filters', JSON.stringify(filters));
        }
        
        function loadFiltersFromStorage() {
            const saved = localStorage.getItem('snogrub_filters');
            if (saved) {
                try {
                    const filters = JSON.parse(saved);
                    if (filters.search) document.getElementById('searchInput').value = filters.search;
                    if (filters.resort) document.getElementById('resortFilter').value = filters.resort;
                    if (filters.cuisine) document.getElementById('cuisineFilter').value = filters.cuisine;
                    if (filters.sort) document.getElementById('sortSelect').value = filters.sort;
                    if (filters.view) {
                        currentView = filters.view;
                        setViewMode(filters.view);
                    }
                    if (filters.advanced) advancedFilters = { ...advancedFilters, ...filters.advanced };
                } catch (e) {
                    console.error('Error loading filters:', e);
                }
            }
        }
        // Calculate distance between two coordinates (Haversine formula)
        // Returns distance in km
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c; // Distance in km
        }
        
        // Calculate distance in miles
        function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
            return calculateDistance(lat1, lon1, lat2, lon2) * 0.621371;
        }
        
        // Helper function to normalize category - handles both string and array
        // Returns an array of category strings (lowercased)
        function normalizeCategory(category, fallback = 'restaurant') {
            if (!category) return [fallback];
            if (Array.isArray(category)) {
                return category.map(c => String(c).toLowerCase());
            }
            return [String(category).toLowerCase()];
        }
        
        // Helper function to check if a restaurant has a specific category
        function hasCategory(restaurant, categoryToCheck) {
            const category = restaurant.category || restaurant.type;
            const categories = normalizeCategory(category);
            const checkCategory = String(categoryToCheck).toLowerCase();
            return categories.includes(checkCategory);
        }
        
        // Helper function to get the primary category (first in array, or single value)
        function getPrimaryCategory(restaurant, fallback = 'restaurant') {
            const category = restaurant.category || restaurant.type;
            const categories = normalizeCategory(category, fallback);
            return categories[0];
        }
        
        // Transform restaurant data: convert old resort (string) to new resorts (array) structure
        // This function handles both old and new data formats for backward compatibility
        function normalizeRestaurantResorts(restaurants, resorts) {
            const MAX_DISTANCE_MILES = 30;
            
            return restaurants.map(restaurant => {
                // If already in new format (has resorts array), use it
                if (restaurant.resorts && Array.isArray(restaurant.resorts)) {
                    // Ensure resorts are sorted by distance
                    const sortedResorts = [...restaurant.resorts].sort((a, b) => {
                        if (a.distance === null || a.distance === undefined) return 1;
                        if (b.distance === null || b.distance === undefined) return -1;
                        return a.distance - b.distance;
                    });
                    return { ...restaurant, resorts: sortedResorts };
                }
                
                // Old format: has single resort property - transform it
                if (restaurant.resort) {
                    // If restaurant has coordinates, calculate distances to all resorts
                    if (restaurant.coordinates && restaurant.coordinates.lat && restaurant.coordinates.lng) {
                        const restaurantLat = restaurant.coordinates.lat;
                        const restaurantLng = restaurant.coordinates.lng;
                        const nearbyResorts = [];
                        
                        // Calculate distance to all resorts
                        resorts.forEach(resort => {
                            if (resort.coordinates && resort.coordinates.lat && resort.coordinates.lng) {
                                const distance = calculateDistanceMiles(
                                    restaurantLat,
                                    restaurantLng,
                                    resort.coordinates.lat,
                                    resort.coordinates.lng
                                );
                                
                                // Only include resorts within 30 miles
                                if (distance <= MAX_DISTANCE_MILES) {
                                    nearbyResorts.push({
                                        id: resort.id,
                                        distance: Math.round(distance * 10) / 10
                                    });
                                }
                            }
                        });
                        
                        // Sort by distance (closest first)
                        nearbyResorts.sort((a, b) => {
                            if (a.distance === null) return 1;
                            if (b.distance === null) return -1;
                            return a.distance - b.distance;
                        });
                        
                        // Ensure the original resort is included (even if slightly over 30 miles)
                        const hasOriginalResort = nearbyResorts.some(r => r.id === restaurant.resort);
                        if (!hasOriginalResort) {
                            const originalResort = resorts.find(r => r.id === restaurant.resort);
                            if (originalResort && originalResort.coordinates) {
                                const distance = calculateDistanceMiles(
                                    restaurantLat,
                                    restaurantLng,
                                    originalResort.coordinates.lat,
                                    originalResort.coordinates.lng
                                );
                                nearbyResorts.push({
                                    id: restaurant.resort,
                                    distance: Math.round(distance * 10) / 10
                                });
                                nearbyResorts.sort((a, b) => a.distance - b.distance);
                            } else {
                                nearbyResorts.unshift({ id: restaurant.resort, distance: null });
                            }
                        }
                        
                        const newRestaurant = { ...restaurant };
                        delete newRestaurant.resort;
                        newRestaurant.resorts = nearbyResorts.length > 0 ? nearbyResorts : [{ id: restaurant.resort, distance: null }];
                        return newRestaurant;
                    } else {
                        // No coordinates - just convert to array format
                        const newRestaurant = { ...restaurant };
                        delete newRestaurant.resort;
                        newRestaurant.resorts = [{ id: restaurant.resort, distance: null }];
                        return newRestaurant;
                    }
                }
                
                // No resort data at all
                return { ...restaurant, resorts: [] };
            });
        }
        
        // Get the closest resort for a restaurant (for display purposes)
        function getClosestResort(restaurant) {
            if (!restaurant.resorts || restaurant.resorts.length === 0) {
                return null;
            }
            // Resorts should already be sorted, but ensure it
            const sorted = [...restaurant.resorts].sort((a, b) => {
                if (a.distance === null || a.distance === undefined) return 1;
                if (b.distance === null || b.distance === undefined) return -1;
                return a.distance - b.distance;
            });
            return sorted[0];
        }
        
        // Get all resorts for a restaurant, sorted by distance
        function getRestaurantResorts(restaurant) {
            if (!restaurant.resorts || restaurant.resorts.length === 0) {
                return [];
            }
            return [...restaurant.resorts].sort((a, b) => {
                if (a.distance === null || a.distance === undefined) return 1;
                if (b.distance === null || b.distance === undefined) return -1;
                return a.distance - b.distance;
            });
        }
        
        // Get resort name(s) for display, showing closest first
        function getResortNamesForDisplay(restaurant, resortsData, maxResorts = 2) {
            const restaurantResorts = getRestaurantResorts(restaurant);
            if (restaurantResorts.length === 0) return '';
            
            const resortNames = restaurantResorts
                .slice(0, maxResorts)
                .map(r => {
                    const resort = resortsData.find(res => res.id === r.id);
                    return resort ? resort.name : r.id;
                });
            
            if (restaurantResorts.length > maxResorts) {
                return resortNames.join(', ') + ` +${restaurantResorts.length - maxResorts} more`;
            }
            return resortNames.join(', ');
        }
        
        // Get sorted restaurants list (sorted by distance if location available, otherwise by popularity)
        function getSortedRestaurants() {
            if (sortedRestaurants.length > 0) {
                return sortedRestaurants;
            }
            
            // Check if user location is stored in localStorage
            const storedLocation = localStorage.getItem('snogrub_user_location');
            let userLat = null;
            let userLng = null;
            
            if (storedLocation) {
                try {
                    const location = JSON.parse(storedLocation);
                    userLat = location.lat;
                    userLng = location.lng;
                } catch (e) {
                    console.error('Error parsing stored location:', e);
                }
            }
            
            if (userLat && userLng && allRestaurants.length > 0) {
                // User location available - sort by distance (closest first)
                sortedRestaurants = allRestaurants
                    .map(restaurant => {
                        if (restaurant.coordinates && restaurant.coordinates.lat && restaurant.coordinates.lng) {
                            const distanceKm = calculateDistance(
                                userLat, 
                                userLng, 
                                restaurant.coordinates.lat, 
                                restaurant.coordinates.lng
                            );
                            const distanceMiles = distanceKm * 0.621371; // Convert km to miles
                            return { ...restaurant, distance: distanceMiles };
                        }
                        return { ...restaurant, distance: null };
                    })
                    .sort((a, b) => {
                        if (a.distance === null && b.distance === null) return 0;
                        if (a.distance === null) return 1;
                        if (b.distance === null) return -1;
                        return a.distance - b.distance;
                    });
            } else {
                // No user location - sort by popularity (featured first, then by rating)
                sortedRestaurants = [...allRestaurants]
                    .map(restaurant => ({ ...restaurant, distance: null }))
                    .sort((a, b) => {
                        // First sort by featured status (featured first)
                        if (a.featured && !b.featured) return -1;
                        if (!a.featured && b.featured) return 1;
                        // Then by rating (highest first)
                        return (b.rating || 0) - (a.rating || 0);
                    });
            }
            
            return sortedRestaurants;
        }
        
        // Helper function to parse location string
        function parseLocation(locationStr) {
            if (!locationStr) return { state: '', country: '', parts: [] };
            const parts = locationStr.split(',').map(p => p.trim());
            return {
                state: parts[0] || '',
                country: parts[1] || '',
                parts: parts
            };
        }
        
        // Helper function to generate satellite image URL using Esri World Imagery (100% FREE - No API key required)
        function getSatelliteImageUrl(lat, lng, width = 640, height = 360) {
            const zoom = 17; // High zoom for detail (shows building/street level)
            const scale = Math.pow(2, zoom);
            const worldCoordinateX = (lng + 180) / 360 * scale;
            const worldCoordinateY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale;
            const tileX = Math.floor(worldCoordinateX);
            const tileY = Math.floor(worldCoordinateY);
            
            // Use Esri World Imagery for satellite view (free, no API key required)
            return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
        }
        
        // Helper function to generate OpenStreetMap map tile URL (100% FREE - No API key required) - kept as fallback
        function getStreetViewImageUrl(lat, lng, width = 640, height = 360) {
            const zoom = 17; // High zoom for detail (shows building/street level)
            const scale = Math.pow(2, zoom);
            const worldCoordinateX = (lng + 180) / 360 * scale;
            const worldCoordinateY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale;
            const tileX = Math.floor(worldCoordinateX);
            const tileY = Math.floor(worldCoordinateY);
            
            return `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
        }
        
        // Load restaurants from data - filter to show only restaurants (not bars)
        function loadRestaurants() {
            try {
                console.log('Loading restaurants...');
                console.log('skiEatsData type:', typeof skiEatsData);
                
                if (typeof skiEatsData !== 'undefined' && skiEatsData && skiEatsData.restaurants) {
                    console.log('Found restaurants:', skiEatsData.restaurants.length);
                    
                    // Normalize restaurant data: convert old resort (string) to new resorts (array) structure
                    const normalizedRestaurants = normalizeRestaurantResorts(
                        skiEatsData.restaurants, 
                        skiEatsData.resorts || []
                    );
                    
                    // Filter restaurants - exclude bars (category === 'bar' or type === 'bar')
                    allRestaurants = normalizedRestaurants.filter(restaurant => {
                        const categories = normalizeCategory(restaurant.category || restaurant.type, '');
                        return !categories.includes('bar') && !categories.includes('après bar') && !categories.includes('après');
                    });
                    
                    console.log('Filtered restaurants (excluding bars):', allRestaurants.length);
                    
                    // Reset sorted restaurants when data changes
                    sortedRestaurants = [];
                    displayedRestaurantCount = 0;
                    
                    // Populate resort filter
                    try {
                        populateResortFilter();
                    } catch (e) {
                        console.error('Error populating resort filter:', e);
                    }
                    
                    // Populate cuisine filter
                    try {
                        populateCuisineFilter();
                    } catch (e) {
                        console.error('Error populating cuisine filter:', e);
                    }
                    
                    // Filter and render restaurants
                    try {
                        filterAndSortRestaurants();
                    } catch (e) {
                        console.error('Error filtering and sorting restaurants:', e, e.stack);
                        // Fallback: just render all restaurants
                        filteredRestaurants = allRestaurants;
                        renderRestaurants();
                    }
                    
                    // Safety check: ensure restaurants are rendered (handles timing issues)
                    setTimeout(() => {
                        const grid = document.getElementById('restaurantsGrid');
                        if (grid && grid.children.length === 0) {
                            if (!filteredRestaurants || filteredRestaurants.length === 0) {
                                filteredRestaurants = allRestaurants;
                            }
                            if (filteredRestaurants && filteredRestaurants.length > 0) {
                                renderRestaurants();
                            }
                        }
                    }, 200);
                    
                    // Hide loading state
                    const loadingState = document.getElementById('loadingState');
                    const restaurantsGrid = document.getElementById('restaurantsGrid');
                    if (loadingState) loadingState.classList.add('hidden');
                    if (restaurantsGrid) restaurantsGrid.classList.remove('hidden');
                    
                    // Update hero stats
                    updateHeroStats();
                } else {
                    console.error('Restaurant data not found. skiEatsData:', typeof skiEatsData);
                    const loadingState = document.getElementById('loadingState');
                    const emptyState = document.getElementById('emptyState');
                    if (loadingState) loadingState.classList.add('hidden');
                    if (emptyState) emptyState.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error in loadRestaurants:', error);
                const loadingState = document.getElementById('loadingState');
                const emptyState = document.getElementById('emptyState');
                if (loadingState) loadingState.classList.add('hidden');
                if (emptyState) emptyState.classList.remove('hidden');
            }
        }
        
        // Populate resort filter dropdown
        function populateResortFilter() {
            const resortFilter = document.getElementById('resortFilter');
            const resorts = new Set();
            
            allRestaurants.forEach(restaurant => {
                const restaurantResorts = getRestaurantResorts(restaurant);
                restaurantResorts.forEach(r => {
                    const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                    if (resort) {
                        resorts.add(resort.name);
                    }
                });
            });
            
            const sortedResorts = Array.from(resorts).sort();
            sortedResorts.forEach(resortName => {
                const option = document.createElement('option');
                option.value = resortName;
                option.textContent = resortName;
                resortFilter.appendChild(option);
            });
        }
        
        // Populate cuisine filter dropdown based on actual restaurant data
        function populateCuisineFilter() {
            const cuisineFilter = document.getElementById('cuisineFilter');
            const cuisines = new Set();
            
            // Extract unique cuisines from all restaurants
            allRestaurants.forEach(restaurant => {
                const cuisine = restaurant.cuisine || restaurant.type || '';
                if (cuisine) {
                    // Split comma-separated cuisine values and trim whitespace
                    const cuisineList = cuisine.split(',').map(c => c.trim()).filter(c => c.length > 0);
                    cuisineList.forEach(c => cuisines.add(c));
                }
            });
            
            // Sort cuisines alphabetically and add to dropdown
            const sortedCuisines = Array.from(cuisines).sort();
            sortedCuisines.forEach(cuisineName => {
                const option = document.createElement('option');
                option.value = cuisineName;
                option.textContent = cuisineName;
                cuisineFilter.appendChild(option);
            });
        }
        
        // Render restaurant cards
        function renderRestaurants() {
            try {
                const grid = document.getElementById('restaurantsGrid');
                const emptyState = document.getElementById('emptyState');
                const resultsCount = document.getElementById('resultsCount');
                
                if (!grid) {
                    console.error('Restaurants grid element not found');
                    return;
                }
                
                if (!filteredRestaurants || filteredRestaurants.length === 0) {
                    if (grid) grid.classList.add('hidden');
                    if (emptyState) emptyState.classList.remove('hidden');
                    if (resultsCount) resultsCount.textContent = 'No restaurants found';
                    return;
                }
                
                if (grid) grid.classList.remove('hidden');
                if (emptyState) emptyState.classList.add('hidden');
                if (resultsCount) resultsCount.textContent = `${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? 's' : ''} found`;
            
            const categoryColors = {
                restaurant: { bg: 'from-amber-50 to-orange-50', icon: 'text-amber-400', badge: 'bg-gray-100 text-gray-700' },
                bar: { bg: 'from-blue-50 to-cyan-50', icon: 'text-blue-400', badge: 'bg-blue-100 text-blue-700' },
                cafe: { bg: 'from-green-50 to-emerald-50', icon: 'text-green-400', badge: 'bg-green-100 text-green-700' }
            };
            
            const categoryLabels = {
                restaurant: 'Restaurant',
                bar: 'Après Bar',
                cafe: 'Café'
            };
            
            // Function to get icon SVG based on category
            function getCategoryIcon(category) {
                switch(category) {
                    case 'restaurant':
                        return `<svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2v20M9 2l3-1 3 1M9 2v20M15 2v20M7 4h2M7 8h2M7 12h2M7 16h2M15 4h2M15 8h2M15 12h2M15 16h2"></path>
                                </svg>`;
                    case 'bar':
                        return `<svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2v16M8 2h8M8 2l-1 2h10l-1-2M7 4h10M7 4l1 10h8l1-10M10 14h4M10 16h4"></path>
                                </svg>`;
                    case 'cafe':
                        return `<svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 4h14M5 4v12a2 2 0 002 2h10a2 2 0 002-2V4M5 4H3m16 0h2M8 18h8M8 18v2a2 2 0 002 2h4a2 2 0 002-2v-2M9 6h6M9 8h6"></path>
                                </svg>`;
                    default:
                        return `<svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2v20M9 2l3-1 3 1M9 2v20M15 2v20M7 4h2M7 8h2M7 12h2M7 16h2M15 4h2M15 8h2M15 12h2M15 16h2"></path>
                                </svg>`;
                }
            }
            
            // Determine how many to show
            if (displayedRestaurantCount === 0) {
                displayedRestaurantCount = Math.min(INITIAL_RESTAURANT_COUNT, filteredRestaurants.length);
            } else {
                displayedRestaurantCount = Math.min(displayedRestaurantCount, filteredRestaurants.length);
            }
            const restaurantsToShow = filteredRestaurants.slice(0, displayedRestaurantCount);
            
            grid.innerHTML = restaurantsToShow.map((restaurant, index) => {
                try {
                    // Feature 21: Track view for recently viewed
                    if (typeof addToRecentlyViewed === 'function') {
                        try {
                            addToRecentlyViewed(restaurant.id);
                        } catch (e) {
                            console.warn('Error adding to recently viewed:', e);
                        }
                    }
                    
                    // Feature 43: Get availability
                    let availability = null;
                    if (typeof getAvailabilityStatus === 'function') {
                        try {
                            availability = getAvailabilityStatus(restaurant);
                        } catch (e) {
                            console.warn('Error getting availability:', e);
                        }
                    }
                    
                    // Feature 24: Get review snippet
                    let reviewSnippet = null;
                    if (typeof getReviewSnippet === 'function') {
                        try {
                            reviewSnippet = getReviewSnippet(restaurant);
                        } catch (e) {
                            console.warn('Error getting review snippet:', e);
                        }
                    }
                    
                    // Feature 25: Get social proof
                    let socialProof = [];
                    if (typeof getSocialProof === 'function') {
                        try {
                            socialProof = getSocialProof(restaurant) || [];
                        } catch (e) {
                            console.warn('Error getting social proof:', e);
                        }
                    }
                    
                    // Feature 26: Get quick actions
                    let quickActions = [];
                    if (typeof getQuickActions === 'function') {
                        try {
                            quickActions = getQuickActions(restaurant) || [];
                        } catch (e) {
                            console.warn('Error getting quick actions:', e);
                        }
                    }
                    
                    // Feature 46: Photo count
                    let photoCount = null;
                    if (typeof getPhotoCount === 'function') {
                        try {
                            photoCount = getPhotoCount(restaurant);
                        } catch (e) {
                            console.warn('Error getting photo count:', e);
                        }
                    }
                    
                    // Feature 47: Last updated
                    let lastUpdated = null;
                    if (typeof getLastUpdated === 'function') {
                        try {
                            lastUpdated = getLastUpdated(restaurant);
                        } catch (e) {
                            console.warn('Error getting last updated:', e);
                        }
                    }
                    
                    // Feature 9: Comparison checkbox
                    const comparisonChecked = typeof selectedForComparison !== 'undefined' && selectedForComparison.has(restaurant.id);
                    
                    // Calculate variables BEFORE the template literal
                    const primaryCategory = getPrimaryCategory(restaurant, 'restaurant');
                    const colors = categoryColors[primaryCategory] || categoryColors.restaurant;
                    const categoryLabel = categoryLabels[primaryCategory] || 'Restaurant';
                    const categoryIcon = getCategoryIcon(primaryCategory);
                    
                    // Get resort name(s) - show closest first
                    const closestResort = getClosestResort(restaurant);
                    const resortName = closestResort 
                        ? (skiEatsData.resorts?.find(r => r.id === closestResort.id)?.name || closestResort.id)
                        : (restaurant.location || 'Unknown Resort');
                    
                    // Get all resort names for display (closest first)
                    const allResortNames = getResortNamesForDisplay(restaurant, skiEatsData.resorts || []);
                    
                    // Generate satellite image URL (like resorts.html)
                    let satelliteImageUrl = null;
                    if (restaurant.coordinates && restaurant.coordinates.lat && restaurant.coordinates.lng) {
                        satelliteImageUrl = getSatelliteImageUrl(
                            restaurant.coordinates.lat, 
                            restaurant.coordinates.lng,
                            640,
                            360
                        );
                    }
                    
                    // Generate OpenStreetMap map tile URL (as fallback)
                    let mapImageUrl = null;
                    if (restaurant.coordinates && restaurant.coordinates.lat && restaurant.coordinates.lng) {
                        mapImageUrl = getStreetViewImageUrl(
                            restaurant.coordinates.lat, 
                            restaurant.coordinates.lng,
                            640,
                            360
                        );
                    }
                    
                    // Check for scraped logo and background photo (prioritize these)
                    const hasLogo = restaurant.logo && restaurant.logo.startsWith('http');
                    const hasBackgroundPhoto = restaurant.backgroundPhoto && restaurant.backgroundPhoto.startsWith('http');
                    
                    // Check if restaurant has a custom image (fallback)
                    const hasCustomImage = !hasBackgroundPhoto && restaurant.image && restaurant.image.startsWith('http');
                    const imageUrl = restaurant.image || '';
                    
                    // Logo URL
                    const logoUrl = restaurant.logo || null;
                    // Background photo URL (prioritize scraped, then custom image, then satellite image, then map)
                    const backgroundImageUrl = restaurant.backgroundPhoto || 
                                              (hasCustomImage ? imageUrl : (satelliteImageUrl || mapImageUrl)) || 
                                              null;
                    
                    // Rating display
                    const rating = restaurant.rating || 0;
                    
                    // Price range
                    const priceRange = restaurant.priceRange || restaurant.price || '';
                    
                    // Cuisine type
                    const cuisine = restaurant.cuisine || restaurant.type || '';
                    
                    // Now prepare variables for template literal
                    const restaurantId = restaurant.id;
                    const restaurantName = (restaurant.name || 'Restaurant').replace(/'/g, "\\'");
                    const isComparisonMode = typeof comparisonMode !== 'undefined' && comparisonMode;
                    
                    // Now return the template literal with enhanced design
                    return `
                        <div class="restaurant-card-enhanced swipeable-card-mobile"
                             data-restaurant-id="${restaurantId}"
                             onclick="if(typeof showQuickPreview === 'function') showQuickPreview('${restaurantId}')"
                             role="article"
                             aria-label="${restaurantName}">
                            <!-- Badge Container -->
                            <div class="card-badge-container">
                                ${restaurant.featured ? '<span class="card-badge-new">Featured</span>' : ''}
                                ${restaurant.rating && restaurant.rating >= 4.5 ? '<span class="card-badge-trending">Popular</span>' : ''}
                                ${restaurant.new ? '<span class="card-badge-new">New</span>' : ''}
                            </div>
                            ${isComparisonMode ? `
                                <input type="checkbox" class="comparison-checkbox" ${comparisonChecked ? 'checked' : ''} 
                                       onclick="event.stopPropagation(); if(typeof toggleComparisonSelection === 'function') toggleComparisonSelection('${restaurantId}')"
                                       ${typeof selectedForComparison !== 'undefined' && selectedForComparison.size >= 3 && !comparisonChecked ? 'disabled' : ''}>
                            ` : ''}
                            ${isComparisonMode ? `
                                <div class="swipe-actions">
                                    <button onclick="event.stopPropagation(); const btn = this.closest('.restaurant-card-enhanced').querySelector('.favorite-btn'); if(btn && typeof toggleFavorite === 'function') toggleFavorite(btn);" class="text-white">Favorite</button>
                                    <button onclick="event.stopPropagation(); if(typeof shareRestaurant === 'function') shareRestaurant('${restaurantId}')" class="text-white">Share</button>
                                </div>
                            ` : ''}
                        <div class="card-image-wrapper">
                            <!-- Hover Overlay -->
                            <div class="card-hover-overlay">
                                <div class="card-hover-info">
                                    <div class="card-hover-rating">★ ${rating > 0 ? rating.toFixed(1) : 'N/A'}</div>
                                    <div class="card-hover-price">${priceRange || 'Price varies'}</div>
                                </div>
                            </div>
                            <!-- Quick View Button -->
                            <button class="quick-view-btn" onclick="event.stopPropagation(); if(typeof showQuickPreview === 'function') showQuickPreview('${restaurantId}')">
                                Quick View
                            </button>
                            ${photoCount ? `
                                <div class="photo-count">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    ${photoCount}
                                </div>
                            ` : ''}
                            <a href="restaurant-detail.html?id=${restaurantId}" class="block w-full h-full relative" onclick="event.stopPropagation(); if(typeof trackEvent === 'function') trackEvent('Restaurant', 'Click', '${restaurantName.replace(/'/g, "\\'")}')">
                                ${backgroundImageUrl ? `
                                    <!-- Background Photo or Satellite Image -->
                                    <div class="absolute inset-0 w-full h-full">
                                        <img src="${backgroundImageUrl}" 
                                             alt="${restaurant.name}" 
                                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                             style="filter: brightness(0.7);"
                                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                                             loading="lazy">
                                        <!-- Fallback if background photo/satellite fails -->
                                        <div class="hidden absolute inset-0 bg-gradient-to-br ${colors.bg}">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="${colors.icon}">
                                                    ${categoryIcon}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ${logoUrl ? `
                                        <!-- Logo overlaying background photo/satellite image -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <img src="${logoUrl}" 
                                                 alt="${restaurant.name} logo" 
                                                 class="max-w-[60%] max-h-[60%] object-contain drop-shadow-lg"
                                                 style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));"
                                                 onerror="this.style.display='none';"
                                                 loading="lazy">
                                        </div>
                                    ` : `
                                        <!-- No logo, show category icon as fallback -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <div class="${colors.icon} drop-shadow-lg" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
                                                ${categoryIcon}
                                            </div>
                                        </div>
                                    `}
                                ` : hasCustomImage ? `
                                    <!-- Custom Restaurant Image (if available - HTTP/HTTPS URLs only) -->
                                    <img src="${imageUrl}" 
                                         alt="${restaurant.name}" 
                                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                    ${logoUrl ? `
                                        <!-- Logo overlaying custom image -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <img src="${logoUrl}" 
                                                 alt="${restaurant.name} logo" 
                                                 class="max-w-[60%] max-h-[60%] object-contain drop-shadow-lg"
                                                 style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));"
                                                 onerror="this.style.display='none';"
                                                 loading="lazy">
                                        </div>
                                    ` : ''}
                                    <!-- Fallback to satellite image if custom image fails -->
                                    <div class="hidden">
                                        ${satelliteImageUrl ? `
                                            <img src="${satelliteImageUrl}" 
                                                 alt="Satellite view of ${restaurant.name}" 
                                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                 style="filter: brightness(0.7);"
                                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                                 loading="lazy">
                                            ${logoUrl ? `
                                                <!-- Logo overlaying satellite image -->
                                                <div class="absolute inset-0 flex items-center justify-center z-10">
                                                    <img src="${logoUrl}" 
                                                         alt="${restaurant.name} logo" 
                                                         class="max-w-[60%] max-h-[60%] object-contain drop-shadow-lg"
                                                         style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));"
                                                         onerror="this.style.display='none';"
                                                         loading="lazy">
                                                </div>
                                            ` : ''}
                                        ` : mapImageUrl ? `
                                            <img src="${mapImageUrl}" 
                                                 alt="Map view of ${restaurant.name}" 
                                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                                 loading="lazy">
                                        ` : ''}
                                        <div class="absolute inset-0 flex items-center justify-center hidden">
                                            <div class="${colors.icon}">
                                                ${categoryIcon}
                                            </div>
                                        </div>
                                    </div>
                                ` : satelliteImageUrl ? `
                                    <!-- Satellite Image (like resorts.html) -->
                                    <img src="${satelliteImageUrl}" 
                                         alt="Satellite view of ${restaurant.name}" 
                                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                         style="filter: brightness(0.7);"
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                         loading="lazy">
                                    ${logoUrl ? `
                                        <!-- Logo overlaying satellite image -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <img src="${logoUrl}" 
                                                 alt="${restaurant.name} logo" 
                                                 class="max-w-[60%] max-h-[60%] object-contain drop-shadow-lg"
                                                 style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));"
                                                 onerror="this.style.display='none';"
                                                 loading="lazy">
                                        </div>
                                    ` : `
                                        <!-- No logo, show category icon as fallback -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <div class="${colors.icon} drop-shadow-lg" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
                                                ${categoryIcon}
                                            </div>
                                        </div>
                                    `}
                                    <!-- Fallback to icon if satellite image fails -->
                                    <div class="absolute inset-0 flex items-center justify-center hidden">
                                        <div class="${colors.icon}">
                                            ${categoryIcon}
                                        </div>
                                    </div>
                                ` : mapImageUrl ? `
                                    <!-- OpenStreetMap Map Tile (FREE - No API key required) - Fallback -->
                                    <img src="${mapImageUrl}" 
                                         alt="Map view of ${restaurant.name}" 
                                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                         loading="lazy">
                                    ${logoUrl ? `
                                        <!-- Logo overlaying map -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <img src="${logoUrl}" 
                                                 alt="${restaurant.name} logo" 
                                                 class="max-w-[60%] max-h-[60%] object-contain drop-shadow-lg bg-white/80 rounded-lg p-4"
                                                 style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));"
                                                 onerror="this.style.display='none';"
                                                 loading="lazy">
                                        </div>
                                    ` : ''}
                                    <!-- Fallback to icon if map tile fails -->
                                    <div class="absolute inset-0 flex items-center justify-center hidden">
                                        <div class="${colors.icon}">
                                            ${categoryIcon}
                                        </div>
                                    </div>
                                    <!-- OpenStreetMap Attribution (Required by ODbL License) -->
                                    <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-700 flex items-center gap-1 pointer-events-none">
                                        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-gray-700 hover:text-[var(--accent-blue)]">
                                            <span>© OSM</span>
                                        </a>
                                    </div>
                                ` : `
                                    <!-- Fallback: Icon if no map available -->
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="${colors.icon}">
                                            ${categoryIcon}
                                        </div>
                                    </div>
                                    ${logoUrl ? `
                                        <!-- Logo overlaying icon -->
                                        <div class="absolute inset-0 flex items-center justify-center z-10">
                                            <img src="${logoUrl}" 
                                                 alt="${restaurant.name} logo" 
                                                 class="max-w-[60%] max-h-[60%] object-contain"
                                                 onerror="this.style.display='none';"
                                                 loading="lazy">
                                        </div>
                                    ` : ''}
                                `}
                            </a>
                        </div>
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-[var(--accent-blue)] transition-colors duration-200">
                                            ${restaurant.name || 'Restaurant'}
                                        </h3>
                                        ${restaurant.featured ? '<span class="restaurant-badge badge-featured">Featured</span>' : ''}
                                        ${restaurant.rating && restaurant.rating >= 4.5 ? '<span class="restaurant-badge badge-popular">Popular</span>' : ''}
                                    </div>
                                    ${availability ? `
                                        <span class="availability-badge availability-${availability.status}">
                                            ${availability.label}
                                        </span>
                                    ` : ''}
                                </div>
                                <button class="favorite-btn opacity-0 group-hover:opacity-100 transition-opacity" 
                                        data-id="${restaurant.id}" 
                                        data-name="${restaurant.name}" 
                                        data-location="${resortName}" 
                                        data-rating="${rating}" 
                                        data-category="${category}" 
                                        onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite(this)">
                                    <svg class="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </button>
                            </div>
                            ${(() => {
                                const restaurantResorts = getRestaurantResorts(restaurant);
                                if (restaurantResorts.length === 0) {
                                    return `<p class="text-sm text-gray-600 mb-3">${restaurant.location || 'Location TBD'}${restaurant.distance ? ` • ${restaurant.distance.toFixed(1)} mi away` : ''}</p>`;
                                }
                                
                                if (restaurantResorts.length === 1) {
                                    // Single resort: show on one line with distance
                                    const r = restaurantResorts[0];
                                    const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                                    const name = resort ? resort.name : r.id;
                                    const distanceText = r.distance !== null && r.distance !== undefined ? ` (${r.distance.toFixed(1)} mi)` : '';
                                    return `<p class="text-sm text-gray-600 mb-3">${name}${distanceText}${restaurant.distance ? ` • ${restaurant.distance.toFixed(1)} mi away` : ''}</p>`;
                                } else {
                                    // Multiple resorts: show each on separate line with distance
                                    const resortLines = restaurantResorts.map(r => {
                                        const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                                        const name = resort ? resort.name : r.id;
                                        const distanceText = r.distance !== null && r.distance !== undefined ? ` (${r.distance.toFixed(1)} mi)` : '';
                                        return `<div class="text-sm text-gray-600">${name}${distanceText}</div>`;
                                    }).join('');
                                    return `<div class="mb-3 space-y-1">${resortLines}${restaurant.distance ? `<div class="text-sm text-gray-500 mt-1">${restaurant.distance.toFixed(1)} mi away</div>` : ''}</div>`;
                                }
                            })()}
                            ${cuisine ? `<p class="text-sm text-gray-500 mb-3">${cuisine}</p>` : ''}
                            <div class="flex items-center justify-between mb-4">
                                <span class="inline-block px-3 py-1 ${colors.badge} text-xs font-medium rounded-full" data-category="${category}">
                                    ${categoryLabel}
                                </span>
                                ${rating > 0 ? `<span class="text-sm font-semibold text-yellow-600">★ ${rating.toFixed(1)}</span>` : ''}
                            </div>
                            ${restaurant.description ? `<p class="text-sm text-gray-600 mb-4 line-clamp-2">${restaurant.description.substring(0, 100)}${restaurant.description.length > 100 ? '...' : ''}</p>` : ''}
                            ${reviewSnippet ? `<p class="review-snippet">"${reviewSnippet}"</p>` : ''}
                            ${socialProof.length > 0 ? `
                                <div class="social-proof">
                                    ${socialProof.join(' • ')}
                                </div>
                            ` : ''}
                            ${quickActions.length > 0 ? `
                                <div class="quick-actions">
                                    ${quickActions.map(action => `
                                        <a href="${action.action}" class="quick-action-btn" onclick="event.stopPropagation()" target="_blank" rel="noopener">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                ${action.icon === 'phone' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>' : ''}
                                                ${action.icon === 'map' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>' : ''}
                                                ${action.icon === 'calendar' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>' : ''}
                                            </svg>
                                            ${action.label}
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${lastUpdated ? `<p class="last-updated">Updated ${lastUpdated}</p>` : ''}
                            <div class="flex items-center gap-2 mt-4">
                                <a href="restaurant-detail.html?id=${restaurantId}" 
                                   class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[var(--accent-blue)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow-sm hover:shadow-md"
                                   onclick="event.stopPropagation()">
                                    View Details
                                    <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                                <button onclick="event.stopPropagation(); if(typeof shareRestaurant === 'function') shareRestaurant('${restaurantId}'); if(typeof hapticFeedback === 'function') hapticFeedback('light')" 
                                        class="share-btn" 
                                        aria-label="Share ${restaurantName}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        </div>
                    `;
                } catch (error) {
                    console.error('Error rendering restaurant card:', error, restaurant);
                    return `<div class="restaurant-card bg-white border border-gray-200 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">${restaurant.name || 'Restaurant'}</h3>
                        <p class="text-sm text-gray-600">Error loading restaurant details</p>
                    </div>`;
                }
            }).join('');
            
                // Load favorite states
                if (typeof loadFavoriteStates === 'function') {
                    try {
                        loadFavoriteStates();
                    } catch (e) {
                        console.warn('Error loading favorite states:', e);
                    }
                }
                
                
                // Update "More" button visibility (fallback)
                if (!infiniteScrollEnabled && typeof updateMoreButtonVisibility === 'function') {
                    try {
                        updateMoreButtonVisibility();
                    } catch (e) {
                        console.warn('Error updating more button:', e);
                    }
                }
                
                // Feature 51: Track render
                if (typeof trackEvent === 'function') {
                    try {
                        trackEvent('Restaurant', 'Render', `${restaurantsToShow.length} restaurants`);
                    } catch (e) {
                        console.warn('Error tracking event:', e);
                    }
                }
            } catch (error) {
                console.error('Error in renderRestaurants:', error);
                // Show error message
                const grid = document.getElementById('restaurantsGrid');
                if (grid) {
                    grid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-red-600">Error loading restaurants. Please refresh the page.</p></div>';
                    grid.classList.remove('hidden');
                }
            }
        }
        
        // Filter and sort restaurants
        function filterAndSortRestaurants() {
            try {
                const searchInput = document.getElementById('searchInput');
                const resortFilterEl = document.getElementById('resortFilter');
                const cuisineFilterEl = document.getElementById('cuisineFilter');
                const sortSelectEl = document.getElementById('sortSelect');
                
                const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
                const resortFilter = resortFilterEl ? resortFilterEl.value : '';
                const cuisineFilter = cuisineFilterEl ? cuisineFilterEl.value : '';
                const sortOption = sortSelectEl ? sortSelectEl.value : 'distance';
                
                // Check for category parameter in URL (e.g., for cafes)
                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');
                
                // Reset sorted restaurants to recalculate distances
                sortedRestaurants = [];
                displayedRestaurantCount = 0;
                
                // Get sorted restaurants (by distance or popularity)
                const sorted = getSortedRestaurants();
            
            filteredRestaurants = sorted.filter(restaurant => {
                // Search filter - enhanced to include location fields
                let matchesSearch = true;
                if (searchTerm) {
                    const nameMatch = restaurant.name && restaurant.name.toLowerCase().includes(searchTerm);
                    const descMatch = restaurant.description && restaurant.description.toLowerCase().includes(searchTerm);
                    const cuisineMatch = restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(searchTerm);
                    const locationMatch = restaurant.location && restaurant.location.toLowerCase().includes(searchTerm);
                    
                    // Also check resort name and location (check all resorts)
                    let resortMatch = false;
                    const restaurantResorts = getRestaurantResorts(restaurant);
                    if (restaurantResorts.length > 0) {
                        resortMatch = restaurantResorts.some(r => {
                            const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                            if (resort) {
                                return resort.name.toLowerCase().includes(searchTerm) ||
                                       (resort.location && resort.location.toLowerCase().includes(searchTerm));
                            }
                            return r.id.toLowerCase().includes(searchTerm);
                        });
                    }
                    
                    // Check location parts (state, city, etc.)
                    const parsedLocation = parseLocation(restaurant.location || '');
                    const locationPartsMatch = parsedLocation.parts.some(part => 
                        part.toLowerCase().includes(searchTerm)
                    );
                    
                    matchesSearch = nameMatch || descMatch || cuisineMatch || locationMatch || resortMatch || locationPartsMatch;
                }
                
                // Resort filter - check if restaurant belongs to the selected resort
                let matchesResort = true;
                if (resortFilter) {
                    const restaurantResorts = getRestaurantResorts(restaurant);
                    // Check if any of the restaurant's resorts match the filter
                    matchesResort = restaurantResorts.some(r => {
                        const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                        return resort && resort.name === resortFilter;
                    });
                }
                
                // Category filter (for cafes, etc.)
                let matchesCategory = true;
                if (categoryParam) {
                    const categories = normalizeCategory(restaurant.category || restaurant.type, '');
                    matchesCategory = categories.includes(categoryParam.toLowerCase());
                }
                
                // Cuisine filter - check if cuisine matches (handles comma-separated values)
                let matchesCuisine = true;
                if (cuisineFilter) {
                    const restaurantCuisine = (restaurant.cuisine || restaurant.type || '').toLowerCase();
                    if (restaurantCuisine) {
                        // Split comma-separated cuisine values and check if any match
                        const cuisineList = restaurantCuisine.split(',').map(c => c.trim());
                        matchesCuisine = cuisineList.includes(cuisineFilter.toLowerCase());
                    } else {
                        matchesCuisine = false;
                    }
                }
                
                return matchesSearch && matchesResort && matchesCategory && matchesCuisine;
            });
            
                // Feature 7: Apply advanced filters
                if (typeof applyAdvancedFilters === 'function') {
                    try {
                        filteredRestaurants = applyAdvancedFilters(filteredRestaurants);
                    } catch (e) {
                        console.warn('Error applying advanced filters:', e);
                    }
                }
                
                // Feature 3: Update filter chips
                if (typeof updateFilterChips === 'function') {
                    try {
                        updateFilterChips();
                    } catch (e) {
                        console.warn('Error updating filter chips:', e);
                    }
                }
                
                // Feature 9: Show comparison mode button if there are results
                const comparisonBtn = document.getElementById('comparisonModeBtn');
                if (comparisonBtn) {
                    comparisonBtn.classList.toggle('hidden', filteredRestaurants.length === 0);
                }
            
            // Apply additional sorting if not already sorted by distance
            if (sortOption !== 'distance') {
                filteredRestaurants.sort((a, b) => {
                    switch(sortOption) {
                        case 'name':
                            return (a.name || '').localeCompare(b.name || '');
                        case 'rating':
                            return (b.rating || 0) - (a.rating || 0);
                        case 'resort':
                            const resortA = skiEatsData.resorts?.find(r => r.id === a.resort);
                            const resortB = skiEatsData.resorts?.find(r => r.id === b.resort);
                            return (resortA?.name || '').localeCompare(resortB?.name || '');
                        default:
                            // For distance sorting, maintain the order from getSortedRestaurants
                            if (a.distance !== null && b.distance !== null) {
                                return a.distance - b.distance;
                            }
                            if (a.distance === null && b.distance !== null) return 1;
                            if (a.distance !== null && b.distance === null) return -1;
                            return 0;
                    }
                });
            }
            
                renderRestaurants();
                
                // Feature 29: Save filters
                if (typeof saveFiltersToStorage === 'function') {
                    try {
                        saveFiltersToStorage();
                    } catch (e) {
                        console.warn('Error saving filters:', e);
                    }
                }
            } catch (error) {
                console.error('Error in filterAndSortRestaurants:', error);
                // Fallback: show all restaurants
                filteredRestaurants = allRestaurants;
                renderRestaurants();
            }
        }
        
        // Update "More" button visibility (kept for fallback if infinite scroll disabled)
        function updateMoreButtonVisibility() {
            const moreButton = document.getElementById('loadMoreBtn');
            if (!moreButton) return;
            
            if (displayedRestaurantCount >= filteredRestaurants.length) {
                moreButton.classList.add('hidden');
            } else {
                moreButton.classList.remove('hidden');
            }
        }
        
        // Load more restaurants
        function loadMoreRestaurants() {
            const previousCount = displayedRestaurantCount;
            displayedRestaurantCount = Math.min(displayedRestaurantCount + LOAD_MORE_COUNT, filteredRestaurants.length);
            renderRestaurants();
            
            // Scroll to the first newly loaded card
            setTimeout(() => {
                const grid = document.getElementById('restaurantsGrid');
                if (grid && grid.children.length > previousCount) {
                    const firstNewCard = grid.children[previousCount];
                    if (firstNewCard) {
                        firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            }, 100);
        }
        
        // Favorites Functionality
        function toggleFavorite(button) {
            try {
                const id = button.dataset.id;
                const name = button.dataset.name;
                const location = button.dataset.location;
                const rating = button.dataset.rating;
                const category = button.dataset.category;
                
                let favorites = JSON.parse(localStorage.getItem('skieats_favorites') || '[]');
                const index = favorites.findIndex(f => f.id === id);
                const icon = button.querySelector('svg');
                
                if (index > -1) {
                    favorites.splice(index, 1);
                    icon.classList.remove('fill-red-500', 'text-red-500');
                    icon.classList.add('fill-none', 'stroke-current');
                } else {
                    favorites.push({ id, name, location, rating, category });
                    icon.classList.remove('fill-none', 'stroke-current');
                    icon.classList.add('fill-red-500', 'text-red-500');
                }
                
                localStorage.setItem('skieats_favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        }
        
        // Load favorite states
        function loadFavoriteStates() {
            try {
                const favorites = JSON.parse(localStorage.getItem('skieats_favorites') || '[]');
                const favoriteIds = new Set(favorites.map(f => f.id));
                
                document.querySelectorAll('.favorite-btn').forEach(button => {
                    const id = button.dataset.id;
                    const icon = button.querySelector('svg');
                    
                    if (favoriteIds.has(id)) {
                        icon.classList.remove('fill-none', 'stroke-current');
                        icon.classList.add('fill-red-500', 'text-red-500');
                    } else {
                        icon.classList.remove('fill-red-500', 'text-red-500');
                        icon.classList.add('fill-none', 'stroke-current');
                    }
                });
            } catch (error) {
                console.error('Error loading favorite states:', error);
            }
        }
        
        // Clear all filters
        function clearFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('resortFilter').value = '';
            document.getElementById('cuisineFilter').value = '';
            document.getElementById('sortSelect').value = 'name';
            advancedFilters = {
                priceMin: 1,
                priceMax: 4,
                ratingMin: 0,
                distanceMax: 100,
                dietary: [],
                mealType: []
            };
            filterAndSortRestaurants();
            saveFiltersToStorage();
        }
        
        // Feature 1: Grid/List View Toggle
        function setViewMode(mode) {
            currentView = mode;
            const grid = document.getElementById('restaurantsGrid');
            const gridBtn = document.getElementById('gridViewBtn');
            const listBtn = document.getElementById('listViewBtn');
            
            if (mode === 'list') {
                grid.classList.add('list-view');
                gridBtn.classList.remove('active');
                listBtn.classList.add('active');
            } else {
                grid.classList.remove('list-view');
                gridBtn.classList.add('active');
                listBtn.classList.remove('active');
            }
            saveFiltersToStorage();
        }
        
        // Feature 3: Update Filter Chips
        function updateFilterChips() {
            const container = document.getElementById('activeFilters');
            const searchTerm = document.getElementById('searchInput').value.trim();
            const resortFilter = document.getElementById('resortFilter').value;
            const cuisineFilter = document.getElementById('cuisineFilter').value;
            
            container.innerHTML = '<span class="text-sm text-gray-600">Active filters:</span>';
            let hasFilters = false;
            
            if (searchTerm) {
                hasFilters = true;
                const chip = document.createElement('span');
                chip.className = 'filter-chip active';
                chip.innerHTML = `Search: "${searchTerm}" <button onclick="removeFilterChip('search')" class="ml-1">×</button>`;
                container.appendChild(chip);
            }
            if (resortFilter) {
                hasFilters = true;
                const chip = document.createElement('span');
                chip.className = 'filter-chip active';
                chip.innerHTML = `Resort: ${resortFilter} <button onclick="removeFilterChip('resort')" class="ml-1">×</button>`;
                container.appendChild(chip);
            }
            if (cuisineFilter) {
                hasFilters = true;
                const chip = document.createElement('span');
                chip.className = 'filter-chip active';
                chip.innerHTML = `Cuisine: ${cuisineFilter} <button onclick="removeFilterChip('cuisine')" class="ml-1">×</button>`;
                container.appendChild(chip);
            }
            
            container.classList.toggle('hidden', !hasFilters);
        }
        
        function removeFilterChip(type) {
            if (type === 'search') document.getElementById('searchInput').value = '';
            if (type === 'resort') document.getElementById('resortFilter').value = '';
            if (type === 'cuisine') document.getElementById('cuisineFilter').value = '';
            filterAndSortRestaurants();
        }
        
        // Feature 7: Advanced Filters
        function applyAdvancedFilters(restaurants) {
            return restaurants.filter(restaurant => {
                // Price range
                const price = restaurant.priceRange || restaurant.price || '';
                const priceLevel = price.length; // $ = 1, $$ = 2, etc.
                if (priceLevel > 0 && (priceLevel < advancedFilters.priceMin || priceLevel > advancedFilters.priceMax)) {
                    return false;
                }
                
                // Rating
                if (restaurant.rating && restaurant.rating < advancedFilters.ratingMin) {
                    return false;
                }
                
                // Distance
                if (restaurant.distance !== null && restaurant.distance > advancedFilters.distanceMax) {
                    return false;
                }
                
                // Dietary and meal type filters would require additional data fields
                // This is a placeholder for when that data is available
                
                return true;
            });
        }
        
        // Feature 8: Quick Filter Presets
        function applyQuickFilter(preset) {
            clearFilters();
            switch(preset) {
                case 'featured':
                    // Filter by featured restaurants
                    break;
                case 'high-rated':
                    document.getElementById('sortSelect').value = 'rating';
                    advancedFilters.ratingMin = 4.0;
                    break;
                case 'nearby':
                    document.getElementById('sortSelect').value = 'distance';
                    advancedFilters.distanceMax = 25;
                    break;
                case 'budget':
                    advancedFilters.priceMin = 1;
                    advancedFilters.priceMax = 2;
                    break;
                case 'fine-dining':
                    advancedFilters.priceMin = 3;
                    advancedFilters.priceMax = 4;
                    break;
            }
            filterAndSortRestaurants();
        }
        
        // Feature 9: Comparison Mode
        function toggleComparisonMode() {
            comparisonMode = !comparisonMode;
            document.body.classList.toggle('comparison-mode', comparisonMode);
            const btn = document.getElementById('comparisonModeBtn');
            if (btn) {
                btn.textContent = comparisonMode ? 'Exit Comparison' : 'Compare Restaurants';
            }
            updateComparisonBar();
        }
        
        function toggleComparisonSelection(restaurantId) {
            if (selectedForComparison.has(restaurantId)) {
                selectedForComparison.delete(restaurantId);
            } else {
                if (selectedForComparison.size < 3) {
                    selectedForComparison.add(restaurantId);
                }
            }
            updateComparisonBar();
            renderRestaurants();
        }
        
        function updateComparisonBar() {
            const bar = document.getElementById('comparisonBar');
            const count = document.getElementById('comparisonCount');
            const compareBtn = document.getElementById('compareBtn');
            
            if (count) count.textContent = selectedForComparison.size;
            if (compareBtn) compareBtn.disabled = selectedForComparison.size < 2;
            if (bar) bar.classList.toggle('active', selectedForComparison.size > 0);
        }
        
        // Feature 10: Save Search
        function saveSearch() {
            const searchParams = {
                search: document.getElementById('searchInput').value,
                resort: document.getElementById('resortFilter').value,
                cuisine: document.getElementById('cuisineFilter').value,
                sort: document.getElementById('sortSelect').value,
                timestamp: Date.now()
            };
            const savedSearches = JSON.parse(localStorage.getItem('snogrub_saved_searches') || '[]');
            savedSearches.unshift(searchParams);
            localStorage.setItem('snogrub_saved_searches', JSON.stringify(savedSearches.slice(0, 10)));
        }
        
        // Feature 11: Share Results
        function shareResults() {
            const params = new URLSearchParams();
            if (document.getElementById('searchInput').value) params.set('q', document.getElementById('searchInput').value);
            if (document.getElementById('resortFilter').value) params.set('resort', document.getElementById('resortFilter').value);
            if (document.getElementById('cuisineFilter').value) params.set('cuisine', document.getElementById('cuisineFilter').value);
            
            const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Restaurant Search Results',
                    text: `Check out these restaurants: ${filteredRestaurants.length} found`,
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            }
        }
        
        // Feature 13: Infinite Scroll
        function setupInfiniteScroll() {
            let isLoading = false;
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoading && displayedRestaurantCount < filteredRestaurants.length) {
                    isLoading = true;
                    const loader = document.getElementById('infiniteLoader');
                    if (loader) loader.classList.add('active');
                    
                    setTimeout(() => {
                        displayedRestaurantCount = Math.min(displayedRestaurantCount + LOAD_MORE_COUNT, filteredRestaurants.length);
                        renderRestaurants();
                        isLoading = false;
                        if (loader) loader.classList.remove('active');
                    }, 500);
                }
            }, { threshold: 0.1 });
            
            const sentinel = document.createElement('div');
            sentinel.id = 'scrollSentinel';
            sentinel.style.height = '1px';
            document.getElementById('restaurantsGrid').parentElement.appendChild(sentinel);
            observer.observe(sentinel);
        }
        
        // Feature 14: Quick Preview
        function showQuickPreview(restaurantId) {
            const restaurant = allRestaurants.find(r => r.id === restaurantId);
            if (!restaurant) return;
            
            const modal = document.getElementById('previewModal');
            const content = document.getElementById('previewContent');
            
            // Format resort display (single line or multiple lines)
            const restaurantResorts = getRestaurantResorts(restaurant);
            let resortDisplay = '';
            if (restaurantResorts.length === 0) {
                resortDisplay = `<p class="text-gray-600 mb-4">${restaurant.location || 'Location TBD'}</p>`;
            } else if (restaurantResorts.length === 1) {
                // Single resort: show on one line with distance
                const r = restaurantResorts[0];
                const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                const name = resort ? resort.name : r.id;
                const distanceText = r.distance !== null && r.distance !== undefined ? ` (${r.distance.toFixed(1)} mi)` : '';
                resortDisplay = `<p class="text-gray-600 mb-4">${name}${distanceText}</p>`;
            } else {
                // Multiple resorts: show each on separate line with distance
                const resortLines = restaurantResorts.map(r => {
                    const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                    const name = resort ? resort.name : r.id;
                    const distanceText = r.distance !== null && r.distance !== undefined ? ` (${r.distance.toFixed(1)} mi)` : '';
                    return `<div class="text-gray-600">${name}${distanceText}</div>`;
                }).join('');
                resortDisplay = `<div class="mb-4 space-y-1">${resortLines}</div>`;
            }
            
            content.innerHTML = `
                <h2 id="previewModalTitle" class="text-2xl font-semibold mb-4">${restaurant.name}</h2>
                ${resortDisplay}
                ${restaurant.description ? `<p class="text-gray-700 mb-4">${restaurant.description}</p>` : ''}
                ${restaurant.rating ? `<p class="text-yellow-600 mb-4">★ ${restaurant.rating.toFixed(1)}</p>` : ''}
                <a href="restaurant-detail.html?id=${restaurant.id}" class="inline-block px-6 py-3 bg-[var(--accent-blue)] text-white rounded-full font-medium hover:opacity-90">
                    View Full Details
                </a>
            `;
            
            modal.classList.add('active');
        }
        
        // Feature 15: Smart Search Suggestions (already implemented in autocomplete)
        
            // Feature 16: Trending Searches
            function loadTrendingSearches() {
                // Simulate trending searches based on recent activity
                const trending = ['Italian', 'Pizza', 'Fine Dining', 'Vail', 'Aspen', 'Sushi'];
                const container = document.querySelector('.trending-searches');
                if (container) {
                    container.innerHTML = trending.map(term => {
                        const escapedTerm = term.replace(/'/g, "\\'");
                        return `<span class="trending-tag" onclick="const input = document.getElementById('searchInput'); if(input) { input.value = '${escapedTerm}'; filterAndSortRestaurants(); }">${term}</span>`;
                    }).join('');
                    const trendingSection = document.getElementById('trendingSearches');
                    if (trendingSection) trendingSection.classList.remove('hidden');
                }
            }
        
        // Feature 17: Enhanced Search History with Timestamps
        function getRecentSearchesWithTimestamps() {
            const recent = localStorage.getItem('snogrub_recent_searches');
            if (!recent) return [];
            
            try {
                return JSON.parse(recent).map((search, index) => ({
                    query: typeof search === 'string' ? search : search.query,
                    timestamp: typeof search === 'object' ? search.timestamp : Date.now() - (index * 60000)
                }));
            } catch {
                return JSON.parse(recent).map(s => ({ query: s, timestamp: Date.now() }));
            }
        }
        
        // Feature 18: Voice Search
        function startVoiceSearch() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                alert('Voice search is not supported in your browser');
                return;
            }
            
            const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new Recognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            const btn = document.getElementById('voiceSearchBtn');
            btn.classList.add('recording');
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('searchInput').value = transcript;
                filterAndSortRestaurants();
                btn.classList.remove('recording');
            };
            
            recognition.onerror = () => {
                btn.classList.remove('recording');
            };
            
            recognition.onend = () => {
                btn.classList.remove('recording');
            };
            
            recognition.start();
        }
        
        // Feature 19: Image Search (placeholder - would require image recognition API)
        
        // Feature 20: Filter Suggestions (enhanced autocomplete already handles this)
        
        // Feature 21: Recently Viewed
        function loadRecentlyViewed() {
            const viewed = JSON.parse(localStorage.getItem('snogrub_recently_viewed') || '[]');
            if (viewed.length === 0) return;
            
            const grid = document.getElementById('recentlyViewedGrid');
            const section = document.getElementById('recentlyViewed');
            
            grid.innerHTML = viewed.slice(0, 4).map(id => {
                const restaurant = allRestaurants.find(r => r.id === id);
                if (!restaurant) return '';
                return renderRestaurantCard(restaurant, true);
            }).join('');
            
            section.classList.remove('hidden');
        }
        
        function addToRecentlyViewed(restaurantId) {
            let viewed = JSON.parse(localStorage.getItem('snogrub_recently_viewed') || '[]');
            viewed = viewed.filter(id => id !== restaurantId);
            viewed.unshift(restaurantId);
            localStorage.setItem('snogrub_recently_viewed', JSON.stringify(viewed.slice(0, 10)));
        }
        
        // Feature 22: Personalized Recommendations
        function loadRecommendations() {
            // Simple recommendation based on favorites and recently viewed
            const favorites = JSON.parse(localStorage.getItem('skieats_favorites') || '[]');
            const viewed = JSON.parse(localStorage.getItem('snogrub_recently_viewed') || '[]');
            
            if (favorites.length === 0 && viewed.length === 0) return;
            
            // Get restaurants similar to favorites/viewed (by cuisine, resort, etc.)
            const recommended = allRestaurants
                .filter(r => !viewed.includes(r.id))
                .slice(0, 6);
            
            if (recommended.length === 0) return;
            
            const grid = document.getElementById('recommendationsGrid');
            const section = document.getElementById('recommendations');
            
            grid.innerHTML = recommended.map(r => renderRestaurantCard(r, false)).join('');
            section.classList.remove('hidden');
        }
        
        // Feature 23: Custom Collections (placeholder - would require collection management UI)
        
        // Feature 24: Review Snippets
        function getReviewSnippet(restaurant) {
            if (restaurant.platformReviews) {
                const reviews = Object.values(restaurant.platformReviews);
                if (reviews.length > 0 && reviews[0].snippet) {
                    return reviews[0].snippet;
                }
            }
            return null;
        }
        
        // Feature 25: Social Proof
        function getSocialProof(restaurant) {
            const proof = [];
            if (restaurant.reviewCount && restaurant.reviewCount > 100) {
                proof.push(`${restaurant.reviewCount}+ reviews`);
            }
            if (restaurant.featured) {
                proof.push('Featured');
            }
            return proof;
        }
        
        // Feature 26: Quick Actions
        function getQuickActions(restaurant) {
            const actions = [];
            if (restaurant.phone) {
                actions.push({
                    label: 'Call',
                    icon: 'phone',
                    action: `tel:${restaurant.phone}`
                });
            }
            if (restaurant.coordinates) {
                actions.push({
                    label: 'Directions',
                    icon: 'map',
                    action: `https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`
                });
            }
            if (restaurant.website) {
                actions.push({
                    label: 'Reserve',
                    icon: 'calendar',
                    action: restaurant.website
                });
            }
            return actions;
        }
        
        // Feature 27: Virtual Scrolling (for very large lists - placeholder)
        
        // Feature 28: Progressive Image Loading
        function loadImageProgressive(img, src) {
            const lowRes = src.replace(/(\.(jpg|png))$/i, '_thumb$1');
            img.src = lowRes;
            const highRes = new Image();
            highRes.onload = () => {
                img.src = src;
                img.classList.add('loaded');
            };
            highRes.src = src;
        }
        
        // Feature 30: Keyboard Shortcuts
        function setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + K: Focus search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                }
                // Escape: Close modals
                if (e.key === 'Escape') {
                    document.getElementById('previewModal')?.classList.remove('active');
                    document.getElementById('mobileFilterSheet')?.classList.remove('active');
                }
                // G: Toggle grid view
                if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
                    setViewMode('grid');
                }
                // L: Toggle list view
                if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
                    setViewMode('list');
                }
            });
        }
        
        // Feature 32: Results Grouping
        function groupResults(groupBy) {
            // Placeholder for grouping functionality
        }
        
        // Feature 33: Swipe Actions (Mobile)
        function setupSwipeActions() {
            let touchStartX = 0;
            let touchEndX = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            document.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const card = document.elementFromPoint(touchEndX, window.innerHeight / 2);
                if (card && card.closest('.swipeable-card')) {
                    const swipeableCard = card.closest('.swipeable-card');
                    if (touchEndX < touchStartX - 50) {
                        swipeableCard.classList.add('swiped');
                    } else if (touchEndX > touchStartX + 50) {
                        swipeableCard.classList.remove('swiped');
                    }
                }
            }
        }
        
        // Feature 36: Pull to Refresh
        function setupPullToRefresh() {
            let startY = 0;
            let currentY = 0;
            let pulling = false;
            
            document.addEventListener('touchstart', (e) => {
                if (window.scrollY === 0) {
                    startY = e.touches[0].clientY;
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (window.scrollY === 0 && startY > 0) {
                    currentY = e.touches[0].clientY;
                    const pullDistance = currentY - startY;
                    
                    if (pullDistance > 50 && !pulling) {
                        pulling = true;
                        document.getElementById('pullToRefresh').classList.add('active');
                    }
                }
            });
            
            document.addEventListener('touchend', () => {
                if (pulling && currentY - startY > 100) {
                    location.reload();
                }
                pulling = false;
                startY = 0;
                currentY = 0;
                document.getElementById('pullToRefresh').classList.remove('active');
            });
        }
        
        // Feature 37: Haptic Feedback
        function hapticFeedback(type = 'light') {
            if ('vibrate' in navigator) {
                const patterns = {
                    light: 10,
                    medium: 20,
                    heavy: 30
                };
                navigator.vibrate(patterns[type] || 10);
            }
        }
        
        // Feature 43: Real-time Availability
        function getAvailabilityStatus(restaurant) {
            if (!restaurant.hours) return null;
            const now = new Date();
            const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
            const hours = restaurant.hours[day];
            if (!hours || hours === 'Closed') return { status: 'closed', label: 'Closed' };
            
            // Simple parsing (would need more robust parsing in production)
            return { status: 'open', label: 'Open Now' };
        }
        
        // Feature 44: Wait Time Estimates
        function getWaitTime(restaurant) {
            // Placeholder - would require real-time data
            return null;
        }
        
        // Feature 45: Menu Preview
        function getMenuPreview(restaurant) {
            // Placeholder - would require menu data
            return null;
        }
        
        // Feature 46: Photo Count
        function getPhotoCount(restaurant) {
            // Placeholder - would require photo data
            return null;
        }
        
        // Feature 47: Last Updated
        function getLastUpdated(restaurant) {
            // Placeholder - would require update timestamp
            return null;
        }
        
        // Feature 48: Share Restaurant
        function shareRestaurant(restaurantId) {
            const url = `${window.location.origin}/restaurant-detail.html?id=${restaurantId}`;
            if (navigator.share) {
                navigator.share({ url });
            } else {
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            }
        }
        
        // Feature 49: Export List
        function exportList(format) {
            const data = filteredRestaurants.map(r => ({
                name: r.name,
                location: r.location,
                rating: r.rating,
                cuisine: r.cuisine,
                priceRange: r.priceRange
            }));
            
            if (format === 'csv') {
                const csv = 'Name,Location,Rating,Cuisine,Price\n' +
                    data.map(r => `"${r.name}","${r.location}",${r.rating},"${r.cuisine}","${r.priceRange}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'restaurants.csv';
                a.click();
            } else if (format === 'pdf') {
                // Would require PDF library
                alert('PDF export requires additional library');
            }
        }
        
        // Feature 51: Analytics Tracking
        function trackEvent(category, action, label) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label
                });
            }
            // Also track in localStorage for basic analytics
            const events = JSON.parse(localStorage.getItem('snogrub_analytics') || '[]');
            events.push({ category, action, label, timestamp: Date.now() });
            localStorage.setItem('snogrub_analytics', JSON.stringify(events.slice(-100)));
        }
        
        // Feature 52: A/B Testing Infrastructure
        function getABTestVariant(testName) {
            const stored = localStorage.getItem(`ab_test_${testName}`);
            if (stored) return stored;
            
            const variant = Math.random() < 0.5 ? 'A' : 'B';
            localStorage.setItem(`ab_test_${testName}`, variant);
            return variant;
        }
        
        // Enhanced renderRestaurantCard function
        function renderRestaurantCard(restaurant, compact = false) {
            // This will be called from renderRestaurants with enhanced features
            // Implementation continues in the main renderRestaurants function
            return '';
        }
        
        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Wait for data.js to load
            function waitForData(retries = 10) {
                if (typeof skiEatsData !== 'undefined' && skiEatsData && skiEatsData.restaurants) {
                    console.log('Data loaded, initializing restaurants...');
                    loadRestaurants();
                } else if (retries > 0) {
                    console.log('Waiting for data.js to load...', retries);
                    setTimeout(() => waitForData(retries - 1), 100);
                } else {
                    console.error('data.js failed to load after multiple attempts');
                    const loadingState = document.getElementById('loadingState');
                    const emptyState = document.getElementById('emptyState');
                    if (loadingState) loadingState.classList.add('hidden');
                    if (emptyState) {
                        emptyState.classList.remove('hidden');
                        const errorMsg = emptyState.querySelector('h3');
                        if (errorMsg) errorMsg.textContent = 'Error loading restaurant data';
                        const errorDesc = emptyState.querySelector('p');
                        if (errorDesc) errorDesc.textContent = 'Please check that data.js is loaded correctly and refresh the page.';
                    }
                }
            }
            
            waitForData();
            
            // Enhanced Search with Autocomplete
            const searchInput = document.getElementById('searchInput');
            const autocompleteDropdown = document.getElementById('autocompleteDropdown');
            const suggestionsList = document.getElementById('suggestionsList');
            const recentSearchesSection = document.getElementById('recentSearchesSection');
            const recentSearchesList = document.getElementById('recentSearchesList');
            const noResults = document.getElementById('noResults');
            const clearSearchBtn = document.getElementById('clearSearchBtn');
            const clearRecentBtn = document.getElementById('clearRecentBtn');
            const searchIcon = document.getElementById('searchIcon');
            const searchContainer = document.getElementById('searchContainer');
            let selectedIndex = -1;
            let currentSuggestions = [];
            let searchTimeout;
            
            // Get recent searches from localStorage
            function getRecentSearches() {
                const recent = localStorage.getItem('snogrub_recent_searches');
                return recent ? JSON.parse(recent) : [];
            }
            
            // Save search to recent searches
            function saveRecentSearch(query) {
                if (!query || query.trim().length === 0) return;
                const recent = getRecentSearches();
                const trimmedQuery = query.trim();
                const filtered = recent.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase());
                filtered.unshift(trimmedQuery);
                const limited = filtered.slice(0, 5);
                localStorage.setItem('snogrub_recent_searches', JSON.stringify(limited));
            }
            
            // Render recent searches
            function renderRecentSearches() {
                const recent = getRecentSearches();
                if (recent.length === 0) {
                    recentSearchesSection.classList.add('hidden');
                    return;
                }
                
                recentSearchesSection.classList.remove('hidden');
                recentSearchesList.innerHTML = recent.map(search => `
                    <div class="recent-search-item" data-query="${search}">
                        <div class="recent-search-item-icon">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="flex-1">
                            <div class="text-sm font-medium text-gray-900">${escapeHtml(search)}</div>
                        </div>
                    </div>
                `).join('');
                
                recentSearchesList.querySelectorAll('.recent-search-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const query = item.getAttribute('data-query');
                        searchInput.value = query;
                        searchInput.focus();
                        performSearch(query);
                    });
                });
            }
            
            // Escape HTML to prevent XSS
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
            
            // Highlight matching text
            function highlightText(text, query) {
                if (!query) return escapeHtml(text);
                const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
                return escapeHtml(text).replace(regex, '<span class="autocomplete-item-highlight">$1</span>');
            }
            
            // Escape regex special characters
            function escapeRegex(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            
            // Parse location string
            // Get search suggestions from data
            function getSuggestions(query) {
                if (!query || query.trim().length < 2) return [];
                
                const lowerQuery = query.toLowerCase().trim();
                const suggestions = [];
                const seenLocations = new Set();
                const seenResorts = new Set();
                const seenRestaurants = new Set();
                
                if (typeof skiEatsData !== 'undefined') {
                    // Search restaurants
                    if (skiEatsData.restaurants) {
                        // Normalize restaurants first
                        const normalizedRestaurants = normalizeRestaurantResorts(
                            skiEatsData.restaurants,
                            skiEatsData.resorts || []
                        );
                        
                        normalizedRestaurants.forEach(restaurant => {
                            const nameMatch = restaurant.name.toLowerCase().includes(lowerQuery);
                            const restaurantLocation = restaurant.location?.toLowerCase() || '';
                            const restaurantResorts = getRestaurantResorts(restaurant);
                            const resortMatch = restaurantResorts.some(r => {
                                const resort = skiEatsData.resorts?.find(res => res.id === r.id);
                                return resort?.name.toLowerCase().includes(lowerQuery) || 
                                       r.id.toLowerCase().includes(lowerQuery);
                            });
                            const parsedLocation = parseLocation(restaurant.location || '');
                            const stateMatch = parsedLocation.state.toLowerCase().includes(lowerQuery);
                            const partsMatch = parsedLocation.parts.some(part => 
                                part.toLowerCase().includes(lowerQuery)
                            );
                            
                            if (nameMatch || restaurantLocation.includes(lowerQuery) || resortMatch || stateMatch || partsMatch) {
                                if (!seenRestaurants.has(restaurant.id)) {
                                    seenRestaurants.add(restaurant.id);
                                    const closestResort = getClosestResort(restaurant);
                                    const resort = closestResort ? skiEatsData.resorts?.find(r => r.id === closestResort.id) : null;
                                    const resortNames = getResortNamesForDisplay(restaurant, skiEatsData.resorts || []);
                                    suggestions.push({
                                        type: 'restaurant',
                                        title: restaurant.name,
                                        subtitle: `${resortNames || (resort?.name || '')} • ${restaurant.location || ''}`.trim(),
                                        query: restaurant.name,
                                        url: `restaurant-detail.html?id=${restaurant.id}`
                                    });
                                }
                            }
                        });
                    }
                    
                    // Search resorts
                    if (skiEatsData.resorts) {
                        skiEatsData.resorts.forEach(resort => {
                            const resortName = resort.name.toLowerCase();
                            const resortLocation = resort.location?.toLowerCase() || '';
                            const parsedLocation = parseLocation(resort.location || '');
                            const stateLower = parsedLocation.state.toLowerCase();
                            const countryLower = parsedLocation.country.toLowerCase();
                            const description = resort.description?.toLowerCase() || '';
                            
                            const nameMatch = resortName.includes(lowerQuery);
                            const locationMatch = resortLocation.includes(lowerQuery);
                            const stateMatch = stateLower.includes(lowerQuery);
                            const countryMatch = countryLower.includes(lowerQuery);
                            const partsMatch = parsedLocation.parts.some(part => 
                                part.toLowerCase().includes(lowerQuery)
                            );
                            const descriptionMatch = description.includes(lowerQuery);
                            
                            if (nameMatch || locationMatch || stateMatch || countryMatch || partsMatch || descriptionMatch) {
                                if (!seenResorts.has(resort.id)) {
                                    seenResorts.add(resort.id);
                                    suggestions.push({
                                        type: 'resort',
                                        title: resort.name,
                                        subtitle: resort.location || '',
                                        query: resort.name,
                                        url: `resort-detail.html?id=${resort.id}`
                                    });
                                }
                                
                                if ((stateMatch || partsMatch || locationMatch) && !seenLocations.has(resort.location)) {
                                    seenLocations.add(resort.location);
                                    suggestions.push({
                                        type: 'location',
                                        title: parsedLocation.state || resort.location,
                                        subtitle: `Restaurants in ${resort.location}`,
                                        query: parsedLocation.state || resort.location,
                                        url: `restaurants.html?q=${encodeURIComponent(parsedLocation.state || resort.location)}`
                                    });
                                }
                            }
                        });
                    }
                    
                    // Search for common cities
                    const commonCities = [
                        'Vail', 'Aspen', 'Breckenridge', 'Park City', 'Whistler', 'Vancouver', 
                        'Denver', 'Salt Lake City', 'Montreal', 'Quebec', 'Tahoe', 'Jackson Hole',
                        'Steamboat', 'Telluride', 'Sun Valley', 'Mammoth', 'Big Sky', 'Bend',
                        'Boulder', 'Bozeman', 'Burlington', 'Reno', 'Truckee', 'Frisco', 'Keystone',
                        'Colorado', 'Utah', 'California', 'Vermont', 'Wyoming', 'Montana', 'Idaho',
                        'Nevada', 'New Mexico', 'Maine', 'New Hampshire', 'British Columbia', 'Quebec'
                    ];
                    
                    commonCities.forEach(city => {
                        const cityLower = city.toLowerCase();
                        if (cityLower.includes(lowerQuery)) {
                            const matchingResorts = skiEatsData.resorts?.filter(resort => {
                                const desc = resort.description?.toLowerCase() || '';
                                const name = resort.name.toLowerCase();
                                const location = resort.location?.toLowerCase() || '';
                                const parsedLoc = parseLocation(resort.location || '');
                                const stateLower = parsedLoc.state.toLowerCase();
                                
                                return desc.includes(cityLower) || 
                                       name.includes(cityLower) || 
                                       location.includes(cityLower) ||
                                       stateLower.includes(cityLower);
                            }) || [];
                            
                            if (matchingResorts.length > 0 && !seenLocations.has(city)) {
                                seenLocations.add(city);
                                suggestions.push({
                                    type: 'location',
                                    title: city,
                                    subtitle: `${matchingResorts.length} resort${matchingResorts.length > 1 ? 's' : ''} in ${city}`,
                                    query: city,
                                    url: `restaurants.html?q=${encodeURIComponent(city)}`
                                });
                            }
                        }
                    });
                }
                
                // Sort suggestions
                suggestions.sort((a, b) => {
                    const aExact = a.title.toLowerCase() === lowerQuery || a.query.toLowerCase() === lowerQuery;
                    const bExact = b.title.toLowerCase() === lowerQuery || b.query.toLowerCase() === lowerQuery;
                    if (aExact && !bExact) return -1;
                    if (!aExact && bExact) return 1;
                    
                    const typeOrder = { location: 0, resort: 1, restaurant: 2 };
                    return (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3);
                });
                
                return suggestions.slice(0, 10);
            }
            
            // Render suggestions
            function renderSuggestions(suggestions) {
                if (suggestions.length === 0) {
                    suggestionsList.innerHTML = '';
                    noResults.classList.remove('hidden');
                    return;
                }
                
                noResults.classList.add('hidden');
                currentSuggestions = suggestions;
                
                suggestionsList.innerHTML = suggestions.map((suggestion, index) => {
                    const iconClass = suggestion.type === 'restaurant' ? 'restaurant' : 
                                     suggestion.type === 'resort' ? 'resort' : 'location';
                    const iconSvg = suggestion.type === 'restaurant' 
                        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>'
                        : suggestion.type === 'resort'
                        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>'
                        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>';
                    
                    return `
                        <div class="autocomplete-item" data-index="${index}" data-query="${escapeHtml(suggestion.query)}" data-url="${suggestion.url || ''}">
                            <div class="autocomplete-item-icon ${iconClass}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    ${iconSvg}
                                </svg>
                            </div>
                            <div class="autocomplete-item-content">
                                <div class="autocomplete-item-title">${highlightText(suggestion.title, searchInput.value)}</div>
                                <div class="autocomplete-item-subtitle">${highlightText(suggestion.subtitle, searchInput.value)}</div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                suggestionsList.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const query = item.getAttribute('data-query');
                        const url = item.getAttribute('data-url');
                        if (url) {
                            window.location.href = url;
                        } else {
                            searchInput.value = query;
                            performSearch(query);
                        }
                    });
                });
            }
            
            // Show/hide autocomplete
            function showAutocomplete() {
                if (autocompleteDropdown) {
                    autocompleteDropdown.classList.remove('hidden');
                }
            }
            
            function hideAutocomplete() {
                if (autocompleteDropdown) {
                    autocompleteDropdown.classList.add('hidden');
                }
                selectedIndex = -1;
            }
            
            // Update autocomplete
            function updateAutocomplete() {
                const query = searchInput.value.trim();
                
                if (clearSearchBtn) {
                    if (query.length > 0) {
                        clearSearchBtn.classList.remove('opacity-0', 'pointer-events-none');
                    } else {
                        clearSearchBtn.classList.add('opacity-0', 'pointer-events-none');
                    }
                }
                
                if (query.length === 0) {
                    renderRecentSearches();
                    if (getRecentSearches().length > 0) {
                        showAutocomplete();
                    } else {
                        hideAutocomplete();
                    }
                    return;
                }
                
                if (query.length < 2) {
                    hideAutocomplete();
                    return;
                }
                
                const suggestions = getSuggestions(query);
                renderSuggestions(suggestions);
                showAutocomplete();
            }
            
            // Perform search
            function performSearch(query) {
                saveRecentSearch(query);
                hideAutocomplete();
                if (query.trim()) {
                    // Update URL and trigger filter
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('q', query.trim());
                    window.history.pushState({}, '', `restaurants.html?${urlParams.toString()}`);
                    filterAndSortRestaurants();
                }
            }
            
            // Check for URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('q');
            const resortParam = urlParams.get('resort');
            const categoryParam = urlParams.get('category');
            const latParam = urlParams.get('lat');
            const lngParam = urlParams.get('lng');
            const nearbyParam = urlParams.get('nearby');
            
            // Handle location parameters from URL (e.g., from "Find Restaurants Near Me")
            if (latParam && lngParam && nearbyParam === 'true') {
                try {
                    const latitude = parseFloat(latParam);
                    const longitude = parseFloat(lngParam);
                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        // Store location in localStorage for distance calculations
                        localStorage.setItem('snogrub_user_location', JSON.stringify({
                            lat: latitude,
                            lng: longitude,
                            timestamp: Date.now()
                        }));
                        // Reset sorted restaurants to recalculate with new location
                        sortedRestaurants = [];
                        displayedRestaurantCount = 0;
                    }
                } catch (e) {
                    console.error('Error parsing location parameters:', e);
                }
            }
            
            if (searchQuery && searchInput) {
                searchInput.value = searchQuery;
            }
            
            // Autocomplete event handlers
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    updateAutocomplete();
                    // Also trigger existing filter function
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(filterAndSortRestaurants, 300);
                });
                
                searchInput.addEventListener('focus', () => {
                    searchIcon?.classList.add('focused');
                    const query = searchInput.value.trim();
                    if (query.length === 0) {
                        renderRecentSearches();
                        if (getRecentSearches().length > 0) {
                            showAutocomplete();
                        }
                    } else if (query.length >= 2) {
                        updateAutocomplete();
                    }
                });
                
                searchInput.addEventListener('blur', () => {
                    searchIcon?.classList.remove('focused');
                    setTimeout(() => {
                        hideAutocomplete();
                    }, 200);
                });
                
                searchInput.addEventListener('keydown', (e) => {
                    if (!autocompleteDropdown || autocompleteDropdown.classList.contains('hidden')) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            performSearch(searchInput.value);
                        }
                        return;
                    }
                    
                    const items = suggestionsList.querySelectorAll('.autocomplete-item');
                    
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                        items.forEach((item, idx) => {
                            item.classList.toggle('selected', idx === selectedIndex);
                        });
                        if (items[selectedIndex]) {
                            items[selectedIndex].scrollIntoView({ block: 'nearest' });
                        }
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        selectedIndex = Math.max(selectedIndex - 1, -1);
                        items.forEach((item, idx) => {
                            item.classList.toggle('selected', idx === selectedIndex);
                        });
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        if (selectedIndex >= 0 && items[selectedIndex]) {
                            items[selectedIndex].click();
                        } else {
                            performSearch(searchInput.value);
                        }
                    } else if (e.key === 'Escape') {
                        hideAutocomplete();
                        searchInput.blur();
                    }
                });
            }
            
            // Clear search button
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    searchInput.value = '';
                    searchInput.focus();
                    updateAutocomplete();
                    filterAndSortRestaurants();
                });
            }
            
            // Clear recent searches
            if (clearRecentBtn) {
                clearRecentBtn.addEventListener('click', () => {
                    localStorage.removeItem('snogrub_recent_searches');
                    renderRecentSearches();
                });
            }
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (searchContainer && !searchContainer.contains(e.target)) {
                    hideAutocomplete();
                }
            });
            
            // Set resort filter from URL parameter
            if (resortParam) {
                const resortFilter = document.getElementById('resortFilter');
                if (resortFilter) {
                    // Wait for filter to be populated, then set the value
                    // Check if options are available, if not wait a bit more
                    function setResortFilter() {
                        const options = resortFilter.querySelectorAll('option');
                        if (options.length > 1) {
                            // Options are populated, set the value
                            resortFilter.value = resortParam;
                            
                            // Update page title to show resort name
                            updateResortTitle(resortParam, categoryParam);
                            
                            // If category parameter is set (e.g., for cafes), filter by category too
                            if (categoryParam) {
                                // Filter restaurants by category after loading
                                setTimeout(() => {
                                    filterAndSortRestaurants();
                                }, 100);
                            } else {
                                filterAndSortRestaurants();
                            }
                        } else {
                            // Options not ready yet, wait and try again
                            setTimeout(setResortFilter, 100);
                        }
                    }
                    setResortFilter();
                }
            }
            
            // Function to update page title with resort name
            function updateResortTitle(resortName, category) {
                const resortTitle = document.getElementById('resortTitle');
                const pageTitleMain = document.getElementById('pageTitleMain');
                const pageDescription = document.getElementById('pageDescription');
                
                if (resortTitle && resortName) {
                    resortTitle.textContent = `at ${resortName}`;
                    resortTitle.classList.remove('hidden');
                    
                    // Update main title based on category
                    if (category === 'cafe') {
                        pageTitleMain.textContent = 'Cafés';
                        if (pageDescription) {
                            pageDescription.textContent = `Discover cafés and coffee shops at ${resortName}`;
                        }
                    } else {
                        if (pageDescription) {
                            pageDescription.textContent = `Discover exceptional dining experiences at ${resortName}`;
                        }
                    }
                }
            }
            
            // If search query exists, trigger search after a short delay to ensure data is loaded
            if (searchQuery && searchInput) {
                setTimeout(() => {
                    filterAndSortRestaurants();
                }, 100);
            }
            
            // Search timeout is now handled in the autocomplete input event listener above
            
            // Filters
            const resortFilterEl = document.getElementById('resortFilter');
            resortFilterEl.addEventListener('change', () => {
                const selectedResort = resortFilterEl.value;
                // Check if category param still exists in URL
                const currentCategoryParam = new URLSearchParams(window.location.search).get('category');
                if (selectedResort) {
                    updateResortTitle(selectedResort, currentCategoryParam);
                } else {
                    // Clear resort title if no resort selected
                    const resortTitle = document.getElementById('resortTitle');
                    const pageTitleMain = document.getElementById('pageTitleMain');
                    const pageDescription = document.getElementById('pageDescription');
                    if (resortTitle) resortTitle.classList.add('hidden');
                    if (pageTitleMain) pageTitleMain.textContent = currentCategoryParam === 'cafe' ? 'Cafés' : 'Restaurants';
                    if (pageDescription) pageDescription.textContent = 'Discover exceptional dining experiences at ski resorts across North America';
                }
                filterAndSortRestaurants();
            });
            document.getElementById('cuisineFilter').addEventListener('change', filterAndSortRestaurants);
            document.getElementById('sortSelect').addEventListener('change', filterAndSortRestaurants);
            
            // Clear filters button
            document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
            
            // Load More button
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', loadMoreRestaurants);
            }
            
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileMenu = document.getElementById('mobileMenu');
            const menuIcon = document.getElementById('menuIcon');
            const closeIcon = document.getElementById('closeIcon');
            
            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                    menuIcon.classList.toggle('hidden');
                    closeIcon.classList.toggle('hidden');
                });
            }
            
            // Close mobile menu when clicking a link
            if (mobileMenu) {
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.add('hidden');
                        menuIcon.classList.remove('hidden');
                        closeIcon.classList.add('hidden');
                    });
                });
            }
            
            // Feature 1: Grid/List View Toggle
            document.getElementById('gridViewBtn')?.addEventListener('click', () => setViewMode('grid'));
            document.getElementById('listViewBtn')?.addEventListener('click', () => setViewMode('list'));
            
            // Feature 3: Update filter chips when filters change
            const filterInputs = ['searchInput', 'resortFilter', 'cuisineFilter'];
            filterInputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', updateFilterChips);
            });
            
            // Feature 7: Advanced Filters Toggle
            document.getElementById('toggleAdvancedFilters')?.addEventListener('click', () => {
                const panel = document.getElementById('advancedFilters');
                const text = document.getElementById('advancedFiltersText');
                panel.classList.toggle('active');
                text.textContent = panel.classList.contains('active') ? 'Hide Advanced Filters' : 'Show Advanced Filters';
            });
            
            // Advanced filter inputs
            document.getElementById('priceMin')?.addEventListener('input', (e) => {
                advancedFilters.priceMin = parseInt(e.target.value);
                document.getElementById('priceMinLabel').textContent = '$'.repeat(parseInt(e.target.value));
                filterAndSortRestaurants();
                saveFiltersToStorage();
            });
            document.getElementById('priceMax')?.addEventListener('input', (e) => {
                advancedFilters.priceMax = parseInt(e.target.value);
                document.getElementById('priceMaxLabel').textContent = '$'.repeat(parseInt(e.target.value));
                filterAndSortRestaurants();
                saveFiltersToStorage();
            });
            document.getElementById('ratingFilter')?.addEventListener('input', (e) => {
                advancedFilters.ratingMin = parseFloat(e.target.value);
                document.getElementById('ratingLabel').textContent = advancedFilters.ratingMin > 0 ? advancedFilters.ratingMin.toFixed(1) : 'Any';
                filterAndSortRestaurants();
                saveFiltersToStorage();
            });
            document.getElementById('distanceFilter')?.addEventListener('input', (e) => {
                advancedFilters.distanceMax = parseInt(e.target.value);
                document.getElementById('distanceLabel').textContent = advancedFilters.distanceMax < 100 ? `${advancedFilters.distanceMax} mi` : 'Any';
                filterAndSortRestaurants();
                saveFiltersToStorage();
            });
            
            // Feature 8: Quick Filter Presets
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    applyQuickFilter(btn.dataset.filter);
                });
            });
            
            // Feature 9: Comparison Mode
            document.getElementById('comparisonModeBtn')?.addEventListener('click', toggleComparisonMode);
            document.getElementById('clearComparisonBtn')?.addEventListener('click', () => {
                selectedForComparison.clear();
                updateComparisonBar();
                renderRestaurants();
            });
            document.getElementById('compareBtn')?.addEventListener('click', () => {
                if (selectedForComparison.size >= 2) {
                    // Navigate to comparison page or show comparison modal
                    alert(`Comparing ${selectedForComparison.size} restaurants`);
                }
            });
            
            // Feature 11: Share Results
            document.getElementById('shareResultsBtn')?.addEventListener('click', shareResults);
            
            // Feature 12: Map View Toggle
            document.getElementById('mapViewBtn')?.addEventListener('click', () => {
                window.location.href = `map.html?restaurants=${filteredRestaurants.map(r => r.id).join(',')}`;
            });
            
            // Feature 14: Quick Preview Modal
            document.getElementById('closePreviewBtn')?.addEventListener('click', () => {
                document.getElementById('previewModal').classList.remove('active');
            });
            document.getElementById('previewModal')?.addEventListener('click', (e) => {
                if (e.target.id === 'previewModal') {
                    document.getElementById('previewModal').classList.remove('active');
                }
            });
            
            // Feature 18: Voice Search
            document.getElementById('voiceSearchBtn')?.addEventListener('click', startVoiceSearch);
            
            // Feature 30: Keyboard Shortcuts
            setupKeyboardShortcuts();
            
            // Feature 33: Swipe Actions (Mobile)
            if ('ontouchstart' in window) {
                setupSwipeActions();
            }
            
            // Feature 36: Pull to Refresh
            if ('ontouchstart' in window) {
                setupPullToRefresh();
            }
            
            // Feature 49: Export List
            document.getElementById('exportBtn')?.addEventListener('click', () => {
                const format = confirm('Export as CSV? (Click Cancel for PDF)') ? 'csv' : 'pdf';
                exportList(format);
            });
            
            // Feature 13: Infinite Scroll (replaces Load More)
            if (infiniteScrollEnabled) {
                setupInfiniteScroll();
            }
            
            // Load saved filters
            loadFiltersFromStorage();
            
            // Load additional features
            loadTrendingSearches();
            setTimeout(() => {
                loadRecentlyViewed();
                loadRecommendations();
            }, 1000);
            
            // Feature 29: Save filters on change
            filterInputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', saveFiltersToStorage);
            });
            document.getElementById('sortSelect')?.addEventListener('change', saveFiltersToStorage);
            
            // Feature 51: Track page view
            trackEvent('Page', 'View', 'Restaurants');
            
            // Feature 52: A/B Testing
            const abVariant = getABTestVariant('restaurant_layout');
            if (abVariant === 'B') {
                // Apply variant B styling/behavior
                document.body.classList.add('ab-variant-b');
            }
        });
    </script>

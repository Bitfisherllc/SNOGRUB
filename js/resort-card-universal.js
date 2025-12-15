/**
 * Universal Resort Card Component
 * A reusable, configurable resort card component based on the resorts page design
 * with enhanced features and customization options.
 */

class UniversalResortCard {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            // Display options
            showLogo: options.showLogo !== false, // Default: true
            showTrailMap: options.showTrailMap !== false, // Default: true
            showStats: options.showStats !== false, // Default: true
            showRating: options.showRating !== false, // Default: true
            showPriceRating: options.showPriceRating !== false, // Default: true
            showFeaturedBadge: options.showFeaturedBadge !== false, // Default: true
            showDistance: options.showDistance !== false, // Default: true
            showQuickView: options.showQuickView === true, // Default: false (removed from all cards)
            showHoverOverlay: options.showHoverOverlay !== false, // Default: true
            
            // Layout options
            imageHeight: options.imageHeight || 'h-48', // Default: h-48
            cardVariant: options.cardVariant || 'default', // 'default', 'compact', 'detailed'
            showInlineLogo: options.showInlineLogo !== false, // Default: true
            
            // Interaction options
            clickable: options.clickable !== false, // Default: true
            hoverEffect: options.hoverEffect !== false, // Default: true
            animation: options.animation !== false, // Default: true
            
            // Custom classes
            customClasses: options.customClasses || '',
            
            // Callbacks
            onCardClick: options.onCardClick || null,
            onQuickView: options.onQuickView || null,
            
            // Data formatting
            formatDistance: options.formatDistance || ((distance) => `${distance.toFixed(1)} miles away`),
            formatAcres: options.formatAcres || ((acres) => `${acres.toLocaleString()} acres`),
            formatVerticalDrop: options.formatVerticalDrop || ((drop) => `${drop.toLocaleString()} ft`),
        };
    }
    
    /**
     * Generate OpenStreetMap trail map URL
     */
    getOpenStreetMapTrailMapUrl(lat, lng, width = 640, height = 360, zoom = 13) {
        if (!lat || !lng) return null;
        
        // Calculate tile coordinates
        const scale = Math.pow(2, zoom);
        const worldCoordinateX = (lng + 180) / 360 * scale;
        const worldCoordinateY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale;
        const tileX = Math.floor(worldCoordinateX);
        const tileY = Math.floor(worldCoordinateY);
        
        // Use OpenStreetMap standard tile server
        return `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
    }
    
    /**
     * Calculate aggregate rating from resort data
     */
    calculateAggregateRating(resort) {
        if (!resort.restaurants || !Array.isArray(resort.restaurants) || resort.restaurants.length === 0) {
            return { average: null, totalReviews: 0 };
        }
        
        let totalRating = 0;
        let totalReviews = 0;
        
        resort.restaurants.forEach(restaurant => {
            if (restaurant.rating && restaurant.reviewCount) {
                totalRating += restaurant.rating * restaurant.reviewCount;
                totalReviews += restaurant.reviewCount;
            }
        });
        
        const average = totalReviews > 0 ? totalRating / totalReviews : null;
        return { average, totalReviews };
    }
    
    /**
     * Generate star rating HTML
     */
    getStarRatingHTML(rating, reviewCount = null) {
        if (!rating) return '';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '<div class="flex items-center gap-1">';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<svg class="w-4 h-4 text-yellow-400" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent" stop-opacity="1"/></linearGradient></defs><path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }
        
        starsHTML += `<span class="text-sm text-gray-600 ml-1">${rating.toFixed(1)}</span>`;
        
        if (reviewCount) {
            starsHTML += `<span class="text-xs text-gray-500 ml-1">(${reviewCount.toLocaleString()})</span>`;
        }
        
        starsHTML += '</div>';
        return starsHTML;
    }
    
    /**
     * Generate price rating widget HTML
     */
    getPriceRatingHTML(resort) {
        if (!this.config.showPriceRating) return '';
        
        // Calculate average price from restaurants
        if (!resort.restaurants || !Array.isArray(resort.restaurants) || resort.restaurants.length === 0) {
            return '';
        }
        
        let totalPrice = 0;
        let priceCount = 0;
        
        resort.restaurants.forEach(restaurant => {
            if (restaurant.priceRange) {
                // Parse price range (e.g., "$$" = 2, "$$$" = 3)
                const priceLevel = (restaurant.priceRange.match(/\$/g) || []).length;
                if (priceLevel > 0) {
                    totalPrice += priceLevel;
                    priceCount++;
                }
            }
        });
        
        if (priceCount === 0) return '';
        
        const avgPrice = totalPrice / priceCount;
        const priceCategory = avgPrice <= 1.5 ? 'budget' : 
                             avgPrice <= 2.5 ? 'moderate' : 
                             avgPrice <= 3.5 ? 'premium' : 
                             avgPrice <= 4.5 ? 'luxury' : 'ultra';
        
        const priceLabels = {
            budget: 'Budget',
            moderate: 'Moderate',
            premium: 'Premium',
            luxury: 'Luxury',
            ultra: 'Ultra'
        };
        
        return `
            <div class="price-rating-widget price-rating-${priceCategory}" title="Average price level: ${priceLabels[priceCategory]}">
                <svg class="price-rating-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="price-rating-value">${avgPrice.toFixed(1)}</span>
                <span class="price-rating-label">${priceLabels[priceCategory]}</span>
                <div class="price-rating-tooltip">Average dining price level</div>
            </div>
        `;
    }
    
    /**
     * Check if a resort is favorited
     */
    isResortFavorited(resortId) {
        try {
            const favorites = JSON.parse(localStorage.getItem('snogrub_favorites') || '[]');
            return favorites.some(fav => fav.id === resortId && fav.type === 'resort');
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Toggle favorite status for a resort
     */
    toggleFavorite(resortId, resortName, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        try {
            const favorites = JSON.parse(localStorage.getItem('snogrub_favorites') || '[]');
            const existingIndex = favorites.findIndex(fav => fav.id === resortId && fav.type === 'resort');
            
            if (existingIndex >= 0) {
                // Remove from favorites
                favorites.splice(existingIndex, 1);
                localStorage.setItem('snogrub_favorites', JSON.stringify(favorites));
                
                // Update button
                const button = event?.target?.closest('.favorite-button');
                if (button) {
                    button.setAttribute('aria-checked', 'false');
                    button.classList.remove('favorited');
                    const icon = button.querySelector('svg');
                    if (icon) {
                        icon.classList.remove('fill-red-500', 'text-red-500');
                        icon.classList.add('fill-none', 'text-gray-400');
                    }
                }
            } else {
                // Add to favorites
                favorites.push({
                    id: resortId,
                    type: 'resort',
                    name: resortName,
                    addedAt: new Date().toISOString()
                });
                localStorage.setItem('snogrub_favorites', JSON.stringify(favorites));
                
                // Update button
                const button = event?.target?.closest('.favorite-button');
                if (button) {
                    button.setAttribute('aria-checked', 'true');
                    button.classList.add('favorited');
                    const icon = button.querySelector('svg');
                    if (icon) {
                        icon.classList.add('fill-red-500', 'text-red-500');
                        icon.classList.remove('fill-none', 'text-gray-400');
                    }
                }
            }
            
            // Dispatch custom event for other components to listen
            window.dispatchEvent(new CustomEvent('favoritesChanged', {
                detail: { resortId, favorited: existingIndex < 0 }
            }));
        } catch (e) {
            console.error('Error toggling favorite:', e);
        }
    }
    
    /**
     * Get season status indicator
     */
    getSeasonStatus(resort) {
        if (!resort.season) return null;
        
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const seasonStart = resort.season.start || '';
        const seasonEnd = resort.season.end || '';
        
        // Simple heuristic: if it's between Nov-April, likely in season
        const inSeasonMonths = [11, 12, 1, 2, 3, 4];
        const isInSeason = inSeasonMonths.includes(month);
        
        return {
            status: isInSeason ? 'open' : 'closed',
            label: isInSeason ? 'Open' : 'Closed',
            icon: isInSeason ? '✓' : '○'
        };
    }
    
    /**
     * Get trail difficulty breakdown
     */
    getTrailBreakdown(resort) {
        if (!resort.trails) return null;
        
        const total = resort.trails.total || 0;
        if (total === 0) return null;
        
        const beginner = ((resort.trails.beginner || 0) / total * 100).toFixed(0);
        const intermediate = ((resort.trails.intermediate || 0) / total * 100).toFixed(0);
        const advanced = ((resort.trails.advanced || 0) / total * 100).toFixed(0);
        const expert = ((resort.trails.expert || 0) / total * 100).toFixed(0);
        
        return { beginner, intermediate, advanced, expert, total };
    }
    
    /**
     * Render a resort card
     */
    render(resort, index = 0) {
        if (!resort) return '';
        
        // Generate map image if coordinates available
        let mapImageUrl = null;
        if (this.config.showTrailMap && resort.coordinates && resort.coordinates.lat && resort.coordinates.lng) {
            mapImageUrl = this.getOpenStreetMapTrailMapUrl(
                resort.coordinates.lat,
                resort.coordinates.lng,
                640,
                360,
                13
            );
        }
        
        // Format terrain stats
        const skiableAcres = resort.terrain?.skiableAcres ? this.config.formatAcres(resort.terrain.skiableAcres) : 'N/A';
        const verticalDrop = resort.terrain?.verticalDrop ? this.config.formatVerticalDrop(resort.terrain.verticalDrop) : 'N/A';
        const restaurantCount = resort.restaurantCount || (resort.restaurants?.length || 0);
        const distance = resort.distance !== undefined && resort.distance !== Infinity 
            ? this.config.formatDistance(resort.distance) 
            : '';
        
        // Calculate rating from platform reviews
        let aggregateRating = null;
        let totalReviewCount = 0;
        if (resort.platformReviews && Object.keys(resort.platformReviews).length > 0) {
            let totalRating = 0;
            Object.values(resort.platformReviews).forEach(platform => {
                if (platform.rating && platform.reviewCount) {
                    totalRating += platform.rating * platform.reviewCount;
                    totalReviewCount += platform.reviewCount;
                }
            });
            if (totalReviewCount > 0) {
                aggregateRating = totalRating / totalReviewCount;
            }
        }
        
        // Fallback to restaurant rating if no platform reviews
        const ratingData = aggregateRating !== null 
            ? { average: aggregateRating, totalReviews: totalReviewCount }
            : this.calculateAggregateRating(resort);
        const ratingHTML = this.config.showRating && ratingData.average !== null
            ? this.getStarRatingHTML(ratingData.average, ratingData.totalReviews)
            : '';
        
        // Price rating widget (only show if pricing data exists, no GET PRICE button)
        let priceRatingHTML = '';
        if (this.config.showPriceRating) {
            // Check if pricing data exists in resort object or cache
            const pricing = resort.pricing || (typeof priceDataCache !== 'undefined' && priceDataCache.get && priceDataCache.get(resort.id));
            if (pricing && pricing.weekdayAdult) {
                priceRatingHTML = `<div class="price-rating-container" data-resort-id="${resort.id}" data-resort-name="${resort.name.replace(/'/g, "\\'")}"></div>`;
            }
        }
        
        // Check if resort is favorited
        const isFavorited = this.isResortFavorited(resort.id);
        
        // Check if resort is home base
        const isHomeBase = typeof HomeBase !== 'undefined' && HomeBase.isActive() && HomeBase.getResortId() === resort.id;
        
        // Season status
        const seasonStatus = this.getSeasonStatus(resort);
        
        // Favorites button
        const favoritesButton = `
            <button class="favorite-button absolute top-4 right-4 z-30 p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl hover:bg-white hover:shadow-2xl hover:scale-110 transition-all duration-200 ${isFavorited ? 'favorited' : ''}"
                    onclick="if(typeof window.toggleResortFavorite === 'function') { window.toggleResortFavorite('${resort.id}', '${resort.name.replace(/'/g, "\\'")}', event); } else { event.stopPropagation(); event.preventDefault(); }"
                    aria-label="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}"
                    aria-checked="${isFavorited}"
                    title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                <svg class="w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </button>
        `;
        
        // Home base button (positioned next to favorites button)
        // Position: favorites button is at right-4 (1rem), home base button at right-14 (3.5rem) to be just to its left
        const homeBaseButton = `
            <button class="homebase-button absolute top-4 right-14 z-30 p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl hover:bg-white hover:shadow-2xl hover:scale-110 transition-all duration-200 ${isHomeBase ? 'homebase-active' : ''}"
                    onclick="if(typeof window.toggleResortHomeBase === 'function') { window.toggleResortHomeBase('${resort.id}', '${resort.name.replace(/'/g, "\\'")}', event); } else { event.stopPropagation(); event.preventDefault(); }"
                    aria-label="${isHomeBase ? 'Remove from home base' : 'Set as home base'}"
                    aria-checked="${isHomeBase}"
                    title="${isHomeBase ? 'Remove from home base' : 'Set as home base'}">
                <svg class="w-5 h-5 ${isHomeBase ? 'fill-[var(--accent-blue)] text-[var(--accent-blue)]' : 'fill-none text-gray-400'}" fill="${isHomeBase ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
            </button>
        `;
        
        // Trail breakdown
        const trailBreakdown = this.getTrailBreakdown(resort);
        
        // Card classes
        const cardClasses = [
            'resort-card',
            'bg-white',
            'border',
            'border-gray-200',
            'rounded-2xl',
            'overflow-hidden',
            'group',
            'relative',
            this.config.hoverEffect ? 'hover:shadow-2xl hover:-translate-y-1' : '',
            this.config.animation ? 'transition-all duration-300 ease-out' : '',
            this.config.customClasses
        ].filter(Boolean).join(' ');
        
        // Image height class
        const imageHeightClass = this.config.imageHeight;
        
        // Card link
        const cardLink = this.config.clickable 
            ? `resort-detail.html?id=${resort.id}`
            : '#';
        
        // Quick view button
        const quickViewBtn = this.config.showQuickView ? `
            <button class="absolute top-4 right-4 z-30 px-4 py-2 bg-white/95 backdrop-blur-md text-gray-700 text-sm font-semibold rounded-xl shadow-xl hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    onclick="event.stopPropagation(); ${this.config.onQuickView ? `(${this.config.onQuickView.toString()})('${resort.id}')` : ''}"
                    title="Quick View">
                <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Quick View
            </button>
        ` : '';
        
        // Hover overlay
        const hoverOverlay = this.config.showHoverOverlay ? `
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        ` : '';
        
        // Season status badge - positioned below featured badge if featured, otherwise at top-4
        const seasonBadge = seasonStatus ? `
            <div class="absolute ${this.config.showFeaturedBadge && resort.featured ? 'top-16' : 'top-4'} left-4 z-30 px-3 py-1.5 ${seasonStatus.status === 'open' ? 'bg-green-500' : 'bg-gray-500'}/90 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full ${seasonStatus.status === 'open' ? 'bg-white animate-pulse' : 'bg-gray-300'}"></span>
                ${seasonStatus.label}
            </div>
        ` : '';
        
        return `
            <div class="${cardClasses}" data-resort-id="${resort.id}" ${this.config.onCardClick ? `onclick="(${this.config.onCardClick.toString()})('${resort.id}')"` : ''}>
                <a href="${cardLink}" class="block ${!this.config.clickable ? 'pointer-events-none' : ''}">
                    <!-- Image Section with Enhanced Overlay -->
                    <div class="relative ${imageHeightClass} bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 overflow-hidden">
                        ${mapImageUrl ? 
                            `<img src="${mapImageUrl}" 
                                  alt="Trail map of ${resort.name}" 
                                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                  style="filter: brightness(0.85) contrast(1.2) saturate(1.15);"
                                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                  loading="lazy"
                                  title="OpenStreetMap trail map">` :
                            ''
                        }
                        ${!mapImageUrl ? 
                            `<div class="w-full h-full flex items-center justify-center">
                                <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                            </div>` :
                            `<div class="w-full h-full flex items-center justify-center hidden">
                                <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                            </div>`
                        }
                        
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
                        ${hoverOverlay}
                        
                        <!-- Resort Logo Overlay (Enhanced) - Only show if logo is available -->
                        ${this.config.showLogo ? `
                            <div class="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-20 transition-all duration-300 group-hover:scale-105 resort-logo-overlay-container" data-resort-logo-overlay="${resort.id}" style="display: none;">
                                <div class="bg-white/97 backdrop-blur-md rounded-xl p-3 shadow-2xl max-w-[200px] border border-white/20 logo-container">
                                    <div class="resort-logo-loading" style="display: flex; align-items: center; justify-content: center; min-height: 52px;">
                                        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <img src="" 
                                         alt="${resort.name} logo"
                                         class="w-full h-auto max-h-14 object-contain resort-logo-img"
                                         style="display: none;"
                                         onerror="const container = this.closest('.resort-logo-overlay-container'); if(container) container.style.display='none';"
                                         onload="const container = this.closest('.resort-logo-overlay-container'); const loading = this.previousElementSibling; if(container) { container.style.display='flex'; this.style.display='block'; } if(loading) loading.style.display='none';"
                                         loading="lazy">
                                </div>
                            </div>
                        ` : ''}
                        
                        ${quickViewBtn}
                        ${favoritesButton}
                        ${homeBaseButton}
                        
                        <!-- Featured Badge (Enhanced) - Positioned above season badge on left -->
                        ${this.config.showFeaturedBadge && resort.featured ? 
                            `<div class="absolute top-4 left-4 z-30 px-3 py-1.5 bg-gradient-to-r from-[var(--accent-blue)] to-blue-600 text-white text-xs font-bold rounded-lg shadow-xl border border-white/20 backdrop-blur-sm flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                Featured
                            </div>` : ''
                        }
                        
                        ${seasonBadge}
                        
                        <!-- Price Rating Widget (Bottom Left) -->
                        ${priceRatingHTML ? `
                            <div class="absolute bottom-4 left-4 z-30">
                                ${priceRatingHTML}
                            </div>
                        ` : ''}
                        
                        <!-- Stats Overlay (Bottom Right) -->
                        ${this.config.showStats ? `
                            <div class="absolute bottom-4 right-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div class="bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 text-white text-xs font-semibold shadow-xl border border-white/10">
                                    <div class="flex items-center gap-1.5">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                                        </svg>
                                        ${resort.lifts?.total || 'N/A'} Lifts
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Card Content (Enhanced) -->
                    <div class="p-6 bg-gradient-to-b from-white to-gray-50/50">
                        <!-- Header Section -->
                        <div class="mb-4">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-2xl font-bold text-gray-900 group-hover:text-[var(--accent-blue)] transition-colors duration-200 leading-tight">${resort.name}</h3>
                            </div>
                            
                            ${ratingHTML ? `<div class="mb-3">${ratingHTML}</div>` : ''}
                            
                            <div class="flex flex-col gap-1.5 mb-4">
                                <p class="text-gray-600 text-sm flex items-center gap-1.5">
                                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span class="truncate">${resort.location || 'Location not specified'}</span>
                                </p>
                                ${this.config.showDistance && distance ? `
                                    <p class="text-sm flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-[var(--accent-blue)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span class="text-[var(--accent-blue)] font-semibold">${distance}</span>
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Stats Grid (Enhanced with Icons) -->
                        ${this.config.showStats ? `
                            <div class="grid grid-cols-2 gap-3 mb-4">
                                <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-100 group-hover:border-blue-200 transition-colors">
                                    <div class="flex items-center justify-between mb-1">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        <span class="text-2xl font-bold text-gray-900">${restaurantCount}</span>
                                    </div>
                                    <p class="text-xs text-gray-600 font-medium">Dining Options</p>
                                </div>
                                
                                <div class="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 border border-green-100 group-hover:border-green-200 transition-colors">
                                    <div class="flex items-center justify-between mb-1">
                                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                        </svg>
                                        <span class="text-lg font-bold text-gray-900 truncate">${skiableAcres.split(' ')[0]}</span>
                                    </div>
                                    <p class="text-xs text-gray-600 font-medium">Acres</p>
                                </div>
                                
                                <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 border border-purple-100 group-hover:border-purple-200 transition-colors">
                                    <div class="flex items-center justify-between mb-1">
                                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                        <span class="text-lg font-bold text-gray-900 truncate">${verticalDrop}</span>
                                    </div>
                                    <p class="text-xs text-gray-600 font-medium">Vertical Drop</p>
                                </div>
                                
                                <div class="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-3 border border-orange-100 group-hover:border-orange-200 transition-colors">
                                    <div class="flex items-center justify-between mb-1">
                                        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                        <span class="text-lg font-bold text-gray-900">${resort.trails?.total || 'N/A'}</span>
                                    </div>
                                    <p class="text-xs text-gray-600 font-medium">Trails</p>
                                </div>
                            </div>
                            
                            ${trailBreakdown ? `
                                <!-- Trail Difficulty Breakdown -->
                                <div class="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <p class="text-xs font-semibold text-gray-700 mb-2">Trail Difficulty</p>
                                    <div class="flex items-center gap-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        ${trailBreakdown.beginner > 0 ? `<div class="h-full bg-green-400" style="width: ${trailBreakdown.beginner}%" title="${trailBreakdown.beginner}% Beginner"></div>` : ''}
                                        ${trailBreakdown.intermediate > 0 ? `<div class="h-full bg-blue-400" style="width: ${trailBreakdown.intermediate}%" title="${trailBreakdown.intermediate}% Intermediate"></div>` : ''}
                                        ${trailBreakdown.advanced > 0 ? `<div class="h-full bg-orange-400" style="width: ${trailBreakdown.advanced}%" title="${trailBreakdown.advanced}% Advanced"></div>` : ''}
                                        ${trailBreakdown.expert > 0 ? `<div class="h-full bg-red-500" style="width: ${trailBreakdown.expert}%" title="${trailBreakdown.expert}% Expert"></div>` : ''}
                                    </div>
                                    <div class="flex items-center justify-between mt-2 text-xs text-gray-600">
                                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-400"></span> ${trailBreakdown.beginner}%</span>
                                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span> ${trailBreakdown.intermediate}%</span>
                                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span> ${trailBreakdown.advanced}%</span>
                                        ${trailBreakdown.expert > 0 ? `<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span> ${trailBreakdown.expert}%</span>` : ''}
                                    </div>
                                </div>
                            ` : ''}
                        ` : ''}
                        
                        <!-- Footer CTA (Enhanced) -->
                        <div class="pt-4 border-t border-gray-200">
                            <div class="flex items-center gap-2">
                                <a href="${cardLink}" 
                                   class="flex-1 px-4 py-2.5 bg-white border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 text-center"
                                   onclick="event.stopPropagation();">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                    View Resort Details
                                </a>
                                <a href="resort-restaurants.html?resort=${resort.id}" 
                                   class="flex-1 px-4 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 text-center"
                                   onclick="event.stopPropagation();">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    Explore Restaurants
                                </a>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
    
    /**
     * Render multiple resort cards
     */
    renderMultiple(resorts) {
        if (!Array.isArray(resorts)) return '';
        return resorts.map((resort, index) => this.render(resort, index)).join('');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalResortCard;
}


/* ==========================================================================
   THE HAVEN RESIDENCES - INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CORE STATE & THE FLOORPLAN SELECTOR DATA
       ========================================================================== */
       
    // Pre-defined architectural SVGs for the 3 unit types
    const blueprints = {
        penthouse: `
            <svg viewBox="0 0 500 350" width="100%" height="100%" class="blueprint-svg">
                <!-- Grid background representation -->
                <rect width="100%" height="100%" fill="none"/>
                
                <!-- Dimensions Outline (Feet) -->
                <line x1="30" y1="20" x2="470" y2="20" class="blueprint-dimension-line" />
                <line x1="30" y1="20" x2="30" y2="330" class="blueprint-dimension-line" />
                <text x="250" y="15" class="blueprint-text-dim" text-anchor="middle">110' 0" OVERALL WIDTH</text>
                <text x="12" y="180" class="blueprint-text-dim" text-anchor="middle" transform="rotate(-90 12 180)">82' 0" OVERALL LENGTH</text>

                <!-- Outer Travertine Walls -->
                <rect x="30" y="30" width="440" height="300" class="blueprint-path" />
                
                <!-- Inner Room Partitions -->
                <!-- Master Bedroom suite -->
                <line x1="220" y1="30" x2="220" y2="210" class="blueprint-interior-wall" stroke-width="3" />
                <line x1="220" y1="210" x2="30" y2="210" class="blueprint-interior-wall" stroke-width="3" />
                <!-- Master Bath & Walk-in Wardrobe -->
                <line x1="120" y1="30" x2="120" y2="210" class="blueprint-interior-wall" stroke-width="1.5" />
                <line x1="120" y1="120" x2="30" y2="120" class="blueprint-interior-wall" stroke-width="1.5" />
                
                <!-- Second Bedroom -->
                <line x1="350" y1="30" x2="350" y2="180" class="blueprint-interior-wall" stroke-width="3" />
                <line x1="350" y1="180" x2="470" y2="180" class="blueprint-interior-wall" stroke-width="3" />
                
                <!-- Central Gallery & Grand Salon -->
                <line x1="220" y1="260" x2="470" y2="260" class="blueprint-interior-wall" stroke-width="3" />
                
                <!-- Grand Columns (Load Bearing Travertine Blocks) -->
                <rect x="115" y="205" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="215" y="205" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="345" y="175" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="345" y="255" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />

                <!-- Doors & Arcs -->
                <!-- Master Bedroom door -->
                <path d="M 180,210 A 40,40 0 0,0 220,250" class="blueprint-door-arc" />
                <line x1="180" y1="210" x2="180" y2="250" stroke="#C5A059" stroke-width="1" />
                
                <!-- Main entrance door -->
                <path d="M 390,260 A 40,40 0 0,1 430,300" class="blueprint-door-arc" />
                <line x1="390" y1="260" x2="430" y2="260" stroke="#C5A059" stroke-width="1" />

                <!-- Outdoor Terrace / Balcony Grid -->
                <rect x="80" y="300" width="310" height="30" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="3,3" />
                <text x="235" y="320" class="blueprint-text" font-size="9" fill="#C5A059" letter-spacing="1" text-anchor="middle">PANORAMIC SUNSET TERRACE</text>

                <!-- Labels -->
                <text x="125" y="100" class="blueprint-text" font-size="12" letter-spacing="2" text-anchor="middle">MASTER SUITE</text>
                <text x="125" y="115" class="blueprint-text-dim" text-anchor="middle">24' x 16'</text>
                
                <text x="410" y="100" class="blueprint-text" font-size="10" letter-spacing="1" text-anchor="middle">BEDROOM 2</text>
                <text x="410" y="112" class="blueprint-text-dim" text-anchor="middle">14' x 12'</text>

                <text x="320" y="235" class="blueprint-text" font-size="13" letter-spacing="3" text-anchor="middle">GRAND SALON</text>
                <text x="320" y="250" class="blueprint-text-dim" text-anchor="middle">38' x 20'</text>
                
                <text x="75" y="75" class="blueprint-text" font-size="9" letter-spacing="1" text-anchor="middle">BATH &amp; SPA</text>
                <text x="75" y="165" class="blueprint-text" font-size="9" letter-spacing="1" text-anchor="middle">WARDROBE</text>
            </svg>
        `,
        suite: `
            <svg viewBox="0 0 500 350" width="100%" height="100%" class="blueprint-svg">
                <rect width="100%" height="100%" fill="none"/>
                
                <!-- Dimensions Outline (Feet) -->
                <line x1="40" y1="20" x2="460" y2="20" class="blueprint-dimension-line" />
                <line x1="40" y1="20" x2="40" y2="330" class="blueprint-dimension-line" />
                <text x="250" y="15" class="blueprint-text-dim" text-anchor="middle">85' 0" OVERALL WIDTH</text>
                <text x="15" y="180" class="blueprint-text-dim" text-anchor="middle" transform="rotate(-90 15 180)">65' 0" OVERALL LENGTH</text>

                <!-- Outer Travertine Walls -->
                <rect x="40" y="30" width="420" height="300" class="blueprint-path" />
                
                <!-- Room Divisions -->
                <line x1="250" y1="30" x2="250" y2="330" class="blueprint-interior-wall" stroke-width="3" />
                <line x1="40" y1="180" x2="250" y2="180" class="blueprint-interior-wall" stroke-width="3" />
                
                <!-- Bath divisions -->
                <line x1="140" y1="30" x2="140" y2="180" class="blueprint-interior-wall" stroke-width="1.5" />
                <line x1="360" y1="30" x2="360" y2="170" class="blueprint-interior-wall" stroke-width="1.5" />
                <line x1="250" y1="170" x2="460" y2="170" class="blueprint-interior-wall" stroke-width="2" />
                
                <!-- Columns -->
                <rect x="245" y="175" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="135" y="175" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="355" y="165" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />

                <!-- Doors & Arcs -->
                <path d="M 210,180 A 40,40 0 0,0 250,220" class="blueprint-door-arc" />
                <line x1="210" y1="180" x2="210" y2="220" stroke="#C5A059" stroke-width="1" />
                
                <!-- Terrace -->
                <rect x="420" y="200" width="40" height="90" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="3,3" />
                <text x="440" y="245" class="blueprint-text" font-size="9" fill="#C5A059" letter-spacing="1" text-anchor="middle" transform="rotate(90 440 245)">CANOPY BALCONY</text>

                <!-- Labels -->
                <text x="145" y="100" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">MASTER BEDROOM</text>
                <text x="145" y="112" class="blueprint-text-dim" text-anchor="middle">18' x 15'</text>

                <text x="355" y="90" class="blueprint-text" font-size="10" letter-spacing="1" text-anchor="middle">SUITE 2</text>
                <text x="355" y="102" class="blueprint-text-dim" text-anchor="middle">14' x 11'</text>

                <text x="145" y="250" class="blueprint-text" font-size="12" letter-spacing="3" text-anchor="middle">LIVING SALON</text>
                <text x="145" y="265" class="blueprint-text-dim" text-anchor="middle">24' x 18'</text>

                <text x="330" y="250" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">DINING &amp; KITCHEN</text>
                <text x="330" y="265" class="blueprint-text-dim" text-anchor="middle">18' x 16'</text>
                
                <text x="90" y="70" class="blueprint-text" font-size="8" letter-spacing="0.5" text-anchor="middle">MASTER EN-SUITE</text>
                <text x="410" y="70" class="blueprint-text" font-size="8" letter-spacing="0.5" text-anchor="middle">BATH 2</text>
            </svg>
        `,
        loft: `
            <svg viewBox="0 0 500 350" width="100%" height="100%" class="blueprint-svg">
                <rect width="100%" height="100%" fill="none"/>
                
                <!-- Dimensions Outline (Feet) -->
                <line x1="60" y1="20" x2="440" y2="20" class="blueprint-dimension-line" />
                <line x1="60" y1="20" x2="60" y2="330" class="blueprint-dimension-line" />
                <text x="250" y="15" class="blueprint-text-dim" text-anchor="middle">60' 0" OVERALL WIDTH</text>
                <text x="30" y="180" class="blueprint-text-dim" text-anchor="middle" transform="rotate(-90 30 180)">65' 0" OVERALL LENGTH</text>

                <!-- Outer Travertine Walls -->
                <rect x="60" y="30" width="380" height="300" class="blueprint-path" />
                
                <!-- Interior walls layout for Double Height Loft -->
                <line x1="60" y1="160" x2="300" y2="160" class="blueprint-interior-wall" stroke-width="3" />
                <line x1="300" y1="160" x2="300" y2="30" class="blueprint-interior-wall" stroke-width="2" />
                
                <!-- Glass facade indicator -->
                <line x1="440" y1="30" x2="440" y2="330" stroke="#C5A059" stroke-width="3" />
                <line x1="435" y1="30" x2="435" y2="330" stroke="#FFFFFF" stroke-width="1" />
                
                <!-- Columns -->
                <rect x="295" y="155" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="180" y="155" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                
                <!-- Spiral staircase vector symbol -->
                <g transform="translate(120, 240)" stroke="#C5A059" stroke-width="1" fill="none">
                    <circle r="22" stroke-dasharray="3,3"/>
                    <circle r="4" fill="#C5A059"/>
                    <line x1="0" y1="0" x2="22" y2="0"/>
                    <line x1="0" y1="0" x2="15" y2="15"/>
                    <line x1="0" y1="0" x2="0" y2="22"/>
                    <line x1="0" y1="0" x2="-15" y2="15"/>
                    <line x1="0" y1="0" x2="-22" y2="0"/>
                    <line x1="0" y1="0" x2="-15" y2="-15"/>
                    <line x1="0" y1="0" x2="0" y2="-22"/>
                    <line x1="0" y1="0" x2="15" y2="-15"/>
                </g>

                <!-- Outdoor Balcony -->
                <rect x="220" y="300" width="140" height="30" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="3,3" />
                <text x="290" y="320" class="blueprint-text" font-size="9" fill="#C5A059" letter-spacing="1" text-anchor="middle">PRIVATE RETREAT PORTICO</text>

                <!-- Labels -->
                <text x="180" y="90" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">ATELIER SALON</text>
                <text x="180" y="105" class="blueprint-text-dim" text-anchor="middle">22' x 14' (Double-Height)</text>

                <text x="370" y="90" class="blueprint-text" font-size="9" letter-spacing="1" text-anchor="middle">BATH</text>
                
                <text x="290" y="220" class="blueprint-text" font-size="13" letter-spacing="3" text-anchor="middle">LIVING GALLERY</text>
                <text x="290" y="235" class="blueprint-text-dim" text-anchor="middle">28' x 20' (Loft Space Below)</text>
                
                <text x="120" y="280" class="blueprint-text" font-size="8" fill="#C5A059" letter-spacing="0.5" text-anchor="middle">SPIRAL STAIRS</text>
                <text x="420" y="180" class="blueprint-text" font-size="9" fill="#C5A059" letter-spacing="1" text-anchor="middle" transform="rotate(-90 420 180)">DOUBLE-HEIGHT ARCH GLASS</text>
            </svg>
        `
    };

    // The comprehensive console configuration state database (9 elements)
    const consoleDatabase = {
        'penthouse-upper': {
            suite: '1801',
            sqft: '3,450 sq ft',
            ceiling: '14\' 0"',
            balcony: '3 Panoramic Balconies',
            orientation: 'Panoramic View (East & North)',
            img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
            label: 'Penthouse Upper Panoramic View',
            blueprint: blueprints.penthouse
        },
        'penthouse-mid': {
            suite: '1401',
            sqft: '3,200 sq ft',
            ceiling: '12\' 6"',
            balcony: '2 Wrap-around Balconies',
            orientation: 'Sunset View (West)',
            img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
            label: 'Penthouse Mid Canopy View',
            blueprint: blueprints.penthouse
        },
        'penthouse-lower': {
            // Garden Penthouse layout for ground level
            suite: '101',
            sqft: '3,800 sq ft',
            ceiling: '16\' 0" (Vaulted)',
            balcony: 'Private Travertine Courtyard',
            orientation: 'North-facing Garden View',
            img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            label: 'Garden Penthouse Courtyard View',
            blueprint: blueprints.penthouse
        },
        'suite-upper': {
            suite: '1502',
            sqft: '1,840 sq ft',
            ceiling: '11\' 6"',
            balcony: '2 Panoramic Balconies',
            orientation: 'Sunrise View (East)',
            img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
            label: 'Suite Upper Coastline Skyline View',
            blueprint: blueprints.suite
        },
        'suite-mid': {
            suite: '802',
            sqft: '1,810 sq ft',
            ceiling: '10\' 8"',
            balcony: '1 Extended Balcony',
            orientation: 'Courtyard View (South)',
            img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
            label: 'Suite Mid Greenery Canopy View',
            blueprint: blueprints.suite
        },
        'suite-lower': {
            suite: '102',
            sqft: '1,950 sq ft',
            ceiling: '12\' 0"',
            balcony: '1 Large Garden Terrace',
            orientation: 'Garden Path View (West)',
            img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            label: 'Suite Lower Courtyard Oasis View',
            blueprint: blueprints.suite
        },
        'loft-upper': {
            suite: '1603',
            sqft: '1,220 sq ft',
            ceiling: '18\' 0" (Double Height)',
            balcony: '1 Panoramic Balcony',
            orientation: 'Skyline View (North)',
            img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
            label: 'Loft Upper Sky-High Skyline View',
            blueprint: blueprints.loft
        },
        'loft-mid': {
            suite: '703',
            sqft: '1,200 sq ft',
            ceiling: '18\' 0" (Double Height)',
            balcony: '1 Architectural Balcony',
            orientation: 'City View (East)',
            img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
            label: 'Loft Mid City Forest Canopy View',
            blueprint: blueprints.loft
        },
        'loft-lower': {
            suite: '103',
            sqft: '1,310 sq ft',
            ceiling: '20\' 0" (Double Vault)',
            balcony: 'Private Glass Walk-out',
            orientation: 'Park View (South)',
            img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            label: 'Loft Lower Private Garden View',
            blueprint: blueprints.loft
        }
    };

    // Tracking variables for active console elements
    let activeUnit = 'penthouse';
    let activeFloor = 'mid';

    // UI Element Cache
    const unitSelectorButtons = document.querySelectorAll('#unit-selector .btn-console');
    const floorSelectorButtons = document.querySelectorAll('#floor-selector .btn-console');
    
    const specSuite = document.getElementById('spec-suite');
    const specSqft = document.getElementById('spec-sqft');
    const specCeiling = document.getElementById('spec-ceiling');
    const specBalcony = document.getElementById('spec-balcony');
    const specOrientation = document.getElementById('spec-orientation');
    
    const blueprintWrapper = document.getElementById('blueprint-wrapper');
    const windowViewBg = document.getElementById('window-view-bg');
    const windowLabel = document.getElementById('window-label');
    const reserveSuiteBtn = document.getElementById('reserve-suite-btn');

    // VIP Form elements
    const selectedSuiteBadge = document.getElementById('selected-suite-badge');
    const badgeSuiteDetails = document.getElementById('badge-suite-details');
    const vipSuiteSelect = document.getElementById('vip-suite-select');

    /**
     * Updates the Selector Console UI elements dynamically when options change
     */
    function updateConsole() {
        const compositeKey = `${activeUnit}-${activeFloor}`;
        const data = consoleDatabase[compositeKey];

        if (!data) return;

        // 1. Animate texts updates by applying quick transparency transitions
        const specElements = [specSuite, specSqft, specCeiling, specBalcony, specOrientation];
        specElements.forEach(el => el.style.opacity = '0.3');

        setTimeout(() => {
            specSuite.textContent = data.suite;
            specSqft.textContent = data.sqft;
            specCeiling.textContent = data.ceiling;
            specBalcony.textContent = data.balcony;
            specOrientation.textContent = data.orientation;
            
            specElements.forEach(el => el.style.opacity = '1');
        }, 150);

        // 2. Animate Blueprint vector changes
        blueprintWrapper.style.opacity = '0';
        setTimeout(() => {
            blueprintWrapper.innerHTML = data.blueprint;
            blueprintWrapper.style.opacity = '1';
        }, 200);

        // 3. Update view mockups and label
        windowViewBg.style.opacity = '0.4';
        setTimeout(() => {
            windowViewBg.style.backgroundImage = `url('${data.img}')`;
            windowViewBg.style.opacity = '1';
            windowLabel.textContent = data.label;
        }, 200);

        // 4. Update the trigger inquiry reserve button label text
        reserveSuiteBtn.textContent = `Reserve Suite ${data.suite}`;
    }

    // Assign click events on selector buttons
    unitSelectorButtons.forEach(button => {
        button.addEventListener('click', () => {
            unitSelectorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeUnit = button.getAttribute('data-unit');
            updateConsole();
        });
    });

    floorSelectorButtons.forEach(button => {
        button.addEventListener('click', () => {
            floorSelectorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeFloor = button.getAttribute('data-floor');
            updateConsole();
        });
    });

    // Handle initial console state setup on load
    updateConsole();


    /* ==========================================================================
       2. RESERVE ACTION SCROLL & VIP SELECT AUTO-FILLING
       ========================================================================== */

    reserveSuiteBtn.addEventListener('click', () => {
        const compositeKey = `${activeUnit}-${activeFloor}`;
        const data = consoleDatabase[compositeKey];
        
        if (!data) return;

        // Auto-select option matching the active suite in the VIP select field
        const targetOptionValue = `suite-${data.suite}`;
        
        // Find matching option
        for (let i = 0; i < vipSuiteSelect.options.length; i++) {
            if (vipSuiteSelect.options[i].value === targetOptionValue) {
                vipSuiteSelect.selectedIndex = i;
                break;
            }
        }

        // Trigger float label update in select wrapper if required
        vipSuiteSelect.dispatchEvent(new Event('change'));

        // Update selected badge text
        const unitNameFormatted = activeUnit.charAt(0).toUpperCase() + activeUnit.slice(1);
        const floorNameFormatted = activeFloor === 'lower' ? 'Lower Ground' : activeFloor === 'mid' ? 'Mid-rise' : 'Upper Levels';
        
        badgeSuiteDetails.textContent = `Suite ${data.suite} (${unitNameFormatted} - ${floorNameFormatted})`;
        
        // Animate the badge reveal
        selectedSuiteBadge.style.opacity = '0.5';
        setTimeout(() => {
            selectedSuiteBadge.style.opacity = '1';
        }, 150);

        // Smoothly scroll the page down to the VIP Contact Section
        const inquirySection = document.getElementById('inquiry');
        inquirySection.scrollIntoView({ behavior: 'smooth' });
    });

    // Synchronize selector changes directly into inquiry select badge on change
    vipSuiteSelect.addEventListener('change', () => {
        const selectedValue = vipSuiteSelect.value;
        if (!selectedValue) return;

        const suiteNum = selectedValue.replace('suite-', '');
        
        // Find configuration in the console matrix
        let matchedKey = null;
        for (const [key, details] of Object.entries(consoleDatabase)) {
            if (details.suite === suiteNum) {
                matchedKey = key;
                break;
            }
        }

        if (matchedKey) {
            const details = consoleDatabase[matchedKey];
            const parts = matchedKey.split('-');
            const unitNameFormatted = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            const floorNameFormatted = parts[1] === 'lower' ? 'Lower Ground' : parts[1] === 'mid' ? 'Mid-rise' : 'Upper Levels';
            
            badgeSuiteDetails.textContent = `Suite ${details.suite} (${unitNameFormatted} - ${floorNameFormatted})`;
        } else {
            badgeSuiteDetails.textContent = `Suite ${suiteNum}`;
        }
    });


    /* ==========================================================================
       3. THE BESPOKE AMENITIES CAROUSEL
       ========================================================================== */

    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlideIndex = 0;
    let carouselTimer = null;

    /**
     * Shifts active index elements in the sliding track
     */
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        currentSlideIndex = (index + slides.length) % slides.length;
        
        slides[currentSlideIndex].classList.add('active');
        indicators[currentSlideIndex].classList.add('active');
    }

    // Set indicators clicks
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const targetIndex = parseInt(indicator.getAttribute('data-slide'));
            showSlide(targetIndex);
            resetCarouselAutoplay();
        });
    });

    // Setup arrow buttons triggers
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex - 1);
        resetCarouselAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex + 1);
        resetCarouselAutoplay();
    });

    /**
     * Starts continuous auto sliding cycle every 6s
     */
    function startCarouselAutoplay() {
        carouselTimer = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 6000);
    }

    function resetCarouselAutoplay() {
        clearInterval(carouselTimer);
        startCarouselAutoplay();
    }

    // Setup autoplay on launch
    startCarouselAutoplay();

    // Pause autoplay on mouse hover over the slide content/track
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselTimer));
    carouselContainer.addEventListener('mouseleave', startCarouselAutoplay);


    /* ==========================================================================
       4. INTERACTIVE STYLED MAP & HOTSPOTS
       ========================================================================== */

    const mapHotspots = document.querySelectorAll('.map-hotspot');
    const neighborhoodListItems = document.querySelectorAll('.neighborhood-list li');
    const mapCard = document.getElementById('map-card');
    const mapCardImg = document.getElementById('map-card-img');
    const mapCardTag = document.getElementById('map-card-tag');
    const mapCardTitle = document.getElementById('map-card-title');
    const mapCardDesc = document.getElementById('map-card-desc');
    const mapCardDistance = document.getElementById('map-card-distance');
    const mapCardClose = document.getElementById('map-card-close');

    // Database with custom local assets for key interest points
    const hotspotsDatabase = {
        michelin: {
            title: 'L\'Ambroisie Dining',
            tag: 'Gastronomy',
            desc: '3 Michelin-star gastronomic sanctuary in a private curated courtyard.',
            distance: '4 min walk / 300m',
            img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80'
        },
        gallery: {
            title: 'Marlborough Gallery',
            tag: 'Culture & Art',
            desc: 'Elite global modern art gallery featuring historic and contemporary masterworks.',
            distance: '6 min walk / 450m',
            img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'
        },
        wellness: {
            title: 'The Obsidian Club',
            tag: 'Wellness & Fitness',
            desc: 'Private gym, hyperbaric oxygen chambers, and luxury recovery thermal springs.',
            distance: '3 min walk / 220m',
            img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
        },
        gardens: {
            title: 'Royal Botanical Conservatory',
            tag: 'Nature & Walks',
            desc: '200 acres of meticulously styled botanical gardens and quiet walking pathways.',
            distance: '5 min walk / 380m',
            img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
        }
    };

    /**
     * Activates a map hotspot and displays details card
     */
    function activateHotspot(spotKey, targetElement) {
        const info = hotspotsDatabase[spotKey];
        if (!info) return;

        // Deactivate all hotspots and list highlights
        mapHotspots.forEach(hs => hs.querySelector('circle:last-child').setAttribute('fill', '#C5A059'));
        neighborhoodListItems.forEach(li => li.style.borderBottomColor = 'var(--color-sand-dark)');

        // Highlight active vector elements
        if (targetElement) {
            const innerCircle = targetElement.querySelector('circle:last-child');
            if (innerCircle) innerCircle.setAttribute('fill', '#2F3D33');
        }

        // Highlight matching list element in right column
        const matchingListItem = document.querySelector(`.neighborhood-list li[data-target-spot="${spotKey}"]`);
        if (matchingListItem) {
            matchingListItem.style.borderBottomColor = 'var(--color-gold)';
        }

        // Update card parameters
        mapCardImg.src = info.img;
        mapCardImg.alt = info.title;
        mapCardTag.textContent = info.tag;
        mapCardTitle.textContent = info.title;
        mapCardDesc.textContent = info.desc;
        mapCardDistance.textContent = info.distance;

        // Position the card elegantly relative to the hotspot
        // Since we are inside absolute vector views, we position the floating card adaptively
        mapCard.classList.add('active');
    }

    // Map hotspot hover/clicks
    mapHotspots.forEach(hotspot => {
        const spotKey = hotspot.getAttribute('data-spot');
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            activateHotspot(spotKey, hotspot);
        });
    });

    // Neighborhood text list link triggers
    neighborhoodListItems.forEach(item => {
        const spotKey = item.getAttribute('data-target-spot');
        item.addEventListener('click', () => {
            const matchingHotspot = document.querySelector(`.map-hotspot[data-spot="${spotKey}"]`);
            activateHotspot(spotKey, matchingHotspot);
        });
    });

    // Close details card button
    mapCardClose.addEventListener('click', (e) => {
        e.stopPropagation();
        mapCard.classList.remove('active');
        // Re-establish original fill elements
        mapHotspots.forEach(hs => hs.querySelector('circle:last-child').setAttribute('fill', '#C5A059'));
        neighborhoodListItems.forEach(li => li.style.borderBottomColor = 'var(--color-sand-dark)');
    });

    // Clicking anywhere else on the map closes active overlays
    document.getElementById('interactive-map').addEventListener('click', () => {
        mapCard.classList.remove('active');
        mapHotspots.forEach(hs => hs.querySelector('circle:last-child').setAttribute('fill', '#C5A059'));
        neighborhoodListItems.forEach(li => li.style.borderBottomColor = 'var(--color-sand-dark)');
    });


    /* ==========================================================================
       5. INTERSECTION OBSERVER FOR PREMIUM SCROLL REVEALS
       ========================================================================== */

    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Cease watching once element has triggered transition
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => scrollObserver.observe(el));


    /* ==========================================================================
       6. PARALLAX EFFECT FOR HERO IMAGE
       ========================================================================== */

    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrollOffset = window.pageYOffset;
        // Shift background slightly slower than normal scrolling rate (0.15 velocity)
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrollOffset * 0.15}px) scale(1.05)`;
        }

        // Handle scrolling header shrinking
        const header = document.getElementById('main-header');
        if (scrollOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       7. MOBILE MENU RESPONSIVE CONTROLLER
       ========================================================================== */

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    menuToggle.addEventListener('click', toggleMobileMenu);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });


    /* ==========================================================================
       8. VIP PRIVATE INQUIRY FORM VALIDATOR & SUCCESS CARD
       ========================================================================== */

    const vipForm = document.getElementById('vip-form');
    const vipSuccessCard = document.getElementById('vip-success-card');
    
    const inputName = document.getElementById('vip-name');
    const inputEmail = document.getElementById('vip-email');
    const inputPhone = document.getElementById('vip-phone');

    const successClientName = document.getElementById('success-client-name');
    const successSuiteName = document.getElementById('success-suite-name');
    const successClientPhone = document.getElementById('success-client-phone');

    /**
     * Simple robust validator rules
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function checkField(inputElement, validationFn) {
        const group = inputElement.closest('.form-group');
        let isValid = true;

        if (validationFn) {
            isValid = validationFn(inputElement.value.trim());
        } else {
            isValid = inputElement.value.trim() !== '';
        }

        if (!isValid) {
            group.classList.add('invalid');
        } else {
            group.classList.remove('invalid');
        }

        return isValid;
    }

    // Attach input listeners to clear validation errors immediately on typing
    const inputs = [inputName, inputEmail, inputPhone];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            group.classList.remove('invalid');
        });
    });

    vipForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Run validation across key fields
        const isNameValid = checkField(inputName);
        const isEmailValid = checkField(inputEmail, validateEmail);
        const isPhoneValid = checkField(inputPhone);
        const isSuiteValid = checkField(vipSuiteSelect);

        if (isNameValid && isEmailValid && isPhoneValid && isSuiteValid) {
            // Retrieve chosen selections to personalize success dashboard details
            const chosenClient = inputName.value.trim();
            const chosenPhone = inputPhone.value.trim();
            const selectedText = vipSuiteSelect.options[vipSuiteSelect.selectedIndex].text;
            
            // Format suite name
            const suiteCleanText = selectedText.split('(')[0].trim();

            // Populate success screen details
            successClientName.textContent = chosenClient;
            successSuiteName.textContent = suiteCleanText;
            successClientPhone.textContent = chosenPhone;

            // Trigger luxurious fade out/in animation sequence
            vipForm.classList.add('hidden');
            
            setTimeout(() => {
                vipForm.style.display = 'none';
                selectedSuiteBadge.style.display = 'none';
                vipSuccessCard.classList.add('active');
                
                // Scroll to keep success dashboard perfectly inside user viewport
                document.getElementById('inquiry').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    });

});

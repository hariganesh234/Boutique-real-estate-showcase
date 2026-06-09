/* ==========================================================================
   THE HAVEN RESIDENCES - INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. PRELOADER & CUSTOM CURSOR HANDLERS
       ========================================================================== */
       
    // Preloader fade-out logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.classList.remove('no-scroll');
            
            // Trigger the hero section entrance animations
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                heroSection.classList.add('start-entrance');
            }
            
            // Slide down the main header navigation
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) {
                mainHeader.classList.add('revealed');
            }
        }, 2200);
    }
    
    // Custom cursor inertia tracking
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isTouchDevice = false;
    
    // Check if the device is a touchscreen
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        isTouchDevice = true;
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }
    
    if (!isTouchDevice && cursorDot && cursorRing) {
        document.body.classList.add('custom-cursor-active');
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows mouse directly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Ring follows mouse with linear interpolation (lag)
        function updateCursorRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(updateCursorRing);
        }
        updateCursorRing();
        
        // Add expand transitions on hovers
        const interactiveSelectors = 'a, button, select, input, textarea, .btn-console, .map-hotspot, .neighborhood-list li';
        
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                cursorRing.classList.add('hovering');
            }
        });
        
        document.body.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest(interactiveSelectors)) {
                cursorRing.classList.remove('hovering');
            }
        });
    }

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

                <!-- Detailed Furniture Overlays -->
                <!-- Master Bed -->
                <rect x="150" y="55" width="36" height="42" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="154" y="59" width="12" height="8" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <rect x="170" y="59" width="12" height="8" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <path d="M 150,85 C 160,85 176,82 186,85" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                
                <!-- Bedside tables -->
                <rect x="132" y="55" width="14" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <circle cx="139" cy="61" r="2" fill="#C5A059" opacity="0.6" />
                <rect x="189" y="55" width="14" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <circle cx="196" cy="61" r="2" fill="#C5A059" opacity="0.6" />

                <!-- Freestanding Tub in Master Bath -->
                <rect x="45" y="45" width="24" height="45" rx="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="48" y="48" width="18" height="39" rx="9" fill="none" stroke="#C5A059" stroke-width="0.6" opacity="0.8" />
                <circle cx="57" cy="80" r="1.5" fill="#C5A059" opacity="0.8" />
                
                <!-- Double Vanity Sinks -->
                <rect x="40" y="140" width="12" height="50" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <ellipse cx="46" cy="152" rx="4" ry="6" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <ellipse cx="46" cy="178" rx="4" ry="6" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />

                <!-- Wardrobe Hanger Lines -->
                <line x1="42" y1="200" x2="110" y2="200" stroke="#C5A059" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.6" />
                <path d="M 45,200 L 48,196 L 51,200 M 60,200 L 63,196 L 66,200 M 75,200 L 78,196 L 81,200 M 90,200 L 93,196 L 96,200 M 102,200 L 105,196 L 108,200" fill="none" stroke="#C5A059" stroke-width="0.6" opacity="0.5" />

                <!-- Bedroom 2 Bed & Bedside Tables -->
                <rect x="406" y="55" width="36" height="38" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="410" y="58" width="11" height="7" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <rect x="427" y="58" width="11" height="7" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <rect x="390" y="55" width="12" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <rect x="446" y="55" width="12" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />

                <!-- Grand Salon Sectional Sofa & Rug -->
                <rect x="235" y="175" width="90" height="75" fill="none" stroke="#C5A059" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.4" />
                <!-- Sofa Blocks -->
                <path d="M 240,240 L 305,240 L 305,185" fill="none" stroke="#C5A059" stroke-width="12" stroke-linecap="square" opacity="0.25" />
                <path d="M 234,246 L 311,246 L 311,179" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <path d="M 246,234 L 299,234 L 299,191" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <circle cx="270" cy="210" r="13" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />

                <!-- Grand Piano -->
                <path d="M 405,200 C 405,178 430,178 440,192 C 452,198 452,220 435,225 L 405,225 Z" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <line x1="405" y1="200" x2="405" y2="225" stroke="#C5A059" stroke-width="1.2" opacity="0.8" />
                <!-- Piano bench -->
                <rect x="394" y="206" width="6" height="13" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />

                <!-- Dining Room Table & Chairs -->
                <rect x="350" y="100" width="55" height="30" rx="3" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <!-- 6 Chairs -->
                <rect x="358" y="93" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <rect x="373" y="93" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <rect x="388" y="93" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <rect x="358" y="131" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <rect x="373" y="131" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <rect x="388" y="131" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />

                <!-- Terrace loungers & trees -->
                <!-- Lounger 1 -->
                <rect x="100" y="306" width="26" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <line x1="108" y1="306" x2="108" y2="318" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <line x1="100" y1="310" x2="108" y2="310" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <!-- Lounger 2 -->
                <rect x="140" y="306" width="26" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <line x1="148" y1="306" x2="148" y2="318" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <line x1="140" y1="310" x2="148" y2="310" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <!-- Potted Tree -->
                <g transform="translate(360, 314)">
                    <circle r="8" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                    <circle r="3" fill="none" stroke="#C5A059" stroke-width="0.5" opacity="0.8" />
                    <path d="M-6,0 L6,0 M0,-6 L0,6 M-4,-4 L4,4 M-4,4 L4,-4" stroke="#C5A059" stroke-width="0.5" opacity="0.7" />
                </g>

                <!-- North Arrow -->
                <g transform="translate(445, 52)" stroke="#C5A059" stroke-width="0.8" fill="none">
                    <circle r="12" stroke-dasharray="2,2" opacity="0.6" />
                    <path d="M0,-14 L4,-2 L0,-5 L-4,-2 Z" fill="#C5A059" stroke="none" />
                    <line x1="0" y1="-5" x2="0" y2="10" opacity="0.8" />
                    <text x="0" y="-17" font-family="Inter" font-size="7" fill="#C5A059" text-anchor="middle" font-weight="bold">N</text>
                </g>

                <!-- Custom Stamp Title Block -->
                <g transform="translate(315, 270)" font-family="Inter">
                    <rect width="145" height="48" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                    <line x1="0" y1="13" x2="145" y2="13" stroke="#C5A059" stroke-width="0.5" opacity="0.6" />
                    <text x="6" y="9" font-size="7" font-weight="bold" fill="#1D201F" letter-spacing="0.5">THE HAVEN RESIDENCES</text>
                    <text x="6" y="23" font-size="7" font-weight="bold" fill="#C5A059">UNIT 1801 - PENTHOUSE</text>
                    <text x="6" y="33" font-size="6" fill="#6E7370" letter-spacing="0.5">SCALE: 1/8" = 1'-0"</text>
                    <text x="6" y="42" font-size="6" fill="#6E7370" letter-spacing="0.5">ATELIER ARCHITECTS</text>
                </g>

                <!-- Labels -->
                <text x="125" y="112" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">MASTER SUITE</text>
                <text x="125" y="123" class="blueprint-text-dim" text-anchor="middle">24' x 16'</text>
                
                <text x="410" y="105" class="blueprint-text" font-size="9" letter-spacing="1" text-anchor="middle">BEDROOM 2</text>
                <text x="410" y="116" class="blueprint-text-dim" text-anchor="middle">14' x 12'</text>

                <text x="320" y="160" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">GRAND SALON</text>
                <text x="320" y="171" class="blueprint-text-dim" text-anchor="middle">38' x 20'</text>
                
                <text x="75" y="108" class="blueprint-text" font-size="8" letter-spacing="0.5" text-anchor="middle">BATH &amp; SPA</text>
                <text x="75" y="215" class="blueprint-text" font-size="8" letter-spacing="0.5" text-anchor="middle">WARDROBE</text>
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

                <!-- Detailed Furniture Overlays -->
                <!-- Master Bed -->
                <rect x="175" y="55" width="36" height="38" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="179" y="58" width="12" height="7" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <rect x="195" y="58" width="12" height="7" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <rect x="157" y="55" width="12" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <rect x="217" y="55" width="12" height="12" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                
                <!-- Suite 2 Bed -->
                <rect x="390" y="55" width="32" height="35" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="393" y="58" width="10" height="7" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                <rect x="408" y="58" width="10" height="7" rx="1" fill="none" stroke="#C5A059" stroke-width="0.7" opacity="0.8" />
                
                <!-- Living Salon Sofa & Rug -->
                <rect x="60" y="210" width="80" height="70" fill="none" stroke="#C5A059" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4" />
                <path d="M 65,270 L 120,270 L 120,215" fill="none" stroke="#C5A059" stroke-width="10" stroke-linecap="square" opacity="0.25" />
                <path d="M 60,275 L 125,275 L 125,210" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <path d="M 70,265 L 115,265 L 115,220" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <circle cx="92" cy="242" r="10" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />

                <!-- Dining & Kitchen Island -->
                <rect x="300" y="215" width="16" height="50" rx="2" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <circle cx="324" cy="225" r="3.5" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <circle cx="324" cy="240" r="3.5" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <circle cx="324" cy="255" r="3.5" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <!-- Dining Table -->
                <rect x="370" y="220" width="45" height="28" rx="2" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="378" y="213" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <rect x="398" y="213" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <rect x="378" y="249" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <rect x="398" y="249" width="8" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />

                <!-- Freestanding Tub in Master Suite Bath -->
                <ellipse cx="90" cy="65" rx="18" ry="10" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <ellipse cx="90" cy="65" rx="14" ry="7" fill="none" stroke="#C5A059" stroke-width="0.6" opacity="0.8" />

                <!-- Balcony planter and loungers -->
                <rect x="420" y="200" width="40" height="90" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="3,3" />
                <text x="440" y="245" class="blueprint-text" font-size="9" fill="#C5A059" letter-spacing="1" text-anchor="middle" transform="rotate(90 440 245)">CANOPY BALCONY</text>
                <!-- Balcony Chair -->
                <rect x="430" y="215" width="18" height="15" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" transform="rotate(45 439 222)" />
                <circle cx="440" cy="275" r="5" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />

                <!-- North Arrow -->
                <g transform="translate(435, 52)" stroke="#C5A059" stroke-width="0.8" fill="none">
                    <circle r="11" stroke-dasharray="2,2" opacity="0.6" />
                    <path d="M0,-13 L3.5,-2 L0,-4.5 L-3.5,-2 Z" fill="#C5A059" stroke="none" />
                    <line x1="0" y1="-4" x2="0" y2="9" opacity="0.8" />
                </g>

                <!-- Custom Stamp Title Block -->
                <g transform="translate(305, 270)" font-family="Inter">
                    <rect width="145" height="48" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                    <line x1="0" y1="13" x2="145" y2="13" stroke="#C5A059" stroke-width="0.5" opacity="0.6" />
                    <text x="6" y="9" font-size="7" font-weight="bold" fill="#1D201F" letter-spacing="0.5">THE HAVEN RESIDENCES</text>
                    <text x="6" y="23" font-size="7" font-weight="bold" fill="#C5A059">UNIT 1502 - SUITE</text>
                    <text x="6" y="33" font-size="6" fill="#6E7370" letter-spacing="0.5">SCALE: 1/8" = 1'-0"</text>
                    <text x="6" y="42" font-size="6" fill="#6E7370" letter-spacing="0.5">ATELIER ARCHITECTS</text>
                </g>

                <!-- Labels -->
                <text x="145" y="115" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">MASTER BEDROOM</text>
                <text x="145" y="126" class="blueprint-text-dim" text-anchor="middle">18' x 15'</text>

                <text x="355" y="110" class="blueprint-text" font-size="10" letter-spacing="1" text-anchor="middle">SUITE 2</text>
                <text x="355" y="121" class="blueprint-text-dim" text-anchor="middle">14' x 11'</text>

                <text x="145" y="230" class="blueprint-text" font-size="12" letter-spacing="3" text-anchor="middle">LIVING SALON</text>
                <text x="145" y="243" class="blueprint-text-dim" text-anchor="middle">24' x 18'</text>

                <text x="355" y="188" class="blueprint-text" font-size="10" letter-spacing="1.5" text-anchor="middle">DINING &amp; KITCHEN</text>
                <text x="355" y="199" class="blueprint-text-dim" text-anchor="middle">18' x 16'</text>
                
                <text x="90" y="105" class="blueprint-text" font-size="8" letter-spacing="0.5" text-anchor="middle">MASTER EN-SUITE</text>
                <text x="410" y="152" class="blueprint-text" font-size="8" letter-spacing="0.5" text-anchor="middle">BATH 2</text>
            </svg>
        `,
        loft: `
            <svg viewBox="0 0 500 350" width="100%" height="100%" class="blueprint-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#C5A059"/>
                    </marker>
                </defs>
                
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
                <line x1="440" y1="30" x2="440" y2="330" stroke="#C5A059" stroke-width="3" opacity="0.6" />
                <line x1="435" y1="30" x2="435" y2="330" stroke="#FFFFFF" stroke-width="1" />
                
                <!-- Columns -->
                <rect x="295" y="155" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                <rect x="180" y="155" width="10" height="10" fill="#1D201F" stroke="#C5A059" stroke-width="1" />
                
                <!-- Spiral staircase vector symbol -->
                <g transform="translate(110, 230)" stroke="#C5A059" stroke-width="1" fill="none">
                    <circle r="20" stroke-dasharray="2,2" opacity="0.7"/>
                    <circle r="4" fill="#C5A059"/>
                    <line x1="0" y1="0" x2="20" y2="0"/>
                    <line x1="0" y1="0" x2="14" y2="14"/>
                    <line x1="0" y1="0" x2="0" y2="20"/>
                    <line x1="0" y1="0" x2="-14" y2="14"/>
                    <line x1="0" y1="0" x2="-20" y2="0"/>
                    <line x1="0" y1="0" x2="-14" y2="-14"/>
                    <line x1="0" y1="0" x2="0" y2="-20"/>
                    <line x1="0" y1="0" x2="14" y2="-14"/>
                    <path d="M 17,-8 A 18,18 0 1,0 12,12" stroke-width="0.8" stroke-dasharray="none" marker-end="url(#arrow)" />
                </g>

                <!-- Detailed Furniture Overlays -->
                <!-- Sofa in Lower Living Gallery -->
                <rect x="200" y="210" width="80" height="70" fill="none" stroke="#C5A059" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4" />
                <path d="M 210,265 L 265,265 L 265,220" fill="none" stroke="#C5A059" stroke-width="8" stroke-linecap="square" opacity="0.25" />
                <path d="M 205,270 L 270,270 L 270,215" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <circle cx="232" cy="238" r="9" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                
                <!-- Atelier Table and Easel -->
                <rect x="130" y="80" width="35" height="22" rx="1.5" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />
                <rect x="142" y="73" width="10" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <rect x="142" y="103" width="10" height="6" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                <!-- Easel -->
                <path d="M 230,105 L 240,75 L 250,105 Z M 225,97 L 255,97" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.8" />

                <!-- Upper Loft Area (Dashed representation) -->
                <rect x="65" y="35" width="230" height="120" fill="none" stroke="#C5A059" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.5" />
                <!-- Loft Bed in upper layout -->
                <rect x="80" y="50" width="36" height="35" fill="none" stroke="#C5A059" stroke-dasharray="2,2" opacity="0.7" />
                <line x1="80" y1="70" x2="116" y2="70" stroke="#C5A059" stroke-dasharray="2,2" stroke-width="0.8" opacity="0.7" />

                <!-- Outdoor Retreat Portico -->
                <rect x="220" y="300" width="140" height="30" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="3,3" />
                <text x="290" y="320" class="blueprint-text" font-size="9" fill="#C5A059" letter-spacing="1" text-anchor="middle">PRIVATE RETREAT PORTICO</text>
                <!-- Loungers -->
                <rect x="240" y="306" width="22" height="10" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />
                <rect x="275" y="306" width="22" height="10" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.7" />

                <!-- North Arrow -->
                <g transform="translate(420, 52)" stroke="#C5A059" stroke-width="0.8" fill="none">
                    <circle r="11" stroke-dasharray="2,2" opacity="0.6" />
                    <path d="M0,-13 L3.5,-2 L0,-4.5 L-3.5,-2 Z" fill="#C5A059" stroke="none" />
                    <line x1="0" y1="-4" x2="0" y2="9" opacity="0.8" />
                </g>

                <!-- Custom Stamp Title Block -->
                <g transform="translate(285, 270)" font-family="Inter">
                    <rect width="145" height="48" fill="none" stroke="#C5A059" stroke-width="0.8" opacity="0.6" />
                    <line x1="0" y1="13" x2="145" y2="13" stroke="#C5A059" stroke-width="0.5" opacity="0.6" />
                    <text x="6" y="9" font-size="7" font-weight="bold" fill="#1D201F" letter-spacing="0.5">THE HAVEN RESIDENCES</text>
                    <text x="6" y="23" font-size="7" font-weight="bold" fill="#C5A059">UNIT 1603 - LOFT</text>
                    <text x="6" y="33" font-size="6" fill="#6E7370" letter-spacing="0.5">SCALE: 1/8" = 1'-0"</text>
                    <text x="6" y="42" font-size="6" fill="#6E7370" letter-spacing="0.5">ATELIER ARCHITECTS</text>
                </g>

                <!-- Labels -->
                <text x="180" y="125" class="blueprint-text" font-size="11" letter-spacing="2" text-anchor="middle">ATELIER SALON</text>
                <text x="180" y="137" class="blueprint-text-dim" text-anchor="middle">22' x 14' (Double-Height)</text>

                <text x="350" y="90" class="blueprint-text" font-size="9" letter-spacing="1" text-anchor="middle">BATH</text>
                
                <text x="290" y="195" class="blueprint-text" font-size="12" letter-spacing="3" text-anchor="middle">LIVING GALLERY</text>
                <text x="290" y="208" class="blueprint-text-dim" text-anchor="middle">28' x 20' (Loft Space Below)</text>
                
                <text x="110" y="265" class="blueprint-text" font-size="8" fill="#C5A059" letter-spacing="0.5" text-anchor="middle">SPIRAL STAIRS</text>
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

    // Add event listeners to property card layout configuration buttons
    const cardCtaButtons = document.querySelectorAll('.card-cta-btn');
    cardCtaButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetUnit = button.getAttribute('data-target-unit');
            const targetFloor = button.getAttribute('data-target-floor');
            
            // 1. Programmatically select Unit
            const unitBtn = document.querySelector(`#unit-selector .btn-console[data-unit="${targetUnit}"]`);
            if (unitBtn) {
                unitSelectorButtons.forEach(btn => btn.classList.remove('active'));
                unitBtn.classList.add('active');
                activeUnit = targetUnit;
            }
            
            // 2. Programmatically select Floor
            const floorBtn = document.querySelector(`#floor-selector .btn-console[data-floor="${targetFloor}"]`);
            if (floorBtn) {
                floorSelectorButtons.forEach(btn => btn.classList.remove('active'));
                floorBtn.classList.add('active');
                activeFloor = targetFloor;
            }
            
            // 3. Update the console display (blueprints, views, specs)
            updateConsole();
            
            // 4. Update Inquiry Select Option Matching unit & floor details
            const compositeKey = `${activeUnit}-${activeFloor}`;
            const data = consoleDatabase[compositeKey];
            if (data) {
                const targetOptionValue = `suite-${data.suite}`;
                for (let i = 0; i < vipSuiteSelect.options.length; i++) {
                    if (vipSuiteSelect.options[i].value === targetOptionValue) {
                        vipSuiteSelect.selectedIndex = i;
                        break;
                    }
                }
                vipSuiteSelect.dispatchEvent(new Event('change'));
                
                // Update selected badge text
                const unitNameFormatted = activeUnit.charAt(0).toUpperCase() + activeUnit.slice(1);
                const floorNameFormatted = activeFloor === 'lower' ? 'Lower Ground' : activeFloor === 'mid' ? 'Mid-rise' : 'Upper Levels';
                badgeSuiteDetails.textContent = `Suite ${data.suite} (${unitNameFormatted} - ${floorNameFormatted})`;
                
                // Animate selected badge reveal
                selectedSuiteBadge.style.opacity = '0.5';
                setTimeout(() => {
                    selectedSuiteBadge.style.opacity = '1';
                }, 150);
            }
            
            // 5. Smooth scroll down to the Floorplan Console (#selector)
            const selectorSection = document.getElementById('selector');
            if (selectorSection) {
                selectorSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Custom select dropdown controller
    const customSelect = document.getElementById('custom-suite-select');
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const triggerText = customSelect.querySelector('#custom-select-val');
        const customOptions = customSelect.querySelectorAll('.custom-select-option');
        
        // Toggle dropdown open/close
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('open');
            customSelect.closest('.form-group').classList.add('select-focused');
        });
        
        // Click option handler
        customOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedVal = opt.getAttribute('data-value');
                const selectedText = opt.textContent;
                
                // Update trigger text
                triggerText.textContent = selectedText;
                
                // Reset selected options and apply to clicked one
                customOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                
                // Update native select element
                vipSuiteSelect.value = selectedVal;
                vipSuiteSelect.dispatchEvent(new Event('change'));
                
                // Close dropdown
                customSelect.classList.remove('open');
                customSelect.closest('.form-group').classList.remove('select-focused');
                
                // Clear validation error if any
                customSelect.closest('.form-group').classList.remove('invalid');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (customSelect.classList.contains('open')) {
                customSelect.classList.remove('open');
                customSelect.closest('.form-group').classList.remove('select-focused');
            }
        });
    }

    // Synchronize selector changes directly into inquiry select badge on change
    vipSuiteSelect.addEventListener('change', () => {
        const selectedValue = vipSuiteSelect.value;
        if (!selectedValue) return;

        // Update custom select trigger text and option active states
        if (customSelect) {
            const triggerText = customSelect.querySelector('#custom-select-val');
            const customOptions = customSelect.querySelectorAll('.custom-select-option');
            const selectedText = vipSuiteSelect.options[vipSuiteSelect.selectedIndex].text;
            
            if (triggerText) {
                triggerText.textContent = selectedText;
            }
            
            customOptions.forEach(opt => {
                if (opt.getAttribute('data-value') === selectedValue) {
                    opt.classList.add('selected');
                } else {
                    opt.classList.remove('selected');
                }
            });
        }

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

        // Reset all hotspots and list highlights
        mapHotspots.forEach(hs => {
            const innerCircle = hs.querySelector('circle:not(.pulse)');
            if (innerCircle) {
                innerCircle.setAttribute('fill', '#FAF8F5');
                innerCircle.setAttribute('stroke', '#C5A059');
            }
            const paths = hs.querySelectorAll('path');
            paths.forEach(p => p.setAttribute('stroke', '#C5A059'));
        });
        neighborhoodListItems.forEach(li => li.style.borderBottomColor = 'var(--color-sand-dark)');

        // Highlight active vector elements
        if (targetElement) {
            const innerCircle = targetElement.querySelector('circle:not(.pulse)');
            if (innerCircle) {
                innerCircle.setAttribute('fill', '#2F3D33');
                innerCircle.setAttribute('stroke', '#C5A059');
            }
            const paths = targetElement.querySelectorAll('path');
            paths.forEach(p => p.setAttribute('stroke', '#FAF8F5'));
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

        // Position the card elegantly relative to the hotspot (Percentage-based adaptive popover)
        if (targetElement) {
            const transform = targetElement.getAttribute('transform');
            const matches = transform ? transform.match(/translate\(([^,]+),\s*([^)]+)\)/) : null;
            if (matches) {
                const x = parseFloat(matches[1]);
                const y = parseFloat(matches[2]);
                
                const leftPercent = (x / 800) * 100;
                const topPercent = (y / 500) * 100;
                
                mapCard.style.left = `${leftPercent}%`;
                mapCard.style.top = `${topPercent}%`;
                
                // Clear positioning classes and re-evaluate
                mapCard.className = 'map-card';
                
                if (topPercent < 45) {
                    mapCard.classList.add('pos-bottom');
                } else {
                    mapCard.classList.add('pos-top');
                }
                
                if (leftPercent < 25) {
                    mapCard.classList.add('pos-left');
                } else if (leftPercent > 75) {
                    mapCard.classList.add('pos-right');
                }
            }
        }

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
        mapHotspots.forEach(hs => {
            const innerCircle = hs.querySelector('circle:not(.pulse)');
            if (innerCircle) {
                innerCircle.setAttribute('fill', '#FAF8F5');
                innerCircle.setAttribute('stroke', '#C5A059');
            }
            const paths = hs.querySelectorAll('path');
            paths.forEach(p => p.setAttribute('stroke', '#C5A059'));
        });
        neighborhoodListItems.forEach(li => li.style.borderBottomColor = 'var(--color-sand-dark)');
    });

    // Clicking anywhere else on the map closes active overlays
    document.getElementById('interactive-map').addEventListener('click', () => {
        mapCard.classList.remove('active');
        mapHotspots.forEach(hs => {
            const innerCircle = hs.querySelector('circle:not(.pulse)');
            if (innerCircle) {
                innerCircle.setAttribute('fill', '#FAF8F5');
                innerCircle.setAttribute('stroke', '#C5A059');
            }
            const paths = hs.querySelectorAll('path');
            paths.forEach(p => p.setAttribute('stroke', '#C5A059'));
        });
        neighborhoodListItems.forEach(li => li.style.borderBottomColor = 'var(--color-sand-dark)');
    });


    /* ==========================================================================
       5. INTERSECTION OBSERVERS FOR PREMIUM SCROLL REVEALS
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

    // Image Swipe-Reveal Intersection Observer
    const imageRevealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const imageRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, imageRevealOptions);

    const imagesToReveal = document.querySelectorAll('.image-reveal-wrapper');
    imagesToReveal.forEach(img => imageRevealObserver.observe(img));


    /* ==========================================================================
       6. PARALLAX EFFECT FOR HERO IMAGE
       ========================================================================== */

    const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
    const heroFrame = document.getElementById('hero-frame');
    
    window.addEventListener('scroll', () => {
        const scrollOffset = window.pageYOffset;
        
        // Update Scroll Progress Bar
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = scrollHeight > 0 ? scrollOffset / scrollHeight : 0;
            progressBar.style.width = `${scrollFraction * 100}%`;
        }

        // Shift background wrapper slightly slower than normal scrolling rate (0.12 velocity)
        if (heroBgWrapper) {
            heroBgWrapper.style.transform = `translateY(${scrollOffset * 0.12}px)`;
        }

        // Fade out hero frame inset border as you scroll
        if (heroFrame) {
            const opacity = Math.max(0, 1 - (scrollOffset / 400));
            heroFrame.style.opacity = opacity;
        }

        // Handle scrolling header shrinking
        const header = document.getElementById('main-header');
        if (scrollOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hero Section Slideshow Controller (Crossfade)
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;
    
    function nextHeroSlide() {
        if (heroSlides.length === 0) return;
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }
    
    // Rotate hero slides every 7 seconds
    if (heroSlides.length > 0) {
        setInterval(nextHeroSlide, 7000);
    }


    /* ==========================================================================
       7. MOBILE MENU RESPONSIVE CONTROLLER
       ========================================================================== */

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileNavCta = document.querySelector('.mobile-nav-cta');

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

    if (mobileNavCta) {
        mobileNavCta.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }


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
            // Submit form to Formspree via AJAX
            const formData = new FormData(vipForm);
            
            fetch(vipForm.getAttribute('action'), {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Form successfully submitted to Formspree');
                } else {
                    console.error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
            });

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

    // Reset button inside success card to submit another inquiry
    const successResetBtn = document.getElementById('success-reset-btn');
    if (successResetBtn) {
        successResetBtn.addEventListener('click', () => {
            // 1. Reset inputs
            vipForm.reset();
            
            // 2. Hide success card and restore form
            vipSuccessCard.classList.remove('active');
            vipForm.style.display = 'block';
            
            // Allow form elements layout flow to stabilize before resetting hidden state
            setTimeout(() => {
                vipForm.classList.remove('hidden');
            }, 50);
            
            // 3. Show focus badge and sync select text
            selectedSuiteBadge.style.display = 'block';
            selectedSuiteBadge.style.opacity = '1';
            vipSuiteSelect.dispatchEvent(new Event('change'));
            
            // 4. Smooth scroll back to form focus
            document.getElementById('inquiry').scrollIntoView({ behavior: 'smooth' });
        });
    }

});

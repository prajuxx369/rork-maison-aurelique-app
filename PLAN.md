# Maison Aurélique – Luxury Fashion House Mobile App


## Vision
A **Black & Gold** luxury fashion house experience inspired by Louis Vuitton, Dior, Chanel, and Hermès apps. Dark, moody, dripping with elegance — massive whitespace, serif typography, gold accents on deep black. Now expanded from perfume-only to a complete multi-category luxury maison.

---

### **Categories**
- [x] Perfumes (8 products)
- [x] Clothing / Fashion (10 products)
- [x] Watches (8 products)
- [x] Handbags & Leather Goods (8 products)
- [x] Shoes (8 products)
- [x] Accessories (8 products)
- [x] Jewelry (8 products)

### **Features**
- [x] Browse 58 luxury products across 7 categories
- [x] Category-filtered shop with premium tab navigation
- [x] View product details with category-specific information
- [x] Fragrance pyramid for perfumes (Top / Middle / Base)
- [x] Technical details for watches (case, movement, strap)
- [x] Material and dimension details for bags, shoes, clothing
- [x] Add products to collection (cart) with quantity control
- [x] Wishlist with heart toggle across all screens
- [x] Full-text search across all products
- [x] Simulate luxury checkout with gold particle celebration
- [x] Cinematic splash screen with shimmer and particles
- [x] Cross-category product recommendations

### **Design**
- [x] **Primary palette:** Pure black (#000000) background with rich gold (#D4AF37) accents
- [x] **Typography:** Elegant serif headings paired with clean sans-serif body text
- [x] **Layout:** Generous whitespace (24–32pt padding), oversized product imagery, minimal text
- [x] **Cards:** Subtle dark charcoal cards with soft gold borders and rounded corners
- [x] **Buttons:** Bold gold buttons with black text, subtle press animations with haptic feedback
- [x] **Animations:** Cinematic splash, smooth card transitions, staggered reveals, confetti on purchase
- [x] **Tags:** NEW and LIMITED badges on applicable products
- [x] **Overall feel:** Like walking into a luxury flagship store at night

### **Screens**

1. **Splash Screen** – Full-screen black background with gold brand name "Maison Aurélique" fading in, shimmer animation, floating gold particles, tagline, auto-navigates to Home after 3 seconds

2. **Home** – Rich editorial layout with 10 sections:
   - [x] Cinematic hero banner with parallax
   - [x] Featured categories horizontal scroll (7 categories)
   - [x] New Arrivals carousel
   - [x] Signature Collection carousel
   - [x] Watches Spotlight section
   - [x] Fashion Edit carousel
   - [x] Bags & Leather Goods carousel
   - [x] Maison Story heritage section
   - [x] Limited Edition banner with gold CTA
   - [x] Personalized luxury CTA

3. **Shop (Boutique)** – Premium catalog with category filter tabs (All, Perfumes, Fashion, Watches, Bags, Shoes, Accessories, Jewelry), masonry-style 2-column grid with wishlist hearts, NEW/LIMITED tags

4. **Product Detail** – Large hero image, category label, product name, price, description, category-specific details section, Maison Aurélique certified badge, wishlist toggle, quantity stepper, Add to Collection CTA

5. **Collection (Cart)** – List of selected products with category labels, quantity stepper, subtotal, "Complete Purchase" with gold particle celebration modal

6. **Wishlist** – Saved pieces with category labels, quick-add to collection, recommended pairings section

7. **Profile** – Luxury private client lounge with avatar, Gold tier membership card, exclusive access banner, stats row, account/preferences menu sections

8. **Search** – Modal search with trending terms, category suggestions, real-time filtered results

### **Navigation**
- [x] Bottom tab bar with 5 tabs: Home, Shop, Collection, Wishlist, Profile
- [x] Tab bar styled in dark charcoal with gold active indicators and glow
- [x] Search accessible from Home via modal

### **Data Architecture**
- [x] CollectionProvider (AsyncStorage-backed, React Query synced)
- [x] WishlistProvider (AsyncStorage-backed, React Query synced)
- [x] Unified Product model across all categories
- [x] Category-specific detail fields via flexible details map

### **App Icon**
- Black background with an elegant gold perfume bottle silhouette and the letter "A" in gold serif font — luxurious and minimal

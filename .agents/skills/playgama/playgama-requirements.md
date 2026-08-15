# Playgama Technical, UX & Content Requirements

## 1. Technical Requirements
1. **Archive Structure**:
   - Submission must be a standard `.zip` archive.
   - `index.html` MUST be located directly at the root of the archive (NOT inside a nested subfolder).
   - All filenames must use standard alphanumeric Latin characters (`a-z`, `0-9`, `-`, `_`, `.`).
2. **File Size**:
   - Recommended maximum archive size: under 50 MB (hard platform cap at 100 MB).
3. **Zero External Broken Dependencies**:
   - All scripts, styles, textures, fonts, and audio MUST be packaged inside the archive.
   - No absolute paths or broken external CDN links.
4. **Relative Pathing**:
   - All asset references in HTML, CSS, and JavaScript must use relative paths (e.g. `./game.js`, `engine/index.js`).
5. **No Unauthorized Analytics**:
   - Do NOT embed unapproved third-party tracking scripts (e.g., custom Google Analytics, Facebook Pixel).

## 2. User Experience (UX) Requirements
1. **Zero Browser Scrolling**:
   - The game container must prevent page scrolling (`overflow: hidden` on `html`, `body`, and container).
2. **Audio & Mute Control**:
   - An on-screen audio mute button must be accessible to the player in the HUD or settings.
   - Audio MUST pause when the tab/window is hidden or minimized.
3. **Responsive Scaling & Aspect Ratio**:
   - The game must dynamically fit the container/viewport while maintaining aspect ratio (e.g. CSS `object-fit: contain` or letterbox/pillarbox).
   - No text or UI elements should be clipped or overflowing off-screen on narrow or small viewports.
4. **Input Support**:
   - Desktop: Full keyboard and mouse/pointer support.
   - Mobile: Touch overlay or direct touch controls without requiring physical keyboard keys.
5. **Clear Progression & Save Recovery**:
   - If the game has progression (levels, abilities, upgrades, seeds, high scores), player data must persist and reload seamlessly.

## 3. Content Compliance Requirements
1. **Intellectual Property**:
   - No copyrighted characters, brand names, logos, or commercial audio without license.
2. **Prohibited Themes**:
   - No real-money gambling, violence against protected groups, or deceptive clickbait loops.
3. **No External Store Links / Unauthorized Purchases**:
   - No external purchase redirects or unapproved payment gateways.

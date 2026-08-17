/**
 * ============================================================================
 * AI GAME FACTORY — CENTRALIZED DIALOGUE SYSTEM
 * Single Authoritative Manager, Word Wrapper, Typewriter, Queue & Input Lock
 * ============================================================================
 */

export class TextWrapper {
  /**
   * Wrap text into lines fitting within maxWidth based on canvas text measurements.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   * @param {string} text - Raw input string
   * @param {number} maxWidth - Maximum width available in pixels
   * @param {number} maxLinesPerPage - Maximum lines per dialogue box page
   * @returns {Array<Array<string>>} Array of pages, where each page is an array of strings (lines)
   */
  static wrapText(ctx, text, maxWidth, maxLinesPerPage = 3) {
    if (!text) return [[]];

    // Split by explicit double newlines first (paragraphs)
    const paragraphs = text.split('\n\n');
    const pages = [];
    let currentPage = [];

    for (let p = 0; p < paragraphs.length; p++) {
      const words = paragraphs[p].replace(/\n/g, ' ').split(' ');
      let currentLine = '';

      for (let w = 0; w < words.length; w++) {
        const word = words[w];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText ? ctx.measureText(testLine) : { width: testLine.length * 8 };

        if (metrics.width > maxWidth && currentLine !== '') {
          currentPage.push(currentLine);
          currentLine = word;

          if (currentPage.length >= maxLinesPerPage) {
            pages.push(currentPage);
            currentPage = [];
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        currentPage.push(currentLine);
      }

      // Paragraph split causes a page turn if text exists
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
    }

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages.length > 0 ? pages : [[]];
  }
}

export class DialogueSystem {
  constructor(virtualWidth = 720, virtualHeight = 450) {
    this.virtualWidth = virtualWidth;
    this.virtualHeight = virtualHeight;

    // State
    this.active = false;
    this.speaker = '';
    this.avatar = 'default';
    this.pages = [];
    this.pageIndex = 0;
    this.displayedText = '';
    this.charIndex = 0;
    this.typewriterTimer = 0;
    this.typewriterSpeed = 0.025; // 25ms per char
    this.isPageComplete = false;
    this.closeCooldown = 0;

    // Callbacks
    this.onChirp = null;
    this.onComplete = null;
  }

  get isActive() {
    return this.active;
  }

  isDebounced() {
    return this.closeCooldown > 0;
  }

  /**
   * Start a new authoritative dialogue sequence.
   * Cancels/resets any previous dialogue state cleanly.
   * @param {string} speaker - Name of the speaker
   * @param {string} avatar - Avatar profile ('snail', 'owl', 'spirit', etc.)
   * @param {string|Array<string>} content - Dialogue text or array of pages
   * @param {Object} options - { onChirp, onComplete, speed }
   */
  start(speaker, avatar, content, options = {}) {
    if (this.closeCooldown > 0) return; // Prevent instant re-trigger stutter

    this.active = true;
    this.speaker = speaker || 'Narrator';
    this.avatar = avatar || 'default';
    this.onChirp = options.onChirp || null;
    this.onComplete = options.onComplete || null;
    this.typewriterSpeed = options.speed || 0.025;

    // Process pages
    if (Array.isArray(content)) {
      this.pages = content.map(p => Array.isArray(p) ? p : [p]);
    } else {
      // Fallback rough split; real wrap occurs in render with context
      this.rawContent = content;
      this.pages = [[content]];
    }

    this.pageIndex = 0;
    this.charIndex = 0;
    this.displayedText = '';
    this.typewriterTimer = 0;
    this.isPageComplete = false;
    this.formattedPages = null;
  }

  /**
   * Advance typewriter or turn to the next dialogue page.
   * @param {number} dt - Delta time in seconds
   * @param {boolean} advanceInput - True if player pressed action / jump to advance
   */
  update(dt, advanceInput = false) {
    if (this.closeCooldown > 0) {
      this.closeCooldown -= dt;
    }

    if (!this.active) return;

    const currentPageLines = (this.formattedPages && this.formattedPages[this.pageIndex]) || this.pages[this.pageIndex] || [];
    const fullPageText = currentPageLines.join('\n');

    if (!this.isPageComplete) {
      this.typewriterTimer += dt;
      while (this.typewriterTimer >= this.typewriterSpeed && this.charIndex < fullPageText.length) {
        this.typewriterTimer -= this.typewriterSpeed;
        this.charIndex++;
        this.displayedText = fullPageText.slice(0, this.charIndex);

        // Melodic voice chirp every 3 alphanumeric characters
        if (this.charIndex % 3 === 0 && this.onChirp) {
          const char = fullPageText[this.charIndex - 1];
          if (char && char.match(/[a-zA-Z0-9]/)) {
            this.onChirp(this.avatar);
          }
        }
      }

      if (this.charIndex >= fullPageText.length) {
        this.isPageComplete = true;
      }

      // Fast-forward on input press
      if (advanceInput) {
        this.charIndex = fullPageText.length;
        this.displayedText = fullPageText;
        this.isPageComplete = true;
        return;
      }
    } else {
      // Advance to next page or close
      if (advanceInput) {
        const totalPages = (this.formattedPages && this.formattedPages.length) || this.pages.length;
        if (this.pageIndex < totalPages - 1) {
          this.pageIndex++;
          this.charIndex = 0;
          this.displayedText = '';
          this.typewriterTimer = 0;
          this.isPageComplete = false;
        } else {
          this.close();
        }
      }
    }
  }

  /**
   * Close the dialogue box and apply the 250ms debounce cooldown.
   */
  close() {
    this.active = false;
    this.closeCooldown = 0.25; // 250ms debounce
    const cb = this.onComplete;
    this.onComplete = null;
    if (cb) cb();
  }

  /**
   * Render the dialogue box in screen space with 100% solid backplate.
   * @param {CanvasRenderingContext2D} ctx - 2D context
   * @param {Function} drawAvatarCallback - Optional callback (ctx, avatar, x, y, size)
   */
  render(ctx, drawAvatarCallback = null) {
    if (!this.active) return;

    const boxW = Math.min(620, this.virtualWidth - 40);
    const boxH = 115;
    const boxX = (this.virtualWidth - boxW) / 2;
    const boxY = this.virtualHeight - boxH - 18;

    // 1. Calculate word wrapping dynamically if not pre-cached
    if (!this.formattedPages && this.rawContent) {
      const textAvailableWidth = boxW - 140; // 90px avatar + margins
      ctx.font = "14px 'Nunito', sans-serif";
      this.formattedPages = TextWrapper.wrapText(ctx, this.rawContent, textAvailableWidth, 3);
    }

    ctx.save();

    // 2. 100% Solid Backplate (#0A1610) eliminating canvas bleed
    ctx.fillStyle = '#0A1610';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    else ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();

    // Border Frame
    ctx.strokeStyle = '#2EC4B6';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // 3. Speaker Name Pill
    const speakerText = this.speaker.toUpperCase();
    ctx.font = "bold 12px 'Fredoka', sans-serif";
    const nameMetrics = ctx.measureText ? ctx.measureText(speakerText) : { width: 80 };
    const pillW = Math.max(120, nameMetrics.width + 36);
    const pillH = 24;
    const pillX = boxX + 16;
    const pillY = boxY - 12;

    ctx.fillStyle = '#143024';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, 12);
    else ctx.rect(pillX, pillY, pillW, pillH);
    ctx.fill();
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFD166';
    ctx.textAlign = 'center';
    ctx.fillText(speakerText, pillX + pillW / 2, pillY + 16);
    ctx.textAlign = 'left';

    // 4. Avatar Box
    const avatarX = boxX + 16;
    const avatarY = boxY + 20;
    const avatarSize = 72;

    ctx.fillStyle = '#102219';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 10);
    else ctx.rect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fill();
    ctx.strokeStyle = 'rgba(46, 196, 182, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    if (drawAvatarCallback) {
      drawAvatarCallback(ctx, this.avatar, avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize);
    }

    // 5. Dialogue Typewriter Text Rendering
    ctx.fillStyle = '#F0F9F5';
    ctx.font = "14px 'Nunito', system-ui, sans-serif";
    const textStartX = avatarX + avatarSize + 16;
    const textStartY = boxY + 38;
    const lineHeight = 20;

    const currentLines = this.displayedText.split('\n');
    for (let i = 0; i < currentLines.length; i++) {
      ctx.fillText(currentLines[i], textStartX, textStartY + i * lineHeight);
    }

    // 6. Action Advance Prompt (Animated acorn / arrow)
    if (this.isPageComplete) {
      const promptX = boxX + boxW - 24;
      const promptY = boxY + boxH - 16;
      ctx.fillStyle = '#FFD166';
      ctx.font = "bold 11px 'Fredoka', sans-serif";
      ctx.textAlign = 'right';
      ctx.fillText('▶ [E] / [Space]', promptX, promptY);
      ctx.textAlign = 'left';
    }

    ctx.restore();
  }
}

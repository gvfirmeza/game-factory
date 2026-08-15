import { ProceduralPrimitives } from '../rendering/ProceduralPrimitives.js';

/**
 * Robust, zero-overflow Dialogue Box with automatic dynamic text measurement,
 * line wrapping, multi-page pagination, typewriter reveal, speaker portraits, and sound triggers.
 */
export class DialogueBox {
  constructor(virtualWidth = 720, virtualHeight = 450) {
    this.virtualWidth = virtualWidth;
    this.virtualHeight = virtualHeight;

    this.active = false;
    this.speaker = '';
    this.avatar = null;
    this.pages = [];
    this.currentPageIndex = 0;

    this.currentText = '';
    this.displayedText = '';
    this.charIndex = 0;
    this.typewriterSpeed = 0.025; // seconds per char
    this.typewriterTimer = 0;
    this.isPageComplete = false;

    this.onComplete = null;
    this.onChirp = null;
    this.avatarRenderer = null;

    // Styling
    this.boxMargin = 28;
    this.boxHeight = 125;
    this.padding = 16;
    this.fontSize = 14;
    this.lineHeight = 18;
    this.fontFamily = "'Nunito', 'Segoe UI', system-ui, sans-serif";
    this.headerFont = "bold 15px 'Fredoka', cursive, system-ui, sans-serif";

    // Singleton cached measurement context (Fixes BUG-15)
    if (!DialogueBox.measureCanvas && typeof document !== 'undefined') {
      DialogueBox.measureCanvas = document.createElement('canvas');
      DialogueBox.measureCtx = DialogueBox.measureCanvas.getContext('2d');
    }
  }

  /**
   * Opens dialogue with automatic word wrapping and multi-page pagination.
   */
  start(speaker, avatar, rawText, options = {}) {
    this.speaker = speaker || 'Narrator';
    this.avatar = avatar || null;
    this.onComplete = options.onComplete || null;
    this.onChirp = options.onChirp || null;
    if (options.avatarRenderer) this.avatarRenderer = options.avatarRenderer;

    // Calculate wrap width based on avatar presence
    const boxW = this.virtualWidth - this.boxMargin * 2;
    const avatarWidth = this.avatar ? 64 : 0;
    const maxTextWidth = boxW - this.padding * 2 - avatarWidth - 40;

    // Word wrap and paginate lines into pages of max 3 lines each
    const lines = this.wrapText(rawText, maxTextWidth);
    this.pages = [];
    const linesPerPage = 3;
    for (let i = 0; i < lines.length; i += linesPerPage) {
      this.pages.push(lines.slice(i, i + linesPerPage).join('\n'));
    }

    this.currentPageIndex = 0;
    this.active = true;
    this.loadPage(0);
  }

  loadPage(index) {
    this.currentPageIndex = index;
    this.currentText = this.pages[index] || '';
    this.displayedText = '';
    this.charIndex = 0;
    this.typewriterTimer = 0;
    this.isPageComplete = false;
  }

  wrapText(text, maxWidth) {
    // Use cached measuring context if available, otherwise fallback
    let ctx = DialogueBox.measureCtx;
    if (!ctx && typeof document !== 'undefined') {
      DialogueBox.measureCanvas = document.createElement('canvas');
      DialogueBox.measureCtx = DialogueBox.measureCanvas.getContext('2d');
      ctx = DialogueBox.measureCtx;
    }

    if (ctx) {
      ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    }

    const paragraphs = text.split('\n');
    const resultLines = [];

    for (const para of paragraphs) {
      const words = para.split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = ctx ? ctx.measureText(testLine).width : testLine.length * 8;

        if (textWidth > maxWidth && currentLine) {
          resultLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        resultLines.push(currentLine);
      }
    }

    return resultLines;
  }

  update(dt, inputActionPressed = false) {
    if (!this.active) return;

    // Typewriter progression
    if (!this.isPageComplete) {
      this.typewriterTimer += dt;
      if (this.typewriterTimer >= this.typewriterSpeed) {
        this.typewriterTimer = 0;
        this.charIndex++;
        this.displayedText = this.currentText.substring(0, this.charIndex);

        if (this.charIndex % 3 === 0 && this.onChirp) {
          this.onChirp();
        }

        if (this.charIndex >= this.currentText.length) {
          this.isPageComplete = true;
          this.displayedText = this.currentText;
        }
      }
    }

    // Advance or Fast-forward on input
    if (inputActionPressed) {
      if (!this.isPageComplete) {
        // Fast forward current page
        this.charIndex = this.currentText.length;
        this.displayedText = this.currentText;
        this.isPageComplete = true;
      } else {
        // Next page or close
        if (this.currentPageIndex < this.pages.length - 1) {
          this.loadPage(this.currentPageIndex + 1);
        } else {
          this.close();
        }
      }
    }
  }

  close() {
    this.active = false;
    this.displayedText = '';
    this.currentText = '';
    this.pages = [];
    this.charIndex = 0;
    this.isPageComplete = false;
    if (this.onComplete) {
      const cb = this.onComplete;
      this.onComplete = null;
      cb();
    }
  }

  render(ctx) {
    if (!this.active) return;

    ctx.save();

    const boxW = this.virtualWidth - this.boxMargin * 2;
    const boxH = this.boxHeight;
    const boxX = this.boxMargin;
    const boxY = this.virtualHeight - boxH - 18;

    // Outer Shadow & Background (100% Solid #0A1610 to eliminate underlying canvas pixel bleed-through)
    ProceduralPrimitives.groundShadow(ctx, boxX + boxW / 2, boxY + boxH / 2 + 4, boxW / 2 + 8, boxH / 2 + 8, 0.4);
    ProceduralPrimitives.roundedRect(ctx, boxX, boxY, boxW, boxH, 14, '#0A1610', '#2ED573', 2);

    let textOffsetX = boxX + this.padding;

    // Draw Speaker Avatar if available
    if (this.avatar) {
      const avatarSize = 56;
      const avatarX = boxX + this.padding;
      const avatarY = boxY + this.padding + 6;

      ProceduralPrimitives.roundedRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 12, '#12251B', '#2ED573', 2);

      // Render Avatar Icon with clean scaling
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(avatarX + 2, avatarY + 2, avatarSize - 4, avatarSize - 4, 10);
      ctx.clip();
      ctx.translate(avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 2);
      if (this.avatarRenderer) {
        this.avatarRenderer(ctx, this.avatar);
      } else {
        this.renderAvatarIcon(ctx, this.avatar);
      }
      ctx.restore();

      textOffsetX += avatarSize + 14;
    }

    // Dynamic Speaker Name Tag Pill Width
    ctx.font = this.headerFont;
    const nameWidth = ctx.measureText ? ctx.measureText(this.speaker).width : this.speaker.length * 9;
    const pillWidth = Math.max(140, nameWidth + 36);
    ProceduralPrimitives.roundedRect(ctx, textOffsetX - 4, boxY + 10, pillWidth, 24, 6, '#182C22', '#FFD93D', 1);
    ctx.fillStyle = '#FFD93D';
    ctx.fillText(this.speaker, textOffsetX + 10, boxY + 27);

    // Multi-line Text Rendering
    ctx.fillStyle = '#E8FFF5';
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const lines = this.displayedText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], textOffsetX, boxY + 54 + i * this.lineHeight);
    }

    // Prompt Indicator
    ctx.fillStyle = '#94A3B8';
    ctx.font = "bold 11px 'Fredoka', sans-serif";
    const promptLabel =
      this.currentPageIndex < this.pages.length - 1 ? '▶ Press E to Continue' : '✖ Press E to Close';
    ctx.fillText(promptLabel, boxX + boxW - 145, boxY + boxH - 10);

    ctx.restore();
  }

  renderAvatarIcon(ctx, avatarType) {
    ctx.save();
    if (avatarType === 'snail') {
      // Barnaby the Snail authentic sprite portrait (scaled down)
      ctx.scale(0.85, 0.85);
      // Shell
      ctx.fillStyle = '#D980FA';
      ctx.strokeStyle = '#8854D0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-4, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Shell swirl
      ctx.strokeStyle = '#F368E0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-4, 0, 9, 0, Math.PI * 1.5);
      ctx.stroke();
      // Chubby Foot
      ctx.fillStyle = '#BDC581';
      ctx.strokeStyle = '#8395A7';
      ctx.beginPath();
      ctx.ellipse(4, 12, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Eye stalks
      ctx.fillStyle = '#FFE8D6';
      ctx.strokeStyle = '#8395A7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(4, -18, 3, 10, 2);
      ctx.roundRect(10, -16, 3, 8, 2);
      ctx.fill();
      ctx.stroke();
      // Eyeballs & Pupils
      ctx.beginPath();
      ctx.arc(5.5, -20, 3.5, 0, Math.PI * 2);
      ctx.arc(11.5, -18, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(6, -20, 1.8, 0, Math.PI * 2);
      ctx.arc(12, -18, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Scarf
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.roundRect(2, 4, 10, 4, 2);
      ctx.fill();
    } else if (avatarType === 'hedgehog') {
      // Bramble the Hedgehog authentic sprite portrait with miner goggles
      ctx.scale(0.85, 0.85);
      // Quills
      ctx.fillStyle = '#5C3D2E';
      ctx.strokeStyle = '#2E1911';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Face
      ctx.fillStyle = '#FDE68A';
      ctx.strokeStyle = '#1E293B';
      ctx.beginPath();
      ctx.roundRect(-8, -8, 20, 18, [8, 12, 6, 6]);
      ctx.fill();
      ctx.stroke();
      // Snout & Nose
      ctx.beginPath();
      ctx.moveTo(8, -2);
      ctx.lineTo(16, 2);
      ctx.lineTo(8, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(16, 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // Brass Goggles
      ctx.fillStyle = '#D97706';
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(2, -8, 5, 0, Math.PI * 2);
      ctx.arc(9, -8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(2, -8, 3.2, 0, Math.PI * 2);
      ctx.arc(9, -8, 3.2, 0, Math.PI * 2);
      ctx.fill();
      // Eye & Cheek
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(5, -1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.beginPath();
      ctx.arc(3, 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (avatarType === 'owl') {
      // Pip the Owl authentic sprite portrait with golden spectacles
      ctx.scale(0.85, 0.85);
      // Body mantle
      ctx.fillStyle = '#1E1B4B';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-14, -20, 28, 36, [14, 14, 10, 10]);
      ctx.fill();
      ctx.stroke();
      // Breast down
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tufted Eyebrows
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(-8, -16);
      ctx.lineTo(-14, -26);
      ctx.lineTo(-4, -18);
      ctx.moveTo(8, -16);
      ctx.lineTo(14, -26);
      ctx.lineTo(4, -18);
      ctx.fill();
      // Golden Spectacles
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-5, -10, 5.5, 0, Math.PI * 2);
      ctx.arc(5, -10, 5.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.arc(-5, -10, 3.8, 0, Math.PI * 2);
      ctx.arc(5, -10, 3.8, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(-2, -6);
      ctx.lineTo(2, -6);
      ctx.lineTo(0, -2);
      ctx.closePath();
      ctx.fill();
    } else if (avatarType === 'spirit' || avatarType === 'shrine') {
      // Great Elder Tree Spirit authentic glowing avatar
      ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22C55E';
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-3, -3, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ProceduralPrimitives.circle(ctx, 0, 0, 14, '#FFD93D', '#F59E0B', 2);
    }
    ctx.restore();
  }
}



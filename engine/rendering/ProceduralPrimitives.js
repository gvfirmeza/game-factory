/**
 * Procedural visual shape primitives for 2D Canvas rendering.
 */
export const ProceduralPrimitives = {
  roundedRect(ctx, x, y, width, height, radius, fill = null, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      // Fallback for older canvas implementations
      const r = typeof radius === 'number' ? radius : (radius[0] || 0);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  circle(ctx, x, y, radius, fill = null, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  ellipse(ctx, x, y, radiusX, radiusY, rotation = 0, fill = null, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.1, radiusX), Math.max(0.1, radiusY), rotation, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  polygon(ctx, points, fill = null, stroke = null, lineWidth = 1) {
    if (!points || points.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  groundShadow(ctx, x, y, radiusX, radiusY, opacity = 0.18) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.1, radiusX), Math.max(0.1, radiusY), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  highlight(ctx, x, y, radiusX, radiusY, opacity = 0.4) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.1, radiusX), Math.max(0.1, radiusY), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  linearGradient(ctx, x1, y1, x2, y2, colorStops) {
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    for (const [offset, color] of colorStops) {
      grad.addColorStop(offset, color);
    }
    return grad;
  }
};

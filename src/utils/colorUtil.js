export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function hexToRgbaString(hex, alpha) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentFromStr(numStr, percent) {
  var num = Math.max(0, parseInt(numStr, 10));
  return percent
    ? Math.floor((255 * Math.min(100, num)) / 100)
    : Math.min(255, num);
}

export function rgbStringToHex(rgb) {
  var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
  var result,
    r,
    g,
    b,
    hex = '';
  if ((result = rgbRegex.exec(rgb))) {
    r = componentFromStr(result[1], result[2]);
    g = componentFromStr(result[3], result[4]);
    b = componentFromStr(result[5], result[6]);

    hex = '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  return hex;
}

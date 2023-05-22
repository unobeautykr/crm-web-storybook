function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function replaceStyle(style) {
  const rgbRe = /(rgb\(.*?\))/g;
  let match;
  let hexes = [];
  while ((match = rgbRe.exec(style))) {
    // eslint-disable-next-line no-unused-vars
    const [_, r, g, b] = /(\d+), (\d+), (\d+)/.exec(match[1]);
    const hex = rgbToHex(Number(r), Number(g), Number(b));

    hexes.push(hex);
  }

  let result = style;
  for (const hex of hexes) {
    result = result.replace(/rgb\(.*?\)/, hex);
  }

  return result;
}

function changeStyle(node) {
  if (node.hasAttribute && node.hasAttribute('style')) {
    node.setAttribute('style', replaceStyle(node.getAttribute('style')));
  }
  if (node.hasChildNodes()) {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      changeStyle(children[i]);
    }
  }
}

export function toHexColorHtml(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  changeStyle(template.content);

  return template.innerHTML;
}

const vendors = [
  null,
  'webkit',
  'Moz',
  'O',
  'ms',
];
const ele = document.createElement('div');
// eslint-disable-next-line
let vendorSupport = false;
// eslint-disable-next-line
let transformProperty = null;
// eslint-disable-next-line
let transformOriginProperty = null;

for (let i = 0, l = vendors.length; i < l; i += 1) {
  if (vendors[i]) {
    transformProperty = `${vendors[i]}Transform`;
    transformOriginProperty = `${vendors[i]}TransformOrigin`;
  } else {
    transformProperty = 'transform';
    transformOriginProperty = 'transformOrigin';
  }
  if (ele.style[transformProperty] !== undefined) {
    vendorSupport = true;
    break;
  }
}

export { vendorSupport, transformProperty, transformOriginProperty };

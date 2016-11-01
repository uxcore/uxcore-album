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

for (let i = 0, l = vendors.length; i < l; i += 1) {
  if (vendors[i]) {
    transformProperty = `${vendors[i]}Transform`;
  } else {
    transformProperty = 'transform';
  }
  if (ele.style[transformProperty] !== undefined) {
    vendorSupport = true;
    break;
  }
}

export { vendorSupport, transformProperty };

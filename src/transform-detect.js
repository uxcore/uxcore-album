const vendors = [
  null,
  'webkit',
  'Moz',
  'O',
  'ms',
];
const ele = document.createElement('div');
let vendorSupport = false;
let transformProperty = null;

for (let i = 0, l = vendors.length; i < l; i += 1) {
  if (vendors[i]) {
    transformProperty = `${vendors[i]}Transform`;
  } else {
    transformProperty = `transform`;
  }
  if (ele.style[transformProperty] !== undefined) {
    vendorSupport = true;
    break;
  }
}

export { vendorSupport, transformProperty };

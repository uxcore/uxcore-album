let vendorSupport = false;
let transformProperty = null;
let transformOriginProperty = null;

if (typeof document !== 'undefined') {
  const vendors = [
    null,
    'webkit',
    'Moz',
    'O',
    'ms',
  ];
  const ele = document.createElement('div');
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
}

export default { vendorSupport, transformProperty, transformOriginProperty };

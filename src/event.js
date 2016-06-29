const event = {};

if (window.addEventListener) {
  event.on = (node, type, listener) => {
    node.addEventListener(type, listener, false);
  };
  event.off = (node, type, listener) => {
    node.removeEventListener(type, listener, false);
  };
} else {
  event.on = (node, type, listener) => {
    node.attachEvent(`on${type}`, listener);
  };
  event.off = (node, type, listener) => {
    node.detachEvent(`on${type}`, listener);
  };
}

export default event;

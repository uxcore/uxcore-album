const scriptElement = document.getElementsByTagName('script')[0];
const prevColor = scriptElement.style.color;
try {
  scriptElement.style.color = 'rgba(0, 0, 0, .8)';
} catch (e) {
  console.error(e.stack);
}

const supportRGBA = scriptElement.style.color !== prevColor;
scriptElement.style.color = prevColor;

export default supportRGBA;

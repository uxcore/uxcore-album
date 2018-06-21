let supportRGBA = true;

if (typeof document !== 'undefined') {
  const scriptElement = document.getElementsByTagName('script')[0];

  if (scriptElement) {
    const prevColor = scriptElement.style.color;
    try {
      scriptElement.style.color = 'rgba(0, 0, 0, .8)';
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.stack);
    }

    supportRGBA = (scriptElement.style.color !== prevColor);
    scriptElement.style.color = prevColor;
  }
}


export default { supportRGBA };

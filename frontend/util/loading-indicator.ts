export function loadingIndicator(percent : number) : void {
  const indicator = document.getElementsByClassName("v-loading-indicator")[0] as HTMLElement;
  if (percent > 0) {
    indicator.style.display = "block";
    indicator.style.opacity = "1";
    indicator.style.animation = "unset";
    indicator.style.width = percent+"%";
    indicator.ariaLive = 'assertive';
    const label = document.createElement('label');
    label.innerText = 'Loading '+percent+"%";
    label.id = 'indicator-label'
    label.style.top = '-1000px';
    label.style.left = '-1000px';
    label.style.position = 'absolute';
    label.role = 'alert';
    indicator.innerText = '';
    indicator.appendChild(label);
    indicator.setAttribute('aria-labelledby','indicator-label');
  } else {
    indicator.style.display = "none";
  }
}

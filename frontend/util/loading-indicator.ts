export function loadingIndicator(percent : number) : void {
  const indicator = document.getElementsByClassName("v-loading-indicator")[0] as HTMLElement;
  if (percent > 0) {
    indicator.style.display = "block";
    indicator.style.opacity = "1";
    indicator.style.animation = "unset";
    indicator.style.width = percent+"%";
  } else {
    indicator.style.display = "none";
  }
}

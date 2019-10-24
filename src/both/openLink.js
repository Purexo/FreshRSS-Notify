export default function openLink(url, active=false) {
  browser.tabs.create({active, url}).catch(console.error);
}
function openNav() {
    document.getElementById("side-nav").style.width =  getComputedStyle(document.documentElement).getPropertyValue('--expanded-nav-width'); // "450px";
}

function closeNav() {
    document.getElementById("side-nav").style.width = "0";
}

function showSection(id) {
//document.getElementById(id).style.display = 'inline-block';
  document.getElementById(id).style.visibility = 'visible';
  document.getElementById(id).style.opacity = 1;
  document.getElementById(id).style.height = 'auto';
}

function hideSection(id) {
//document.getElementById(id).style.display = 'none';
  document.getElementById(id).style.visibility = 'hidden';
  document.getElementById(id).style.opacity = 0;
  document.getElementById(id).style.height = 0;
}

const COLLAPSED_LINE = "&#9658;&nbsp;";
const EXPANDED_LINE = "&#9660;&nbsp;";

function showHideSection(obj, id) {
  let innerSpan = obj.querySelector('.expand-collapse');
  if (document.getElementById(id).style.visibility === 'visible') {  // Then hide it
    innerSpan.innerHTML = COLLAPSED_LINE;
    hideSection(id);
  } else { // Show it
    innerSpan.innerHTML = EXPANDED_LINE;
    showSection(id);
  }
}

function showPage(pageURL, frameId) {
  document.getElementById(frameId).src = pageURL;
}
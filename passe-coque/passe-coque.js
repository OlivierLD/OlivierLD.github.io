/**
 * Oho !
 */
const DEFAULT_LANG = "FR";
let currentLang = DEFAULT_LANG; // Init value

let showAboutDialog = () => {
    let aboutDialog = document.getElementById("about-dialog");
    if (aboutDialog.show !== undefined) {
      aboutDialog.show();
    } else {
      alert(NO_DIALOG_MESSAGE);
      aboutDialog.style.display = 'inline';
    }
};

let closeAboutDialog = () => {
    let aboutDialog = document.getElementById("about-dialog");
    if (aboutDialog.close !== undefined) {
      aboutDialog.close();
    } else {
      // alert(NO_DIALOG_MESSAGE);
      aboutDialog.style.display = 'none';
    }
};

let openNav = () => {
	document.getElementById("side-nav").style.width =  getComputedStyle(document.documentElement).getPropertyValue('--expanded-nav-width'); // "450px";
};

let closeNav = () => {
	document.getElementById("side-nav").style.width = "0";
};

let showSection = (id) => {
	//document.getElementById(id).style.display = 'inline-block';
	document.getElementById(id).style.visibility = 'visible';
	document.getElementById(id).style.opacity = 1;
	document.getElementById(id).style.height = 'auto';
};

let hideSection = (id) => {
	//document.getElementById(id).style.display = 'none';
	document.getElementById(id).style.visibility = 'hidden';
	document.getElementById(id).style.opacity = 0;
	document.getElementById(id).style.height = 0;
};


const COLLAPSED_LINE = "&#9658;&nbsp;";
const EXPANDED_LINE = "&#9660;&nbsp;";

let showHideSection = (obj, id) => {
	let innerSpan = obj.querySelector('.expand-collapse');
	if (document.getElementById(id).style.visibility === 'visible') {  // Then hide it
		innerSpan.innerHTML = COLLAPSED_LINE;
		hideSection(id);
	} else { // Show it
		innerSpan.innerHTML = EXPANDED_LINE;
		showSection(id);
	}
};

let clack = (origin) => {
	console.log(`Click on ${origin.innerText}, id ${origin.id}`);

	let contentName = `${origin.id}_${currentLang}.html`;
	let contentPlaceHolder = document.getElementById("current-content");
	if (origin.id === "62") {
		contentName = "carrousel.html";
	}

	fetch(contentName)
            .then(response => {  // Warning... the NOT_FOUND error lands here, apparently.
                console.log(`Data Response: ${response.status} - ${response.statusText}`);
				if (response.status !== 200) { // There is a problem...
					contentPlaceHolder.innerHTML = `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>&Ccedil;a vient...</b>`;
				} else {
					response.text().then(doc => {
						console.log(`Code data loaded, length: ${doc.length}.`);
						// Some specific cases here
						if (origin.id === "1") { // Move this higher. No need to load 1_xx.html...
							document.location.reload();
						} else if (origin.id === "23") {
							document.getElementById("dialog-content").innerHTML = doc;
							showAboutDialog();
						} else {
							contentPlaceHolder.innerHTML = doc;
                            if (origin.id === "22") {
                                showSlides(currentSlide);
                            }
						}
					});
				}
            },
            (error, errmess) => {
                console.log("Ooch");
                let message;
                if (errmess) {
                    let mess = JSON.parse(errmess);
                    if (mess.message) {
                        message = mess.message;
                    }
                }
                console.debug("Failed to get code data..." + (error ? JSON.stringify(error, null, 2) : ' - ') + ', ' + (message ? message : ' - '));
				// Plus tard...
				contentPlaceHolder.innerHTML = "<b>&Ccedil;a vient...</b>";
            });



}

let updateMenu = () => { // Multilang aspect.
	document.getElementById("home-label").innerHTML = (currentLang === "FR" ? "Accueil" : "Home");

	document.getElementById("2").innerHTML = (currentLang === "FR" ? "Qui sommes-nous&nbsp;?" : "Who we are");
	document.getElementById("21").innerHTML = (currentLang === "FR" ? "Passe-Coque, c'est quoi&nbsp;?" : "Passe-Coque, what's that?");
	document.getElementById("22").innerHTML = (currentLang === "FR" ? "Notre &eacute;quipe" : "Our team");
	document.getElementById("23").innerHTML = (currentLang === "FR" ? "L'association" : "The association");
	document.getElementById("24").innerHTML = (currentLang === "FR" ? "La SCIC : Eco-village Nautique" : "The SCIC: Nautical Eco-village");

	document.getElementById("3").innerHTML = (currentLang === "FR" ? "Nos actions" : "Our actions");
	document.getElementById("31").innerHTML = (currentLang === "FR" ? "Transmettre" : "Transmit");
	document.getElementById("32").innerHTML = (currentLang === "FR" ? "R&eacute;nover" : "Refit");
	document.getElementById("33").innerHTML = (currentLang === "FR" ? "Partager" : "Share");
	document.getElementById("34").innerHTML = (currentLang === "FR" ? "Nos formations" : "Our trainings");
	document.getElementById("35").innerHTML = (currentLang === "FR" ? "Associations partenaires" : "Partner associations");

	document.getElementById("4").innerHTML = (currentLang === "FR" ? "La flotte" : "The fleet");
	document.getElementById("41").innerHTML = (currentLang === "FR" ? "Les bateaux" : "The boats");
	document.getElementById("42").innerHTML = (currentLang === "FR" ? "Les projets" : "The projects");
	document.getElementById("43").innerHTML = (currentLang === "FR" ? "Le boat-club" : "The boat-club");

	document.getElementById("5").innerHTML = (currentLang === "FR" ? "Nous rejoindre" : "Join us");
	document.getElementById("51").innerHTML = (currentLang === "FR" ? "Faire un don" : "Make a donation");
	document.getElementById("52").innerHTML = (currentLang === "FR" ? "Inverstir dans la SCIC" : "Invest in the SCIC");
	document.getElementById("53").innerHTML = (currentLang === "FR" ? "Votre projet associatif" : "Your association project");

	document.getElementById("6").innerHTML = (currentLang === "FR" ? "En savoir plus" : "Know more");
	document.getElementById("61").innerHTML = (currentLang === "FR" ? "Contact" : "Contact");
	document.getElementById("62").innerHTML = (currentLang === "FR" ? "Actualit&eacute;s" : "News");
	document.getElementById("63").innerHTML = (currentLang === "FR" ? "Visiter le chantier" : "Visit the shipyard");
	document.getElementById("64").innerHTML = (currentLang === "FR" ? "Partenaires" : "Partners");
};

let switchLanguage = () => {
	let flagElement = document.getElementById("lang-flag");
	if (currentLang === "FR") { // Then switch to EN
		flagElement.src = "./france.gif";
		flagElement.alt = "Drapeau français";
		flagElement.title = "En français";
		currentLang = "EN";
	} else {
		flagElement.src = "us_uk_flag.png"; // "./usa.gif";
		flagElement.alt = "US Flag";
		flagElement.title = "Switch to English";
		currentLang = "FR";
	}
	// Le reste...
	updateMenu();
};

const BG_IMAGES = 
/*[
	"../backgrounds/la.licorne.jpeg",
	"../backgrounds/next_wave.jpg"
];*/

/*[ "jeff.01/DSCF2058.jpg",        "jeff.01/IMG_0319.jpg",        "jeff.01/IMG_6647.jpg",        "jeff.01/IMG_8100.jpg",       "jeff.01/P1010473.jpg",
  "jeff.01/DSC_0519.jpg",        "jeff.01/IMG_0336.jpg",        "jeff.01/IMG_6662.jpg",        "jeff.01/IMG_9441.jpg",
  "jeff.01/IMG_0207.jpg",        "jeff.01/IMG_0486.jpg",        "jeff.01/IMG_6663.jpg",        "jeff.01/IMG_9893.jpg",
  "jeff.01/IMG_0218.jpg",        "jeff.01/IMG_1082.jpg",        "jeff.01/IMG_8034.jpg",        "jeff.01/P1000587.jpg" ]; */

[ "./photos.michel.01/quille.coraxy.jpg",
  "./photos.michel.02/01.jpg",
  "./photos.michel.02/02.jpg",
  "./photos.michel.02/03.jpg" ];  

const BG_INTERVAL = 10000; // in ms

let current_bg_image_index = 0;
let bgAnimation;

let startBGAnimation = (cb) => {
	if (cb) {
		if (!cb.checked) {
			clearInterval(bgAnimation);
			bgAnimation = null;
		} else {
			bgAnimation = setInterval(() => {
				current_bg_image_index += 1;
				if (current_bg_image_index >= BG_IMAGES.length) {
					current_bg_image_index = 0;
				}
				document.getElementById("bg-image").src = BG_IMAGES[current_bg_image_index];
			}, BG_INTERVAL); // in ms.
		}
	} else { // Previous behavior
		if (bgAnimation !== undefined) {
		clearInterval(bgAnimation);
		}
		// setTimeout(darkenBackground, 1);
		bgAnimation = setInterval(() => {
			current_bg_image_index += 1;
			if (current_bg_image_index >= BG_IMAGES.length) {
				current_bg_image_index = 0;
			}
			document.getElementById("bg-image").src = BG_IMAGES[current_bg_image_index];
		}, BG_INTERVAL); // in ms.
	}
};

// Left-right swipe gesture management on the slides
let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }
    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    // most significant
    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Left-right
        if (xDiff > 0) {
        /* left swipe */
        plusSlides(1);
        } else {
        /* right swipe */
        plusSlides(-1);
        }
    } else { // Up-Down, not needed here (yet...)
        if (yDiff > 0) {
        /* up swipe */
        } else {
        /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
}

// const BG_INTERVAL = 2 * 60 * 1000; // in ms. 
let secondLeft = BG_INTERVAL / 1000;

const ABOUT_DATA = [ // Use with innerHTML
    "Raspberry Pi", 
    "Web&nbsp;Components", 
    "Java&nbsp;&amp;&nbsp;Processing", 
    "HTML5,&nbsp;CSS3,&nbsp;ES6,&nbsp;NodeJS", 
    "Python", 
    "Arduino&nbsp;&amp;&nbsp;Co"
];
let aboutDiv = undefined;

let currentAboutIndex = 0;
let currentLeftMargin = 0;

function leftNewContent() {
    if (currentLeftMargin > 0) {
        currentLeftMargin -= 1;
        aboutDiv.style.marginLeft = `${currentLeftMargin}%`;
        setTimeout(leftNewContent, 10);
    }
}
function leftOldContent() {
    if (currentLeftMargin > -100) {
        currentLeftMargin -= 1;
        aboutDiv.style.marginLeft = `${currentLeftMargin}%`;
        setTimeout(leftOldContent, 10);
    } else {
        currentAboutIndex += 1;
        if (currentAboutIndex > (ABOUT_DATA.length - 1)) {
            currentAboutIndex = 0;
        }
        aboutDiv.innerHTML = ABOUT_DATA[currentAboutIndex];
        currentLeftMargin = 100;
        setTimeout(leftNewContent, 10);
    }
}

let auto = false;

function manageClick(cb) {
    auto = cb.checked;
    if (auto) {
        showSlides(slideIndex);
    }
}

let slideIndex = 1;
// showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("the-slides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) { // Hide them all
        //  slides[i].style.display = "none";
        slides[i].classList.remove("visible-slide");
    }

    if (!auto) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
    //    slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add("visible-slide"); // Show active one

        dots[slideIndex - 1].className += " active";
    } else { // Auto

        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
    //    slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add("visible-slide");

        dots[slideIndex - 1].className += " active";
        let TEN_SEC = 10000;
        setTimeout(showSlides, TEN_SEC);
    }
}


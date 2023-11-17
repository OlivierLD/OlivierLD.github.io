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

var currentContext = "1"; // Default, Home page.

let clack = (origin) => {
    let originId = '';
    if (typeof(origin) === 'string') {
        originId = origin.replace('_', '');
    } else {
        console.log(`Click on ${origin.innerText}, id ${origin.id}`);
        originId = origin.id.replace('_', '');
    }
    currentContext = originId;

    if (originId === '11') {
        makeCode(document.location.href);
        return;
    } else {
        document.getElementById("qrcode").style.display = 'none'; // Improve this ?..
    }

	let contentName = `${originId}_${currentLang}.html`;
    // Specific content rule(s)
	if (originId === "62") { 
		contentName = "carrousel.html";
	} else if (originId === "22" || originId === "23") { // Menu 2, special management, see below (ONE page only)
        contentName = `21_${currentLang}.html`; // 21, 22 & 23, same doc, different anchor (hashtag).
	// } else if (originId === "32" || originId === "33") {
    //    contentName = `31_${currentLang}.html`; // 31, 32 & 33, same doc, different anchor (hashtag).
    }
	let contentPlaceHolder = document.getElementById("current-content");
    
	fetch(contentName)
            .then(response => {  // Warning... the NOT_FOUND error lands here, apparently.
                console.log(`Data Response: ${response.status} - ${response.statusText}`);
				if (response.status !== 200) { // There is a problem...
					contentPlaceHolder.innerHTML = `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>&Ccedil;a vient...</b>`;
				} else {
					response.text().then(doc => {
						console.log(`Code data loaded, length: ${doc.length}.`);
						// Some specific cases here
						/* if (origin.id === "1") { // Move this higher. No need to load 1_xx.html ?..
							document.location.reload();
						} else */ 
                        if (false && originId === "23") { // Not used, an example of a dialog. Content inserted in the <dialog>
							document.getElementById("dialog-content").innerHTML = doc;
							showAboutDialog();
						} else {
							contentPlaceHolder.innerHTML = doc;
                            if (false && originId === "22") {  // Not used.
                                showSlides(currentSlide);
                            } else if (originId === "21" || originId === "22" || originId === "23") { // Menu 2, One page only, with anchors.
                                window.setTimeout(() => {
                                    const overflow = document.getElementById('action-container-2');
                                    let hashtag = (originId === "21") ? '01' : ((originId === "22") ? '02' : '03');
                                    const anchor = document.querySelector(`a[name='${hashtag}']`);
                                    
                                    const rectOverflow = overflow.getBoundingClientRect();
                                    const rectAnchor = anchor.getBoundingClientRect();
    
                                        // Set the scroll position of the overflow container
                                    overflow.scrollTop = rectAnchor.top - rectOverflow.top;
                                    console.log(`Origin: ${originId}: scrolltop: ${overflow.scrollTop}`);
                                }, 200);
                                console.log("Now scrolling.")
                            // } else if (originId === "31" || originId === "32" || originId === "33") {
                            //     const overflow = document.getElementById('action-container');
                            //     let hashtag = (originId === "31") ? '01' : ((originId === "32") ? '02' : '03');
                            //     const anchor = document.querySelector(`a[name='${hashtag}']`);
                                
                            //     const rectOverflow = overflow.getBoundingClientRect();
                            //     const rectAnchor = anchor.getBoundingClientRect();

                            //     // window.setTimeout(() => {
                            //         // Set the scroll position of the overflow container
                            //         overflow.scrollTop = rectAnchor.top - rectOverflow.top;
                            //         console.log("Now Scrolling !");
                            //     //}, 1000);
                            //     // console.log("Scrolling !");
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
    document.querySelectorAll("#home-label").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Accueil" : "Home"));

    // "_11", Qr Code, no update needed.

	document.querySelectorAll("#_2").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Qui sommes-nous&nbsp;?&nbsp;" : "Who we are&nbsp;"));
	document.querySelectorAll("#_21").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Passe-Coque, c'est quoi&nbsp;?" : "Passe-Coque, what's that?"));
	document.querySelectorAll("#_22").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Notre &eacute;quipe" : "Our team"));
	document.querySelectorAll("#_23").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Projet : Eco-village Nautique" : "Project: Nautical Eco-village"));

	document.querySelectorAll("#_3").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Nos actions&nbsp;" : "Our actions&nbsp;"));
	document.querySelectorAll("#_31").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Transmettre" : "Transmitting"));
	document.querySelectorAll("#_32").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "R&eacute;nover" : "Refitting"));
	document.querySelectorAll("#_33").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Partager" : "Sharing"));
	// document.querySelectorAll("#_34").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Formations" : "Trainings"));
	// document.querySelectorAll("#_35").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Partenaires" : "Partners"));

	document.querySelectorAll("#_4").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "La flotte&nbsp;" : "The fleet&nbsp;"));
	document.querySelectorAll("#_41").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Les bateaux" : "The boats"));     // Unused
	document.querySelectorAll("#_42").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Les projets" : "The projects"));  // Unused

	document.querySelectorAll("#_5").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Nous soutenir&nbsp;" : "Support us&nbsp;"));
	document.querySelectorAll("#_51").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Adh&eacute;rer" : "Join us"));
	document.querySelectorAll("#_52").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Faire un don" : "Make a donation"));
	document.querySelectorAll("#_53").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Inverstir dans l'Eco-Village" : "Invest in the Eco-Village"));

	document.querySelectorAll("#_6").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "En savoir plus&nbsp;" : "Know more&nbsp;"));
	document.querySelectorAll("#_61").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Contact" : "Contact"));
	document.querySelectorAll("#_62").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "On parle de nous" : "We're in the news"));
	document.querySelectorAll("#_63").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Visiter le chantier" : "Visit the shipyard"));
	document.querySelectorAll("#_64").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Partenaires" : "Partners"));
};

let switchLanguage = () => {
    if (currentLang === "FR") { // Then switch to EN
        document.querySelectorAll("#lang-flag").forEach(flagElement => {
            flagElement.src = "./france.gif";
            flagElement.alt = "Drapeau français";
            flagElement.title = "En français";
        });
        currentLang = "EN";
    } else {
        document.querySelectorAll("#lang-flag").forEach(flagElement => {
            flagElement.src = "us_uk_flag.png"; // "./usa.gif";
            flagElement.alt = "US Flag";
            flagElement.title = "Switch to English";
        });
        currentLang = "FR";
    }
	// Le reste...
	updateMenu();

    // Update currently displayed content
    let newId = `_${currentContext}`;
    let el = document.createElement("div");
	el.id = newId;
	clack(el);

    clack(el);
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

// [ "./photos.michel.01/quille.coraxy.jpg",
//   "./photos.michel.02/01.jpg",
//   "./photos.michel.02/02.jpg",
//   "./photos.michel.02/03.jpg" ];  

[ "./images/houat.jpg",
  "./images/mouillage.01.jpg",
  "./images/mouillage.02.jpg",
  "./images/sunset.jpg",
  "./images/evo.png" ];  

const BG_INTERVAL = 5000; // in ms

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
            try {
                let slideShowContainer = document.getElementById("bg-image");
                if (slideShowContainer) {
			        slideShowContainer.src = BG_IMAGES[current_bg_image_index];
                } // else, on another page...
            } catch (err) {
                console.log(`Managed error ${JSON.stringify(err)} (${err})`);
            }
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

let sendEmail = (first, last) => {
    console.log(`Sending email from ${first}, ${last}`);
    let sender = `Message from ${first} ${last}\n`;
    window.open(`mailto:contact@passeurdecoute.fr?subject=${encodeURI(sender)}`);
};

let getQueryParameterByName = (name, url) => {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

let qrcode;

let makeCode = (url) => {    
	if (url === undefined) {
		url = document.location.href;
	} 
    console.log(`QR Code for ${url}`);
	let docLoc = url;
	let toDisplay = docLoc; // .substring(0, docLoc.lastIndexOf('/')) + "/" + url; // document.location + url;

  	qrcode.makeCode(toDisplay);
    // qrcode.style.display = 'block';
    document.getElementById("qrcode").style.display = 'block'; // Show it ! (Hidden otherwise)
};

const DIALOG_OPTION = true;

// Mouse behavior, on some specific pages (or snippets)
let clickOnTxPix = (origin) => {
    console.log(`Click on ${origin.id}`);
    // TODO Set the content
    let dynamicContentContainer = DIALOG_OPTION ? document.getElementById("dialog-tx-content") : document.getElementById("info-tx");
    let contentName = `${origin.id}_${currentLang}.html`; // Like 'tx-01_FR.html'
    fetch(contentName)
        .then(response => {  // Warning... the NOT_FOUND error lands here, apparently.
            console.log(`Data Response: ${response.status} - ${response.statusText}`);
            if (response.status !== 200) { // There is a problem...
                dynamicContentContainer.innerHTML = `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>&Ccedil;a vient...</b>`;
            } else {
                response.text().then(doc => {
                    console.log(`${contentName} code data loaded, length: ${doc.length}.`);
                    dynamicContentContainer.innerHTML = doc;
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
            dynamicContentContainer.innerHTML = `<b>${contentName} ${currentLang === 'FR' ? ' introuvable...' : ' not found...'}</b>`;
        });

    // dynamicContentContainer.innerHTML = content;
    if (DIALOG_OPTION) {
        showInfoTxDialog();
    } else {
        dynamicContentContainer.style.display = 'block';
    }
};

let mouseOnTxPix = (origin) => {
    console.log(`Mouse on ${origin.id}`);
    // origin.title = (currentLang === 'FR') ? "Vas-y, clique !" : "Click for more.";
    let tooltipHolder = origin.querySelector('span');
    if (false && tooltipHolder) {
        tooltipHolder.innerHTML = (currentLang === 'FR') ? "Vas-y,<br/>clique sur la photo !" : "Click the picture<br/>for more.";
    } else { // Just in case no <span> child is found...
        origin.title = (currentLang === 'FR') ? "Cliquer pour plus d'info" : "Click for more.";
        origin.style.cursor = 'pointer';
        // let image = origin.querySelector('img');
        // if (image) {
        //     image.style.opacity = 1.0;
        // }
    }
};

let mouseOnRftPix = (origin) => {
};

let clickOnBoatPix = (origin) => {
    console.log(`Click on ${origin.id}`);
    // TODO Set the content
    let dynamicContentContainer = DIALOG_OPTION ? document.getElementById("dialog-tx-content") : document.getElementById("info-tx");
    let contentName = `${origin.id}_${currentLang}.html`; // Like 'tx-01_FR.html'
    fetch(contentName)
        .then(response => {  // Warning... the NOT_FOUND error lands here, apparently.
            console.log(`Data Response: ${response.status} - ${response.statusText}`);
            if (response.status !== 200) { // There is a problem...
                dynamicContentContainer.innerHTML = `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>&Ccedil;a vient...</b>`;
            } else {
                response.text().then(doc => {
                    console.log(`${contentName} code data loaded, length: ${doc.length}.`);
                    dynamicContentContainer.innerHTML = doc;
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
            dynamicContentContainer.innerHTML = `<b>${contentName} ${currentLang === 'FR' ? ' introuvable...' : ' not found...'}</b>`;
        });

    // dynamicContentContainer.innerHTML = content;
    if (DIALOG_OPTION) {
        showInfoTxDialog();
    } else {
        dynamicContentContainer.style.display = 'block';
    }
};

let showInfoTxDialog = () => {
    let infoTxDialog = document.getElementById("info-tx-dialog");
    if (infoTxDialog.show !== undefined) {
        infoTxDialog.show();
    } else {
      alert(NO_DIALOG_MESSAGE);
      infoTxDialog.style.display = 'inline';
    }
};

let closeInfoTxDialog = () => {
    let infoTxDialog = document.getElementById("info-tx-dialog");
    if (infoTxDialog.close !== undefined) {
        infoTxDialog.close();
    } else {
      // alert(NO_DIALOG_MESSAGE);
      infoTxDialog.style.display = 'none';
    }
};

let aboutSomeone = (who) => {
    console.log(`About ${who.id}`);
    let aboutDialog = document.getElementById("about-dialog");
    let dialogContent = document.getElementById("dialog-content");

    let contentName = `about_${who.id}_${currentLang}.html`;

    fetch(contentName)
        .then(response => {  // Warning... the NOT_FOUND error lands here, apparently.
            console.log(`Data Response: ${response.status} - ${response.statusText}`);
            if (response.status !== 200) { // There is a problem...
                dialogContent.innerHTML = `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>&Ccedil;a vient...</b>`;
            } else {
                response.text().then(doc => {
                    console.log(`${contentName} code data loaded, length: ${doc.length}.`);
                    dialogContent.innerHTML = doc;
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
            dialogContent.innerHTML = `<b>${contentName} ${currentLang === 'FR' ? ' introuvable...' : ' not found...'}</b>`;
        });

    if (aboutDialog.show !== undefined) {
        aboutDialog.show();
    } else {
      // alert(NO_DIALOG_MESSAGE);
      aboutDialog.style.display = 'inline';
    }
};

const CLUB = 2;
const OLD_BOAT = 3;
const TO_GRAB = 4;

// TODO See if there is a better place for this hard-coded list...
const THE_FLEET = [
    {
        name: "Eh'Tak",
        id: "eh-tak",
        pix: "./images/boats/eh-tak.jpg",
        type: "Shipman 28",
        category: CLUB
    },
    {
        name: "Pordin-Nancq",
        id: "pordin-nancq",
        pix: "./images/boats/pordin.jpg",
        type: "Carter 37",
        category: OLD_BOAT
    },
    {
        name: "Jehu",
        id: "jehu",
        pix: "./images/boats/jehu.jpg",
        type: "J24",
        category: TO_GRAB
    },
    {
        name: "Manu Aviri",
        id: "manu-aviri",
        pix: "./images/boats/manu-aviri.jpg",
        type: "Comanche",
        category: CLUB
    }
];

let updateFilter = radio => {
    console.log(`Update filter on ${radio}`);
    switch (radio.value) {
        case '1':
            console.log("No filter");
            fillOutFleet(null);
            break;
        case '2':
            console.log("Old boats");
            fillOutFleet(OLD_BOAT);
            break;
        case '3':
            console.log("Passe-Coque Club");
            fillOutFleet(CLUB);
            break;
        case '4':
            console.log("À saisir");
            fillOutFleet(TO_GRAB);
            break;
        default:
            break;
    }
};

let fillOutFleet = filter => {

    let container = document.getElementById('fleet-container');
    // drop all childs
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    // Build new list
    let newList = [];
    // Filter here
    THE_FLEET.forEach(boat => {
        if (filter === null || boat.category == filter) {
            console.log(`Filter ${filter}, adding ${boat.name}`);
            newList.push(boat);
        }
    });
    console.log(`Displaying ${newList.length} boats.`);
    // Populate. based on new list
    newList.forEach(boat => {
        let div = document.createElement('div');
        div.id = boat.id;
        div.classList.add("image-plus-text");
        // div.class = "image-plus-text";
        div.style = "padding: 30px; z-index: 1; max-height: 400px; max-width: 376px;";
        // div.title = boat.name;
        div.onclick = function() { clickOnBoatPix(this); }; 
        div.onmouseover = function() { mouseOnTxPix(this); };
        let img = document.createElement('img');
        img.src = boat.pix;
        // img.width = "100%";
        // img.style.width = "100%";
        div.appendChild(img);
        let span = document.createElement('span');
        span.style = "position: relative; display: block; color: white; bottom: 88px; ";
        span.innerHTML = `${boat.name}<br/>${boat.type}`;
        div.appendChild(span);
        // Badge
        let badge = document.createElement('div');
        badge.classList.add("badge");
        if (boat.category === OLD_BOAT) {
            badge.classList.add("badge-old");
            badge.innerHTML = "Old<br/>boat";
        } else if (boat.category === CLUB) {
            badge.classList.add("badge-pc");
            badge.innerHTML = "PC<br/>Club";
        } else if (boat.category === TO_GRAB) {
            badge.classList.add("badge-grab");
            badge.innerHTML = (currentLang === 'FR') ? "&Agrave;<br/>saisir" : "Grab<br/>it!";
        }
        div.appendChild(badge);
        container.appendChild(div);
    });
    console.log("Done with fillOutFleet");
};
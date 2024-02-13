/**
 * Oho !
 */
const NO_DIALOG_MESSAGE = "Dialog tag not supported.";
const DEFAULT_LANG = "FR";
let currentLang = DEFAULT_LANG; // Init value

let showAboutDialog = () => {
    let aboutDialog = document.getElementById("about-dialog");
    if (aboutDialog.show !== undefined) {
        aboutDialog.style.display = 'inline';
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
      aboutDialog.style.display = 'none';
    } else {
      // alert(NO_DIALOG_MESSAGE);
      aboutDialog.style.display = 'none';
    }
};

let openNav = () => {
    // console.log("Opening Hamburger Menu");
    // alert("Opening Hamburger Menu");
    // let newWidth = getComputedStyle(document.documentElement).width;
    // console.log(`Setting new Width to ${newWidth}`);
	// document.getElementById("side-nav").style.width = newWidth; // getComputedStyle(document.documentElement).getPropertyValue('--expanded-nav-width'); // "450px";
    document.getElementById("side-nav").style.display = 'inline-block';
    // debugger;
};

let closeNav = () => {
	// document.getElementById("side-nav").style.width = "0";
    document.getElementById("side-nav").style.display = 'none';
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

let getQSPrm = (prm) => {
	let value;
	let loc = document.location.toString();
	if (loc.indexOf("?") > -1) {
		let qs = loc.substring(loc.indexOf("?") + 1);
		let prms = qs.split('&');
		for (let i=0; i<prms.length; i++) {
			let nv = prms[i].split('=');
			if (nv.length === 2) {
				if (nv[0] === prm) {
					return nv[1];
				}
			}
		}
	}
	return value;
};

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
	if (false && originId === "62") {  // Not used...
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
					contentPlaceHolder.innerHTML = generateFetchMessage(contentName, response); // `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>En d&eacute;veloppement...<br/>Disponible prochainement.</b>`;
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
                                // let nbTry = 0;
                                let scrollToAnchor = () => {
                                    const overflow = document.getElementById('action-container-2');
                                    let hashtag = (originId === "21") ? '01' : ((originId === "22") ? '02' : '03');
                                    const anchor = document.querySelector(`a[name='${hashtag}']`);
                                    
                                    const rectOverflow = overflow.getBoundingClientRect();
                                    const rectAnchor = anchor.getBoundingClientRect();
    
                                    let scroll_top = rectAnchor.top - rectOverflow.top;
                                    console.log(`rectAnchor.top: ${rectAnchor.top}, rectOverflow.top: ${rectOverflow.top} => ${scroll_top}`);
                                    // Set the scroll position of the overflow container
                                    overflow.scrollTop = scroll_top; // .toFixed(0);  // If remains to zero, check div's height
                                    console.log(`>>> Origin: ${originId}: scrolltop: ${overflow.scrollTop} vs ${scroll_top}`);
                                };
                                window.setTimeout(scrollToAnchor, 100);
                                // 2e couche
                                if (originId === "21") {
                                    window.scrollTo(0, 0); // Scroll on top, if invoked from a button at the bottom of the page
                                }
                                // console.log("Now scrolling.")
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
                            } else {
                                if (originId === "4") {
                                    window.setTimeout(() => {
                                        fillOutFleet(null); // Populate default (full) boat list
                                    }, 500);
                                } else if (originId === "62") {
                                    window.setTimeout(() => {
                                        fillOutActu(null); // Populate default (full) news list
                                    }, 500);
                                } else if (originId === "33") { // Partager, PCC
                                    window.setTimeout(() => {
                                        fillOutFleet(CLUB, "share-container", false); // Populate PCC boat list
                                    }, 500);
                                } 
                                window.scrollTo(0, 0); // Scroll on top, if invoked from a button at the bottom of the page
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
				contentPlaceHolder.innerHTML = generateFetchErrorMessage(contentName, error, errmess);
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
	document.querySelectorAll("#_31").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Transmettre - <i>Les projets</i>" : "Transmitting - <i>The projects</i>"));
	document.querySelectorAll("#_32").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "R&eacute;nover - <i>Le chantier</i>" : "Refitting - <i>The shipyard</i>"));
	document.querySelectorAll("#_33").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Partager - <i>Le Club</i>" : "Sharing - <i>The Club</i>"));
	// document.querySelectorAll("#_34").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Formations" : "Trainings"));
	// document.querySelectorAll("#_35").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Partenaires" : "Partners"));

	document.querySelectorAll("#_4").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "La flotte&nbsp;" : "The fleet&nbsp;"));
	// document.querySelectorAll("#_41").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Les bateaux" : "The boats"));     // Unused
	// document.querySelectorAll("#_42").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Les projets" : "The projects"));  // Unused

	document.querySelectorAll("#_5").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Nous soutenir&nbsp;" : "Support us&nbsp;"));
	document.querySelectorAll("#_51").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Adh&eacute;rer" : "Join us"));
	document.querySelectorAll("#_52").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Faire un don" : "Make a donation"));
	document.querySelectorAll("#_53").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Inverstir dans l'Eco-Village" : "Invest in the Eco-Village"));

	document.querySelectorAll("#_6").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "En savoir plus&nbsp;" : "Know more&nbsp;"));
	document.querySelectorAll("#_61").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Contact" : "Contact"));
	document.querySelectorAll("#_62").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Actualit&eacute;" : "News"));
	document.querySelectorAll("#_63").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "On parle de nous / Presse" : "We're in the news"));
	document.querySelectorAll("#_64").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "La boutique" : "The store"));
	document.querySelectorAll("#_65").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Partenaires" : "Partners"));
	document.querySelectorAll("#_66").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Charte PCC" : "PCC Chart"));
	document.querySelectorAll("#_67").forEach(elmt => elmt.innerHTML = (currentLang === "FR" ? "Espace Membres" : "Members Space"));
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

let generateFetchMessage = (contentName, response) => {
    let mess = (currentLang === 'FR') ? 'Cette page est en cours de d&eacute;veloppement...<br/>Disponible prochainement.' : 
                                        'This page is being developped...<br/>Available soon.';
    let message = `<div style='margin: 10px;'><div style='display: none;'>Message :<br/> Fetching ${contentName}...<br/>Data Response: ${response.status} - ${response.statusText}</div>` + 
    `<div style="width: 100%; text-align: center;"><img src="./images/the.shipyard.jpg" width="100%"></div>` + 
    `<div style='border: 3px solid orange; border-radius: 10px; text-align: center; display: grid; grid-template-columns: auto auto auto;'>` + 
    `<div style="display: flex; align-items: center; margin: auto;"><img src="./images/construction.cone.png" height="52"></div> <div><b>${mess}</b></div> <div style="display: flex; align-items: center; margin: auto;"><img src="./images/construction.cone.png" height="52"></div></div></div>`;
    return message;
};

let generateFetchErrorMessage = (contentName, error, errmess) => {
    let message;
    if (errmess) {
        let mess = JSON.parse(errmess);
        if (mess.message) {
            message = mess.message;
        }
    }
    let text = (currentLang === 'FR') ? 'Erreur de chargement...<br/>Est-ce que le serveur est en route ?' : 
                                        'Load error...<br/>Is the server running?';
    let content = `<div style='margin: 10px;'><pre>Fetch Error for ${contentName}: ${(error ? JSON.stringify(error, null, 2) : ' - ') + ', ' + (message ? message : ' - ')} </pre><div style='border: 3px solid red; border-radius: 10px; text-align: center;'><b>${text}</b></div></div>`;
    return content;
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
  "./images/evo.png",
  "./images/slideshow.01.png",
  "./images/slideshow.02.png",
  "./images/slideshow.03.png",
  "./images/slideshow.04.png" ];  

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

let aboutDiv = undefined;

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
                dynamicContentContainer.innerHTML = generateFetchMessage(contentName, response); // `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>En d&eacute;veloppement...<br/>Disponible prochainement.</b>`;
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
            dynamicContentContainer.innerHTML = generateFetchErrorMessage(contentName, error, errmess);
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
                dynamicContentContainer.innerHTML = generateFetchMessage(contentName, response); // `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>En d&eacute;veloppement...<br/>Disponible prochainement.</b>`;
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
            dynamicContentContainer.innerHTML = generateFetchErrorMessage(contentName, error, errmess); // `<b>${contentName} ${currentLang === 'FR' ? ' introuvable...<br/>Bient&ocirc;t dispo !' : ' not found...<br/>Avai;able soon!'}</b>`;
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
    window.scrollTo(0, 0); // Scroll on top, for Safari...
    if (infoTxDialog.show !== undefined) {
        infoTxDialog.style.display = 'inline'; // Safari...
        infoTxDialog.show();
    } else {
      // alert(NO_DIALOG_MESSAGE);
      infoTxDialog.style.display = 'inline';
    }
};

let closeInfoTxDialog = () => {
    let infoTxDialog = document.getElementById("info-tx-dialog");
    if (infoTxDialog.close !== undefined) {
        infoTxDialog.style.display = 'none'; // Safari
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
                dialogContent.innerHTML = generateFetchMessage(contentName, response); // `Fetching ${contentName}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>En d&eacute;veloppement...<br/>Disponible prochainement.</b>`;
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
            dialogContent.innerHTML = generateFetchErrorMessage(contentName, error, errmess); // `<b>${contentName} ${currentLang === 'FR' ? ' introuvable...<br/>Bient&ocirc;t dispo !' : ' not found...<br/>Avai;able soon!'}</b>`;
        });

    if (aboutDialog.show !== undefined) {
        aboutDialog.style.display = 'block'; // Safari...
        aboutDialog.show();
    } else {
      // alert(NO_DIALOG_MESSAGE);
      aboutDialog.style.display = 'block'; // 'inline';
    }
};

let aboutPartner = (from) => {
    // console.log(`About Partner`);
    let partnerURL = from.getAttribute('url');  // Non standard !
    if (partnerURL) {
        window.open(partnerURL);
    }
};

const NONE = 1;
const CLUB = 2;
const EX_BOAT = 3;
const TO_GRAB = 4;

// TODO See if there is a better place for this hard-coded list, like a json to fetch...
const THE_FLEET = [
    {
        name: "Eh'Tak",
        id: "eh-tak",
        pix: "./images/boats/eh-tak.jpg",
        type: "Shipman 28",
        category: CLUB,
        base: "&Eacute;tel"
    },
    {
        name: "Pordin-Nancq",
        id: "pordin-nancq",
        pix: "./images/boats/pordin.jpg",
        type: "Carter 37",
        category: NONE,
        base: "Locmiqu&eacute;lic"
    },
    {
        name: "Coraxy",
        id: "coraxy",
        pix: "./images/boats/coraxy.png",
        type: "Cognac",
        category: NONE,
        base: "Saint&#8209;Philibert"
    },
    {
        name: "Manu Oviri",
        id: "manu-oviri",
        pix: "./images/boats/manu-aviri.jpg",
        type: "Comanche",
        category: CLUB,
        base: "&Eacute;tel"
    },
    // {
    //     name: "Pen Duick",
    //     id: "pen-duick",
    //     pix: "./images/boats/pen.duick.jpg",
    //     type: "W. Fife",
    //     category: NONE,
    //     base: "Lorient"
    // },
    { 
        name: "Wanita Too",
        id: "wanita",
        pix: "./images/boats/wanita.too.sq.png",
        type: "First Class 12",
        category: NONE,
        base: "Saint-Malo"
    },
    { 
        name: "Atlantide",
        id: "atlantide",
        pix: "./images/boats/atlantide.sq.png",
        type: "Gib'Sea&nbsp;33",
        category: EX_BOAT,
        base: "--"
    },
    { 
        name: "Iapyx",
        id: "iapyx",
        pix: "./images/boats/iapyx.sq.png",
        type: "Offshore&nbsp;35",
        category: EX_BOAT,
        base: "--"
    },
    { 
        name: "Ar Mor Van",
        id: "ar-mor-van",
        pix: "./images/boats/kelt620.jpeg",
        type: "Ketl 620",
        category: NONE,
        base: "&Eacute;tel"
    },
    { 
        name: "Twist Again",
        id: "twist-again",
        pix: "./images/boats/twist.again.sq.png",
        type: "JOD 35",
        category: EX_BOAT,
        base: "Saint&#8209;Philibert"
    },
    { 
        name: "Ia Orana",
        id: "ia-orana",
        pix: "./images/boats/ia.orana.sq.png",
        type: "Milord",
        category: EX_BOAT,
        base: "--"
    },
    {
        name: "Melkart",
        id: "melkart",
        pix: "./images/boats/melkart/melkart.00.jpg",
        type: "Evasion 32",
        category: NONE,
        base: "&Eacute;tel"
    },
    {
        name: "Babou",
        id: "babou",
        pix: "./images/boats/babou.sq.png",
        type: "Flying Phantom",
        category: NONE,
        base: "Saint&#8209;Philibert"
    },
    {
        name: "Mirella",
        id: "mirella",
        pix: "./images/boats/mirella.png",
        type: "Maica 12,50",
        category: NONE,
        base: "Saint&nbsp;Brieuc"
    },
    { 
        name: "Tri Yann",
        id: "tri-yann",
        pix: "./images/boats/tri.yann.png",
        type: "Trimaran Allegro",
        category: CLUB,
        base: "Saint&#8209;Philibert"
    },
    { 
        name: "Rozen an Avel",
        id: "rozen-an-avel",
        pix: "./images/boats/rozen.an.avel.jpeg",
        type: "Arp&egrave;ge",
        category: NONE,
        base: "Saint&#8209;Philibert"
    },
    { 
        name: "Avel Mad",
        id: "avel-mad",
        pix: "./images/boats/avel.mad.sq.png",
        type: "Mousquetaire",
        category: EX_BOAT,
        base: "Le&nbsp;Bono"
    },
    { 
        name: "F&eacute;licie",
        id: "felicie",
        pix: "./images/boats/felicie.sq.png",
        type: "One off Presles",
        category: EX_BOAT,
        base: "Dakar"
    },
    { 
        name: "La R&ecirc;veuse",
        id: "la.reveuse",
        pix: "./images/boats/la.reveuse.sq.png",
        type: "Damien 40",
        category: NONE,
        base: "Arzal"
    },
    { 
        name: "Tokad 2",
        id: "tokad-2",
        pix: "./images/boats/tokad.2.sq.png",
        type: "Neptune 99",
        category: NONE,
        base: "Le&nbsp;Crouesty"
    },
    { 
        name: "Taapuna",
        id: "taapuna",
        pix: "./images/boats/taapuna.png",
        type: "Edel 660",
        category: CLUB,
        base: "Rivi&egrave;re de Saint&#8209;Philibert"
    },
    { 
        name: "L'heure bleue",
        id: "heure-bleue",
        pix: "./images/boats/lheure.bleue.jpeg",
        type: "Arp&egrave;ge",
        category: NONE,
        base: "Golfe&nbsp;du&nbsp;Morbihan"
    },
    { 
        name: "Jolly Jumper",
        id: "jolly-jumper",
        pix: "./images/boats/jolly.jumper.01.jpg",
        type: "First 325",
        category: NONE,
        base: "Les&nbsp;Sables&nbsp;d'Olonne"
    },
    { 
        name: "Passpartout",
        id: "passpartout",
        pix: "./images/boats/passpartout.sq.png",
        type: "One off",
        category: NONE,
        base: "Lorient"
    },
    { 
        name: "Melvan",
        id: "melvan",
        pix: "./images/boats/melvan.sq.png",
        type: "Karat&eacute;&nbsp;33",
        category: NONE,
        base: "Toulon"
    },
    { 
        name: "Saigane",
        id: "saigane",
        pix: "./images/boats/saigane/saigane.jpg",
        type: "Dufour 2800",
        category: CLUB,
        base: "Port&nbsp;Blanc"
    },
    { 
        name: "Anao",
        id: "anao",
        pix: "./images/boats/anao.jpeg",
        type: "Folie Douce",
        category: EX_BOAT,
        base: "&Eacute;tel"
    },
    { 
        name: "Trehudal",
        id: "trehudal",
        pix: "./images/boats/trehudal.png",
        type: "Nicholson 33",
        category: NONE,
        base: "La&nbsp;Trinit&eacute;"
    },
    { 
        name: "Jules Verne",
        id: "jules-verne",
        pix: "./images/boats/jules.verne.sq.png",
        type: "Sir 520",
        category: CLUB,
        base: "Locmariaquer"
    },
    { 
        name: "Remora",
        id: "remora",
        pix: "./images/boats/remora.sq.png",
        type: "Arcachonnais",
        category: TO_GRAB,
        base: "Saint&#8209;Philibert"
    },
    { 
        name: "Stiren ar Mor",
        id: "stiren",
        pix: "./images/boats/stiren.er.mor.png",
        type: "Ghibli",
        category: NONE,
        base: "La&nbsp;Trinit&eacute;"
    },
    { 
        name: "Coevic 2",
        id: "coevic-2",
        pix: "./images/boats/coevic-2.png",
        type: "Mirage 28",
        category: NONE,
        base: "Kernevel"
    },
    { 
        name: "Ma Enez",
        id: "ma-enez",
        pix: "./images/boats/ma.enez.png",
        type: "Symphonie",
        category: NONE,
        base: "La&nbsp;Trinit&eacute;"
    },
    { 
        name: "Saudade",
        id: "saudade",
        pix: "./images/boats/saudade.png",
        type: "Super Arlequin",
        category: NONE,
        base: "Le&nbsp;Bono"
    },
    { 
        name: "Imagine",
        id: "imagine",
        pix: "./images/boats/selection.png",
        type: "Selection&nbsp;37",
        category: NONE,
        base: "Ouistreham"
    },
    { 
        name: "Gwenillig",
        id: "gwenillig",
        pix: "./images/boats/gwenillig.png",
        type: "Eygthene 24",
        category: CLUB,
        base: "--"
    },
    { 
        name: "Lohengrin",
        id: "lohengrin",
        pix: "./images/boats/lohengrin/lohengrin.png",
        type: "Ketch en Acier",
        category: TO_GRAB,
        base: "Arzal"
    },
    { 
        name: "Nomadict",
        id: "nomadict",
        pix: "./images/boats/nomadict/nomadict.00.jpg",
        type: "Gin Fizz",
        category: TO_GRAB,
        base: "Concarneau"
    },
    { 
        name: "Velona",
        id: "velona",
        pix: "./images/boats/velona/velona.00.jpg",
        type: "Classic Old Gaffer",
        category: TO_GRAB,
        base: "Hennebont"
    }
];

const INFO_SECTION = [
    {
        section: "agenda",
        content: [{
            date: "Jan-2024",
            title: "Agenda 2024",
            content: "./actu/agenda2024.html"
        }]
    },
    {
        section: "2024",
        content: [{
            date: "Jan-2024",
            title: "Early 2024",
            content: "./actu/2024/bpgo.html"
        }, {
            date: "Jan-2024",
            title: "Early 2024",
            content: "./actu/2024/new.site.html"
        }]
    },
    { 
        section: "2023",
        content: [
            {
                date: "Oct-2023",
                title: "Festival des aventuriers",
                content: "./actu/2023/fam.html"
            },{
                date: "Sep-2023",
                title: "Forum Asso",
                content: "./actu/2023/forum.html"
            },{
                date: "Sep-2023",
                title: "Assises de la mer",
                content: "./actu/2023/assises.html"
            },{
                date: "Aug-2023",
                title: "Carter Cup",
                content: "./actu/2023/carter.cup.html"
            },{
                date: "Chepakan",
                title: "Passe-Coque Trophy",
                content: "./actu/2023/passe-coque.trophy.html"
            }
        ]
    },
    {   
        section: "2022",
        content: [
            {
                date: "2022",
                title: "2022",
                content: "./actu/2022/news.01.html"
            },
            {
                date: "2022",
                title: "2022",
                content: "./actu/2022/news.02.html"
            }
        ]
    },
    {   
        section: "2021",
        content: [
            {
                date: "2021",
                title: "2021",
                content: "./actu/2021/year.html"
            }
        ]
    },
    {   
        section: "2020",
        content: [
            {
                date: "2020",
                title: "2020",
                content: "./actu/2020/year.html"
            }
        ]
    },
    {   
        section: "2019",
        content: [
            {
                date: "2019",
                title: "2019",
                content: "./actu/2019/year.html"
            }
        ]
    },
    {
        section: "news",
        content: [
            {
              date: "",
              title: "All news letters",
              content: "./actu/newsletters.html"
            }
        ]
    },
    {
        section: "communications",
        content: [
            {
                date: "",
                title: "All Communications",
                content: "./actu/communications.html"
              }
          ]
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
            fillOutFleet(EX_BOAT);
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

let fillOutFleet = (filter, containerId = 'fleet-container', withBadge = true) => {

    let container = document.getElementById(containerId); // 'fleet-container');
    // drop all children
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    // Build new list
    let newList = [];
    // Sort by name ?
    THE_FLEET.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
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
        div.classList.add("boat-image-plus-text");
        // div.style = "padding: 10px; z-index: 1; max-height: 420px; max-width: 300px;"; // See below. Make this class
        div.classList.add("boat-frame");
        // div.title = boat.name;
        div.onclick = function() { clickOnBoatPix(this); }; 
        div.onmouseover = function() { mouseOnTxPix(this); };
        let imgContainer = document.createElement('div');
        imgContainer.classList.add("boat-image-container");
        let img = document.createElement('img');
        img.src = boat.pix;
        // img.width = "100%";
        img.style.width = "100%";
        imgContainer.appendChild(img);
        div.appendChild(imgContainer);
        // Name and type
        let span = document.createElement('span'); 
        span.style = "position: relative; display: block; bottom: 4px; line-height: 1.1em;";
        span.innerHTML = `${boat.name}<br/>${boat.type}, ${boat.base}`;
        div.appendChild(span);
        // Badge
        if (withBadge) {
            let badge = document.createElement('div');
            badge.classList.add("badge");
            if (boat.category === EX_BOAT) {
                badge.classList.add("badge-old");
                badge.innerHTML = '<span style="font-size: 2.0em; background: transparent;">😢</span>'; // "Old<br/>boat";
            } else if (boat.category === CLUB) {
                badge.classList.add("badge-pc");
                badge.innerHTML = '<span>😎</span>'; // "PC<br/>Club";
            } else if (boat.category === TO_GRAB) {
                badge.classList.add("badge-grab");
                badge.innerHTML = '<span>🤩</span>'; // (currentLang === 'FR') ? "&Agrave;<br/>saisir" : "Grab<br/>it!";
            }
            div.appendChild(badge);
        }
        container.appendChild(div);
    });
    console.log("Done with fillOutFleet");
};

let updateInfoFilter = radio => {
    console.log(`Update filter on ${radio.value}`);
    switch (radio.value) {
        case 'all':
            console.log("No filter");
            fillOutActu(null);
            break;
        case 'agenda':
            console.log('Agenda');
            fillOutActu('agenda');
            break;
        case 'a2024':
            console.log("2024");
            fillOutActu('2024');
            break;
        case 'a2023':
            console.log("2023");
            fillOutActu('2023');
            break;
        case 'a2022':
            console.log("2022");
            fillOutActu('2022');
            break;
        case 'a2021':
            console.log("2021");
            fillOutActu('2021');
            break;
        case 'a2020':
            console.log("2020");
            fillOutActu('2020');
            break;
        case 'a2019':
            console.log("2019");
            fillOutActu('2019');
            break;
        case 'aComm':
            console.log("Communications");
            fillOutActu('communications'); // See INFO_SECTION
            break;
        case 'aNews':
            console.log("News");
            fillOutActu("news"); // See INFO_SECTION
            break;
        default:
            break;
    }
};

let fillOutActu = filter => {
    // Populate the div named actu-container
    let container = document.getElementById('actu-container');
    // drop all children
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    // Build new list
    let newList = [];
    // Filter here
    INFO_SECTION.forEach(section => {
        if (filter === null || section.section == filter) {
            console.log(`Filter ${filter}, adding '${section.section}'`);
            newList.push(section);
        }
    });
    console.log(`Displaying ${newList.length} section(s).`);
    newList.forEach(section => {
        // Create new div for this section
        let sectionDiv = document.createElement('div');
        // Now loop on sub-elements in the section
        section.content.forEach(event => {
            // title: "Passe-Coque Trophy"
            // content: "./actu/2023/passe-coque.trophy.html"
            console.log(`Adding event ${event.title}`);
            let eventDiv = document.createElement('div');
            eventDiv.style = "margin: 20px;";
            sectionDiv.appendChild(eventDiv);
            console.log(`Now fetching ${event.content}`); // TODO Language !!
            fetch(event.content)
                .then(response => {  // Warning... the NOT_FOUND error lands here, apparently.
                    console.log(`Data Response: ${response.status} - ${response.statusText}`);
                    if (response.status !== 200) { // There is a problem...
                        eventDiv.innerHTML = generateFetchMessage(event.content, response); // `Fetching ${event.content}...<br/> Data Response: ${response.status} - ${response.statusText}<br/><b>En d&eacute;veloppement...<br/>Disponible prochainement.</b>`;
                    } else {
                        response.text().then(doc => {
                            console.log(`${event.content} code data loaded, length: ${doc.length}.`);
                            eventDiv.innerHTML = doc;
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
                    eventDiv.innerHTML = generateFetchErrorMessage(contentName, error, errmess); // `<b>${contentName} ${currentLang === 'FR' ? ' introuvable...<br/>Bient&ocirc;t dispo !' : ' not found...<br/>Avai;able soon!'}</b>`;
                });
        });
        container.appendChild(sectionDiv);
    });

};

// Dynamic translation, for the actu section.
// We assume all data are already in French.
let translate = (actuId) => {
    console.log(`${actuId} : ${(currentLang === 'FR') ? "En français" : "I'll speak english"}`);

    switch (actuId) {
        case 'cc-2023': // Carter Cup 2023
            if (currentLang === 'EN') {  // Then translate
                let dateField = document.getElementById('cc-2023').querySelector('h2');
                if (dateField) {
                    dateField.innerText = "Carter Cup, August 2023";
                }
                let contentField01 = document.getElementById('cc-2023').querySelector('#content-01');
                if (contentField01) {
                    contentField01.innerHTML = 'Jimmy, on board Pordin-Nancq, was a winner!';
                }
                // etc...
            }
            break;
        case 'fam-2023': // Festival dea Aventuries de la Mer 2023
            if (currentLang === 'EN') {  // Then translate
                let dateField = document.getElementById('fam-2023').querySelector('h2');
                if (dateField) {
                    dateField.innerText = "Festival des Aventuriers de la Mer, October 2023";
                }
                let contentField01 = document.getElementById('fam-2023').querySelector('#content-01');
                if (contentField01) {
                    contentField01.innerHTML = 'Passe-Coque wins the "Audelor et R&eacute;gion Bretagne" prize, and a 5000€ check, for the creation of the boat-club of the association.';
                }
                // etc...
            }
            break;
        case 'early-2024':
            if (currentLang === 'EN') {
                let dateField = document.getElementById('early-2024').querySelector('h2');
                if (dateField) {
                    dateField.innerText = "Mid-january 2024";
                }
                let contentField01 = document.getElementById('early-2024').querySelector('div');
                if (contentField01) {
                    contentField01.innerHTML = 'Release of the new web site.';
                }
            }
            break;
        default:
            break;
    }
};

let networkSubscribe = (type) => {
    alert(`Reaching ${type}.\nSoon.`);
};

let subscribeNewsLetter = () => {
    let userName = document.getElementById('first-last-name').value;
    let userEmail = document.getElementById('user-email').value;
    alert(`News Letter subscription for ${userName}, ${userEmail}`);
};

let scrollTheTeam = (dir) => {
    console.log(`Scrolling, ${dir}`);
    let container = document.getElementById("team-container");
    let nbPeople = container.querySelectorAll('div.image-plus-text').length;
    let step = container.clientWidth / nbPeople;
    container.scrollLeft += (step * dir);
};

let scrollPartners = (dir) => {
    console.log(`Scrolling, ${dir}`);
    let container = document.getElementById("partners-container");
    let nbPeople = container.querySelectorAll('div.partner-logo').length;
    let step = container.clientWidth / nbPeople;
    container.scrollLeft += (step * dir);
};

let openTab = (evt, tabName) => {
    let tabLinks = document.getElementsByClassName("tablinks"); // Tabs/Buttons

    for (let i=0; i<tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" tab-active", ""); // Reset
    }
    let divSections = document.querySelectorAll(".tab-section");

    for (let i=0; i<divSections.length; i++) {
        divSections[i].style.display = (divSections[i].id === tabName) ? 'block' : 'none';
    }
    evt.currentTarget.className += " tab-active";
};

let customAlertOpened = false;
let showCustomAlert = (content) => {
    let customAlert = document.getElementById("custom-alert");
    document.getElementById('custom-alert-content').innerHTML = `<pre>${content}</pre>`;
    if (customAlert.show !== undefined) {
        customAlert.style.display = 'inline'; // For Safari...
        customAlert.show();
    } else {
        customAlert.style.display = 'inline';
    }
    customAlertOpened = true;
    window.setTimeout(closeCustomAlert, 5000);
};

let closeCustomAlert = () => {
    let customAlert = document.getElementById("custom-alert");
    if (customAlert.close !== undefined) {
        customAlert.style.display = 'none'; // Safari
        customAlert.close();
    } else {
        customAlert.style.display = 'none';
    }
    customAlertOpened = false;
};

// Optional
// window.alert = showCustomAlert;  // Not in window.onload !

let subscriptionOKMessage = () => {
    let mess = "Votre requ&ecirc;te a &eacute;t&eacute; envoy&eacute;e,<br/>vous &ecirc;tes en copie (v&eacute;rifiez vos spams...).";
    if (currentLang !== 'FR') {
        mess = "Your request has been sent,<br/>you're cc'd (check your spams...)."
    }
    return mess;
}

let subscriptionErrorMessage = () => {
    let mess = "Votre requ&ecirc;te a pos&eacute; un probl&egrave;me, elle n'est pas partie.";
    if (currentLang !== 'FR') {
        mess = "There was a problem posting your request...."
    }
    return mess;
}

let sendMessageOKMessage = () => {
    let mess = "Votre message a &eacute;t&eacute; envoy&eacute;,<br/>vous &ecirc;tes en copie (v&eacute;rifiez vos spams...).";
    if (currentLang !== 'FR') {
        mess = "Your message has been sent,<br/>you're cc'd (check your spams...)."
    }
    return mess;
}

let sendMessageErrorMessage = () => {
    let mess = "Votre message a pos&eacute; un probl&egrave;me, il n'est pas parti.";
    if (currentLang !== 'FR') {
        mess = "There was a problem posting your message...."
    }
    return mess;
}

let onSubscriptionResponse = (iframe) => {
    // console.log(iframe);
    let message = '';
    try {
        message = iframe.contentDocument.querySelectorAll('body')[0].innerText.trim();
        if (message.startsWith("OK")) {
            message = "Votre Souscription a bien &eacute;t&eacute; enregistr&eacute;e.";
            if (currentLang == 'EN') {
                message = "Your subscription was successfull."
            }
        } else if (message.startsWith("ERROR")) {
            message = "Cette adresse email est d&eacute;j&agrave; utilis&eacute;e.<br/>Essayez avec une autre...";
            if (currentLang == 'EN') {
                message = "Email address already in use.<br/>Try another one..."
            }
        }
    } catch (err) {
        console.log("Oops");
        try {
            message = iframe.contentDocument.querySelectorAll('body')[0].innerText.trim();
        } catch (err2) {
            console.log("No text, no error...");
        }
    }
    // Display in dialog, or custom alert.
    if (message.length > 0) {
        // alert(message);
        showCustomAlert(message);
    }
}

let onSubmitResponse = (iframe, okMess, errorMess) => {
    // console.log(iframe);
    let message = '';
    try {
        message = iframe.contentDocument.querySelectorAll('body')[0].innerText.trim();
        if (message.length > 0) {  // because of the onload on the iframe...
            if (message.startsWith("ERROR")) {
                message = errorMess;
            } else {
                message = okMess;
            }
            // if (message.startsWith("OK")) {
            //     message = okMess;
            // } else if (message.startsWith("ERROR")) {
            //     message = errorMess;
            // }
        }
    } catch (err) {
        console.log("Oops");
        try {
            message = iframe.contentDocument.querySelectorAll('body')[0].innerText.trim();
        } catch (err2) {
            console.log("No text, no error...");
        }
    }
    // Display in dialog, or custom alert.
    if (message.length > 0) {
        // alert(message);
        showCustomAlert(message);
    }
};

/**
 * For the messages in both 1_xx.html and 61_xx.html
 * Same field ids.
 * 
 * @param {*} evt 
 * @returns true if OK, false otherwise (to prevent submit)
 */
let checkFields = (evt) => {
    let ok = true;
    let errMess = [];
    let name = document.getElementById('first-last-name').value;
    let email = document.getElementById('user-email').value;
    if (!name || name.trim().length === 0) {
        errMess.push(currentLang === 'FR' ? 'On a besoin d\'un nom.' : 'Name is required.');
    }
    if (!email || email.trim().length === 0) {
        errMess.push(currentLang === 'FR' ? 'On a besoin d\'un email.' : 'Email is required.');
    }
    if (errMess.length > 0) {
        ok = false;
        let mess = '';
        errMess.forEach(el => mess += (el + '<br/>'));
        let prefix = (currentLang === 'FR' ? 'Votre message n\'a pas &eacute;t&eacute; envoy&eacute;.<br/>' : 'You message was not sent.<br/>');
        showCustomAlert(`<pre>${prefix}${mess}</pre>`);
    }
    return ok;
};
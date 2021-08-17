let openNav = () => {
    document.getElementById("side-nav").style.width =  getComputedStyle(document.documentElement).getPropertyValue('--expanded-nav-width'); // "450px";
};

let closeNav = () => {
    document.getElementById("side-nav").style.width = "0";
};

const PRMS_DIALOG_ID = "background-prms-dialog";
const HELP_DIALOG_ID = "help-dialog";
const MARQUEE_DIALOG_ID = "marquee-dialog";

let showPrmsDialog = () => {
    let prmsDialog = document.getElementById(PRMS_DIALOG_ID);
    prmsDialog.show();
};

let closePrmsDialog = () => {
    let prmsDialog = document.getElementById(PRMS_DIALOG_ID);
    prmsDialog.close();
  };

  let showHelpDialog = () => {
    let helpDialog = document.getElementById(HELP_DIALOG_ID);
    helpDialog.show();
};

let closeHelpDialog = () => {
    let helpDialog = document.getElementById(HELP_DIALOG_ID);
    helpDialog.close();
};

let showMarqueeDialog = () => {
    let marqueeDialog = document.getElementById(MARQUEE_DIALOG_ID);
    marqueeDialog.show();
};

let closeMarqueeDialog = () => {
    let marqueeDialog = document.getElementById(MARQUEE_DIALOG_ID);
    marqueeDialog.close();
};

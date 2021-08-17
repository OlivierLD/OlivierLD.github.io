let openNav = () => {
    document.getElementById("side-nav").style.width =  getComputedStyle(document.documentElement).getPropertyValue('--expanded-nav-width'); // "450px";
};

let closeNav = () => {
    document.getElementById("side-nav").style.width = "0";
};

const PRMS_DIALOG_ID = "background-prms-dialog";
const HELP_DIALOG_ID = "help-dialog";

let showPrmsDialog = () => {
    let prmsDialog = document.getElementById(PRMS_DIALOG_ID);
    prmsDialog.show();
};

let closePrmsDialog = () => {
    let prmsDialog = document.getElementById(PRMS_DIALOG_ID);
    prmsDialog.close();
  };

  let showHelpDialog = () => {
    let prmsDialog = document.getElementById(HELP_DIALOG_ID);
    prmsDialog.show();
};

let closeHelpDialog = () => {
    let prmsDialog = document.getElementById(HELP_DIALOG_ID);
    prmsDialog.close();
  };


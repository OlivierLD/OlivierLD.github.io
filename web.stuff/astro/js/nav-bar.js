let openNav = () => {
    document.getElementById("side-nav").style.width =  getComputedStyle(document.documentElement).getPropertyValue('--expanded-nav-width'); // "450px";
};

let closeNav = () => {
    document.getElementById("side-nav").style.width = "0";
};

const PRMS_DIALOG_ID = "background-prms-dialog";

let showPrmsDialog = () => {
    let prmsDialog = document.getElementById(PRMS_DIALOG_ID);
    prmsDialog.show();
};

let closePrmsDialog = () => {
    let prmsDialog = document.getElementById(PRMS_DIALOG_ID);
    prmsDialog.close();
  };


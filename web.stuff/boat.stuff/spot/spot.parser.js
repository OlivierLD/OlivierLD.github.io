/*
 * Spot GRIB Request result parser
 * By OlivSoft
 * olivier@lediouris.net
 */
 
let SpotParser = {
  nmeaData : [],
  position : {},
  
  parse : function(spotContent, cb, cb2) {
    SpotParser.nmeaData  = [];
    let line = spotContent.split("\n");
//  console.info("We have " + line.length + " line(s)");
    
    let linkList = "";
    //                            07-03 00:00 1                      011.8           8.4             214       0.0       11.3
    let regExp   = new RegExp("(\\d{2}-\\d{2}\\s\\d{2}:\\d{2})\\s*(\\d*\\.\\d)\\s*(\\d*\\.\\d)\\s*(\\d*)\\s*(\\d*\\.\\d).*");  
    //                            ^                                  ^               ^               ^         ^         ^
    //                            date                               prmsl           tws             twd       rain      etc
    
    // request code: spot:37.5N,122.5W|5,3|PRMSL,WIND,RAIN,LFTX
    let posRegExpr = new RegExp("request\\scode:\\sspot:([^|]*).*");
    let j = 0;
    for (let i=0; i<line.length; i++) {
      let matches = regExp.exec(line[i]);
      if (matches !== null) {
        let date  = matches[1];
        let prmsl = matches[2];
        let tws   = matches[3];
        let twd   = matches[4];
        let rain  = matches[5];
        
//      console.info("Line:" + date + ":" + tws);
        SpotParser.nmeaData.push(new NMEAData(date, prmsl, tws, twd, rain));
        linkList += ("<a href='javascript:" + cb + "(" + j + ", \"" + tws + "\", \"" + twd + "\", \"" + prmsl + "\", \"" + rain + "\");' title='" + date + "'>" + (j+1).toString() + "</a>&nbsp;");
        j++;
      } else {
        let posMatch = posRegExpr.exec(line[i]);
        if (posMatch !== null) {
          let posArray = posMatch[1].split(",");
          let lat = parseFloat(posArray[0].substring(0, posArray[0].length - 1));
          let lng = parseFloat(posArray[1].substring(0, posArray[1].length - 1));
          if (posArray[0].charAt(posArray[0].length - 1) === 'S') {
            lat = -lat;
          }
          if (posArray[1].charAt(posArray[1].length - 1) === 'W') {
            lng = -lng;
          }
          SpotParser.position["lat"] = lat;
          SpotParser.position["lng"] = lng;
        }
      }
    }    
    if (cb2) {
      cb2();
    } 
    return linkList;
  }
};

let NMEAData = function(date, prmsl, tws, twd, rain) {
  let nmeaDate = date;
  let nmeaPrmsl = prmsl;
  let nmeaTws = tws;
  let nmeaTwd = twd;
  let nmeaRain = rain;
  
  this.getNMEADate = function()
  { return nmeaDate; };
  
  this.getNMEAPrmsl = function()
  { return nmeaPrmsl; };
  
  this.getNMEATws = function()
  { return nmeaTws; };
  
  this.getNMEATwd = function()
  { return nmeaTwd; };
  
  this.getNMEARain = function()
  { return nmeaRain; };
};

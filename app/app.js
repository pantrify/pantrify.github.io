let USER = {
    "name":"Tim Conrad",
    "API_KEY" : "$2b$10$/YpOYrCXwH3uHEpc41Lt2.nn8Tn5Dez6gv7mWoWAKC45OaRVRtknK",
    "ACCESS_KEY" : "$2b$10$5zOb6/cOouDY.CXxh4GlpewfRdPjUO609Ed8a5/2vL1.rGMezlJom",
    "BIN_NAME" : "SimpleStorageConfiguration",
    "BIN_ID" : "6288d44e402a5b3802068a13",
    "COLLECTION_ID": "6288dc15402a5b38020695a2"
}

let ARTICEL_EXAMPLE = {
    "name":"Tomate",
    "barcode":"123456",
    "picture_url":"https://www.fruchtbarewelt.de/wp-content/uploads/2016/09/Tomate.jpg.webp",
    "quantity":1,
    "price":0.80,
    "brand":"REWE",
    "expiry":"1653135779031 ",
    "last_updated":"",
    "last_updated_by":"",
    "location":""
}

let STORAGEDB = [
    
]

// Barcode Scanner
function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ${decodedText}`, decodedResult);
    window.document.getElementById("result").innerText = decodedText;
}
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);


// Persist changes if needed
function createJsonBin(jsonData){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
        jsonResponse = JSON.parse(readJsonBin.responseText)
        USER.BIN_ID = jsonResponse.metadata.id
    }
    };
    
    req.open("POST", "https://api.jsonbin.io/v3/b", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", USER.API_KEY);
    req.setRequestHeader("X-Bin-Name", USER.BIN_NAME);
    req.send(JSON.stringify(jsonData));
}

function readJsonBin(){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
      }
    };
    
    req.open("GET", "https://api.jsonbin.io/v3/b/"+USER.BIN_ID+"/latest", true);
    req.setRequestHeader("X-Master-Key", USER.API_KEY);
    req.setRequestHeader("X-Access-Key", USER.ACCESS_KEY);
    req.send();
}

function updateJsonBin(jsonData){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
    }
    };

    req.open("PUT", "https://api.jsonbin.io/v3/b/"+USER.BIN_ID, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", USER.API_KEY);
    req.send(JSON.stringify(jsonData));
}
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
    {
        "barcode":"4005240040058",
        "name":"Product Name",
        "brand":"Dummy",
        "location":"Cellar 1",
        "quantity":"1",
        "expiry":"-1"
    } 
]

// Check if the user is setup otherwise open settings dialog.
window.addEventListener('load', function () {
    var user_settings = getFromLocalStorage("user_settings")
    if(user_settings !== null){
        var storage_db = getFromLocalStorage("storage_db")
        if(storage_db !== null){
            console.log("[+] all setup, application ready to go.")
        } else {
            //Offer dialog to setup template db
            console.error("No storage_db defined.");

            //Todo
        }
    } else {
        // Offer dialog to setup app
        console.error("[!] No user_settings defined.");
        
        //Todo

        var storage_db = getFromLocalStorage("storage_db")
        if(storage_db !== null){
            console.log("[+] all setup, application ready to go.")
        } else {
            //Offer dialog to setup template db
            console.error("[!] No storage_db defined.");
        }
    }

});

function showAddItem(isEnabled){
    if(isEnabled){
        document.getElementById("addItemForm").style.display = ""
    } else {
        document.getElementById("addItemForm").style.display = "none"
    }
}

function populateAddItemForm(item){
    document.getElementById("addItemBarcode").value = item.barcode;
}

function showDisplayItem(isEnabled){
    if(isEnabled){
        document.getElementById("displayItemForm").style.display = ""
    } else {
        document.getElementById("displayItemForm").style.display = "none"
    }
}


//Manage Items
function lookupItemByBarcode(barcode){
    var tmpdb = getFromLocalStorage("storage_db")

    // Find item with barcode in database.
    var db_item = tmpdb.find(element => element.barcode === barcode);
    if(db_item !== undefined){
        showDisplayItem(true)
    } else {
        console.warn("[*] Item "+barcode+" not in database.");
        showAddItem(true)
        var item = {
            "barcode":barcode,
            "name":"",
            "brand":"",
            "location":"",
            "quantity":"",
            "expiry":""
        }
        populateAddItemForm(item)
    }
}

function addItemToDB(barcode, name, brand, location, quantity, expiry){
    var item = {
        "barcode":barcode,
        "name":name,
        "brand":brand,
        "location":location,
        "quantity":quantity,
        "expiry":expiry
    }
}


function putToLocalStorage(name, jsonData){
    localStorage.setItem(name,JSON.stringify(jsonData))
}

function getFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name))
}

function getBackup(){
    backup = {
        user_settings : getFromLocalStorage("user_settings"),
        storage_db : getFromLocalStorage("storage_db")
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

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
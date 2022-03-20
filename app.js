const fs = require('fs');
const { default: fetch } = require('node-fetch');

// This is a general function for reading JSON files
function jsonFileReader(filepath, cb){
    fs.readFile(filepath, 'utf-8', (err, fileData) => {
        if(err){
            return cb && cb(err)
        }
        try{
            const obj = JSON.parse(fileData)
            return cb && cb(null, obj);
        }
        catch(err){
            return cb && cb(err)
        }
    })
}

//This is the main app function
function CryptoPortfolio(token=null, date=null){
    // Get API key from this website: https://www.cryptocompare.com/
    API_KEY = 'your API key'
    //Validating passed values
    if(token == null || (typeof token) == 'string' || date == null || (typeof date) == 'number'){
        //Calling the JSON file reader function
        jsonFileReader("transactions.json", (err, data) => {
            if(err){
                console.log(err)
            }
            else{
                //This condition executes when the parameters are left blank when calling the CryptoPortfolio function
                if(token == null && date == null){
                    let currBTCAmt = 0
                    let currETHAmt = 0
                    let currXRPAmt = 0
                    //Looping through the entire JSON file
                    for(let i=0; i<data.results.length; i++){
                        //Calculating total BTC
                        if(data.results[i].token == 'BTC'){
                            if(data.results[i].transaction_type == 'DEPOSIT'){
                                currBTCAmt = currBTCAmt + data.results[i].amount
                            }
                            else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                currBTCAmt = currBTCAmt - data.results[i].amount
                            }
                        }
                        //Calculating total ETH
                        if(data.results[i].token == 'ETH'){
                            if(data.results[i].transaction_type == 'DEPOSIT'){
                                currETHAmt = currETHAmt + data.results[i].amount
                            }
                            else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                currETHAmt = currETHAmt - data.results[i].amount
                            }
                        }
                        //Calculating total XRP
                        if(data.results[i].token == 'XRP'){
                            if(data.results[i].transaction_type == 'DEPOSIT'){
                                currXRPAmt = currXRPAmt + data.results[i].amount
                            }
                            else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                currXRPAmt = currXRPAmt - data.results[i].amount
                            }
                        }
                    }
                    //Getting BTC, ETH & XRP price data from API and displaying the output on the console
                    fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key='+API_KEY)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        let BTC_USD = parseFloat(currBTCAmt*data.BTC.USD).toFixed(2)
                        let ETH_USD = parseFloat(currETHAmt*data.ETH.USD).toFixed(2)
                        let XRP_USD = parseFloat(currXRPAmt*data.XRP.USD).toFixed(2)
                        console.log("****************************PORTFOLIO****************************")
                        console.log("BTC: ",currBTCAmt,"\t| $",BTC_USD)
                        console.log("ETH: ",currETHAmt,"\t| $",ETH_USD)
                        console.log("XRP: ",currXRPAmt,"\t| $",XRP_USD)
                    })
                }
                //This condition executes when the token parameter has a value and date parameter is left 
                //bank when calling the CryptoPortfolio function
                else if(token != null && date == null){
                    let currTokenAmt = 0
                    //Calculating the total amount of the respective digital asset
                    for(let i=0; i<data.results.length; i++){
                        if(data.results[i].token == token){
                            if(data.results[i].transaction_type == 'DEPOSIT'){
                                currTokenAmt = currTokenAmt + data.results[i].amount
                            }
                            else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                currTokenAmt = currTokenAmt - data.results[i].amount
                            }
                        }
                    }
                    //Getting the respective digital asset price data from API and displaying the output on the console
                    fetch('https://min-api.cryptocompare.com/data/price?fsym='+token+'&tsyms=USD&api_key='+API_KEY)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        let tokenUSD = parseFloat(currTokenAmt*data.USD).toFixed(2)
                        console.log("****************************PORTFOLIO****************************")
                        console.log(token,": ",currTokenAmt,"\t| $",tokenUSD)
                    })
                }
                //This condition executes when the date parameter has a value and token parameter is set 
                //to null when calling the CryptoPortfolio function
                else if(token == null && date != null){
                    let currBTCAmt = 0
                    let currETHAmt = 0
                    let currXRPAmt = 0
                    for(let i=0; i<data.results.length; i++){
                        if(data.results[i].timestamp <= date){
                            //Upto the respective epoch, calculating the amount of BTC
                            if(data.results[i].token == "BTC"){
                                if(data.results[i].transaction_type == 'DEPOSIT'){
                                    currBTCAmt = currBTCAmt + data.results[i].amount
                                }
                                else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                    currBTCAmt = currBTCAmt - data.results[i].amount
                                }
                            }
                            //Upto the respective epoch, calculating the amount of ETH
                            else if(data.results[i].token == "ETH"){
                                if(data.results[i].transaction_type == 'DEPOSIT'){
                                    currETHAmt = currETHAmt + data.results[i].amount
                                }
                                else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                    currETHAmt = currETHAmt - data.results[i].amount
                                }
                            }
                            //Upto the respective epoch, calculating the amount of XRP
                            else if(data.results[i].token == "XRP"){
                                if(data.results[i].transaction_type == 'DEPOSIT'){
                                    currXRPAmt = currXRPAmt + data.results[i].amount
                                }
                                else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                    currXRPAmt = currXRPAmt - data.results[i].amount
                                }
                            }
                        }
                    }
                    //Getting BTC, ETH & XRP price data with respctive to the epoch from API and displaying the output on the console
                    console.log("****************************PORTFOLIO****************************")
                    fetch('https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD&ts='+date+'&api_key='+API_KEY)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        let BTC_USD = parseFloat(currBTCAmt*data.BTC.USD).toFixed(2)
                        console.log("BTC: ",currBTCAmt,"\t| $",BTC_USD)
                    })
                    fetch('https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts='+date+'&api_key='+API_KEY)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        let ETH_USD = parseFloat(currETHAmt*data.ETH.USD).toFixed(2)
                        console.log("ETH: ",currETHAmt,"\t| $",ETH_USD)
                    })
                    fetch('https://min-api.cryptocompare.com/data/pricehistorical?fsym=XRP&tsyms=USD&ts='+date+'&api_key='+API_KEY)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        let XRP_USD = parseFloat(currXRPAmt*data.XRP.USD).toFixed(2)
                        console.log("XRP: ",currXRPAmt,"\t| $",XRP_USD)
                    })
                }
                //This condition executes when both the parameters contains their respective values 
                //when calling the CryptoPortfolio function
                else if(token != null && date != null){
                    let currTokenAmt = 0
                    //Upto the respective epoch and the selected digital asset the amount is calculated
                    for(let i=0; i<data.results.length; i++){
                        if(data.results[i].token == token && data.results[i].timestamp <= date){
                            if(data.results[i].transaction_type == 'DEPOSIT'){
                                currTokenAmt = currTokenAmt + data.results[i].amount
                            }
                            else if(data.results[i].transaction_type == 'WITHDRAWAL'){
                                currTokenAmt = currTokenAmt - data.results[i].amount
                            }
                        }
                    }
                    //Getting the respective digital asset's price data with respctive to the epoch from API
                    // and displaying the output on the console
                    console.log("****************************PORTFOLIO****************************")
                    fetch('https://min-api.cryptocompare.com/data/pricehistorical?fsym='+token+'&tsyms=USD&ts='+date+'&api_key='+API_KEY)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        if(token == "BTC"){
                            tokenUSD = parseFloat(currTokenAmt*data.BTC.USD).toFixed(2)
                            console.log(token,": ",currTokenAmt,"\t| $",tokenUSD)
                        }
                        else if(token == "ETH"){
                            tokenUSD = parseFloat(currTokenAmt*data.ETH.USD).toFixed(2)
                            console.log(token,": ",currTokenAmt,"\t| $",tokenUSD)
                        }
                        else if(token == "XRP"){
                            tokenUSD = parseFloat(currTokenAmt*data.XRP.USD).toFixed(2)
                            console.log(token,": ",currTokenAmt,"\t| $",tokenUSD)
                        }
                    })
                }
            }
        })
    }
    else{
        console.log("Invalid values")
    }
    
}

CryptoPortfolio()
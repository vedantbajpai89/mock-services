(function(config) {

    function updatePaymentStatus(message){
        const updateStatus = require('fs');
        updateStatus.writeFile('status.txt',message,(err)=>{
            if(err) throw err;
        })
    }

    function checkPaymentStatus(){
        const readStatus = require('fs');
        const status = readStatus.readFileSync('status.txt','utf8');
        return status;
    }

    const obj = JSON.parse(config.request.body);

    if(obj.brandName === 'Amazon' && obj?.reference == undefined){
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Allow-Methods' : '*',
                'Access-Control-Allow-Origin' : '*'
            },
            body: "<%- stringify(filename, 'mock-responses/payment-start-success.json')%>"
        };
    }

    else if(obj.brandName === 'Amazon' && obj?.reference != undefined){
        const status = checkPaymentStatus();

        if(status === "AUTHENTICATED"){
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers' : '*',
                    'Access-Control-Allow-Methods' : '*',
                    'Access-Control-Allow-Origin' : '*'
                },
                body: "<%- stringify(filename, 'mock-responses/payment-probe-success.json')%>"
            };
        }
        else{
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers' : '*',
                    'Access-Control-Allow-Methods' : '*',
                    'Access-Control-Allow-Origin' : '*'
                },
                body: "<%- stringify(filename, 'mock-responses/payment-probe-fail.json')%>"
            };

        }
    }

    else if(obj?.cardHolderName != undefined ){

        if(obj.cardHolderName === "Vedant"){
            updatePaymentStatus("AUTHENTICATED");
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers' : '*',
                    'Access-Control-Allow-Methods' : '*',
                    'Access-Control-Allow-Origin' : '*'
                },
                body: "<%- stringify(filename, 'mock-responses/payment-validate-success.json')%>"
            };
        }
        else{
            updatePaymentStatus("AUTHENTICATION_FAILED");
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers' : '*',
                    'Access-Control-Allow-Methods' : '*',
                    'Access-Control-Allow-Origin' : '*'
                },
                body: "<%- stringify(filename, 'mock-responses/payment-validate-fail.json')%>"
            };

        }
    }
    else{
        updatePaymentStatus("FAILED");
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers' : '*',
                    'Access-Control-Allow-Methods' : '*',
                    'Access-Control-Allow-Origin' : '*'
                },
                body: "Bad request"
            };

    }




})
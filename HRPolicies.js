var builder = require('botbuilder');
var https = require('https');

module.exports = [

    function (session) {
        builder.Prompts.text(session, 'Ok! Shoot what do you have in your mind.');
    },
    function (session, results) {
        session.dialogData.Qna = results.response;
        //@todo: go to qnamaker service and ask this question

        console.log(results.response);
        jsonObject = JSON.stringify({"question":results.response});

        var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8'),
        'Ocp-Apim-Subscription-Key': 'b2450b5c361840ee9ee4561bc42117da'           
        };


        var options = {
            host: 'westus.api.cognitive.microsoft.com',
            path: '/qnamaker/v1.0/knowledgebases/3c695ee2-c591-4214-9ee6-1f4714562422/generateAnswer',
            method: 'POST',
            headers : postheaders
            };
            
        // do the POST call
        var reqPost = https.request(options, function(res) {
            console.log("statusCode: ", res.statusCode);
            // uncomment it for header details
           console.log("headers: ", res.headers);

            res.on('data', function(d) {
                console.info('POST result:\n');
                console.log(d);
                var resVal = d.toString('utf8');
                session.send('this is the response according to FAQs available.');
                session.send(JSON.parse(resVal).answer);
                session.endDialog();
                console.info('\n\nPOST completed');
                //session.beginDialog('/');
            });
        });

        // write the json data
        reqPost.write(jsonObject);
        reqPost.end();
        reqPost.on('error', function(e) {
            console.error(e);
        });

    }
];

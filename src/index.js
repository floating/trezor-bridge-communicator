import request from 'request';

const isBridgeConnected = async () => {
    request.get('http://localhost:21325/status/', {
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            throw Error(`Bridge is not connected', ${error}`);
        } else {
            console.log('Bridge is connected');
            return true;
        }
    });
};

// request.get('http://localhost:21325/status/', {
// }, (error, response) => {
//     if (error || response.statusCode !== 200) {
//         throw Error(`Bridge is not connected', ${error}`);
//     } else {
//         request.post('http://localhost:21325/enumerate', {}, (error, response) => {
//             if (error) {
//                 throw Error(`Bridge is not connected', ${error}`);
//             } else {
//                 console.log(response.body);
//             }
//         });
//     }
// });

(async () => {
    await isBridgeConnected();
})();

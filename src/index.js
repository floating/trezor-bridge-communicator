import request from 'request';

const isBridgeConnected = async () => new Promise(((resolve, reject) => {
    request.get('http://127.0.0.1:21325/status/', {
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            reject(error);
        } else {
            console.log('Bridge is connected');
            resolve(true);
        }
    });
}
));

const getDevices = async () => new Promise(((resolve, reject) => {
    request.post('http://127.0.0.1:21325/enumerate', {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            resolve(res.toJSON().body);
        }
    });
}));

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
    const devices = JSON.parse(await getDevices());
    const { path } = devices[0];

    console.log('path', path);
})();

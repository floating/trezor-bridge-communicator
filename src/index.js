import request from 'request';

const isBridgeConnected = async () => {
    request.get('http://127.0.0.1:21325/status/', {
    }, (error, response) => {
        if (error || response.statusCode !== 200) {
            throw Error(`Cannot connect to bridge', ${error}`);
        } else {
            console.log('Bridge is connected');
            return true;
        }
    });
};

const enumerate = async () => {
    request.post('http://127.0.0.1:21325/enumerate', {
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:21325',
        },
    }, (error, response) => {
        if (error) {
            console.log('error');
            throw Error(`Listen error, is bridge connected?', ${error}`);
        } else {
            console.log('response', response.toJSON());
            return response.body;
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
    console.log('aaa');
    await isBridgeConnected();
    const devices = await enumerate();

    console.log('device', devices);
})();

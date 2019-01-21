import request from 'request';

const isBridgeConnected = async () => new Promise(((resolve, reject) => {
    request.get('http://127.0.0.1:21325/status/', (error, response) => {
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

const acquire = async path => new Promise(((resolve, reject) => {
    request.post(`http://127.0.0.1:21325/acquire/${path}`, {
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

const getSession = async (devices) => {
    if (!devices[0].session) {
        await acquire(devices[0].path);
    }
    return devices[0].session;
};

(async () => {
    await isBridgeConnected();
    const devices = JSON.parse(await getDevices());
    const session = await getSession(devices);
})();

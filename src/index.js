import request from 'request';
import protobufjs from 'protobufjs';
import loadDevice from '../loadDevice.json';

const TYPES = {
    LOAD_DEVICE: 13,
};

const ACTIONS = {
    BUTTON_ACK: '001b00000000',
    CONFIRM: '0064000000020801',
};

const isBridgeConnected = async () => new Promise(((resolve, reject) => {
    request.get('http://127.0.0.1:21325/status/', (error, response) => {
        if (error || response.statusCode !== 200) {
            reject(error);
        } else {
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

const acquire = async (path, previousSession, isDebug) => new Promise(((resolve, reject) => {
    const urlPart = isDebug ? 'debug/' : '';
    request.post(`http://127.0.0.1:21325/${urlPart}acquire/${path}/${previousSession}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            resolve(JSON.parse(res.toJSON().body));
        }
    });
}));

const release = async session => new Promise(((resolve, reject) => {
    request.post(`http://127.0.0.1:21325/release/${session}`, {
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

const compose = (buf, type) => {
    const header = Buffer.alloc(6);
    header.writeUInt16BE(type, 0);
    header.writeUInt32BE(buf.length, 2);

    return Buffer.concat([header, buf]);
};

const callHex = async (session, hex) => new Promise(((resolve, reject) => {
    console.log('calling hex', hex, 'with sesion', session);
    request.post(`http://127.0.0.1:21325/call/${session}`, {
        body: hex,
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

const postHex = async (session, hex) => new Promise(((resolve, reject) => {
    console.log('calling post', hex, 'with sesion', session);
    request.post(`http://127.0.0.1:21325/post/${session}`, {
        body: hex,
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

const initDevice = async session => new Promise(((resolve, reject) => {
    const root = protobufjs.Root.fromJSON(loadDevice);
    const LoadDeviceMessage = root.lookupType('LoadDevice');

    const message = LoadDeviceMessage.encode({ mnemonic: 'all all all all all all all all all all all all' }).finish();
    const composedMessage = compose(message, TYPES.LOAD_DEVICE);

    request.post(`http://127.0.0.1:21325/call/${session}`, {
        body: composedMessage.toString('hex'),
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, async (error, res) => {
        if (error) {
            reject(error);
        } else {
            await callHex(session, ACTIONS.BUTTON_ACK);
            await postHex(session, ACTIONS.CONFIRM);
            resolve(res.toJSON().body);
        }
    });
}));

(async () => {
    await isBridgeConnected();

    const devices = JSON.parse(await getDevices());
    console.log('devices', devices);
    if (devices.length <= 0) {
        throw Error('No connected devices');
    }

    const { path, session } = devices[0];
    const acquiredDevice = await acquire(path, session, false);
    console.log('acquiredDevice', acquiredDevice);
    // await initDevice(session);
    // await release(session);
})();

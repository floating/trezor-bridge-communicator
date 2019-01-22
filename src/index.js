import request from 'request';
import protobufjs from 'protobufjs';
import loadDevice from '../loadDevice.json';

const TYPES = {
    LOAD_DEVICE: 13,
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
    let result;
    if (devices.length <= 0) {
        throw Error('No connected devices');
    }
    if (!devices[0].session) {
        result = await acquire(devices[0].path).session;
    } else {
        result = devices[0].session;
    }
    return result;
};

const compose = (buf, type) => {
    const header = Buffer.alloc(6);
    header.writeUInt16BE(type, 0);
    header.writeUInt32BE(buf.length, 2);

    return Buffer.concat([header, buf]);
};

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
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            resolve(res.toJSON().body);
        }
    });
}));

(async () => {
    await isBridgeConnected();
    const devices = JSON.parse(await getDevices());
    const session = await getSession(devices);
    await initDevice(session);
})();

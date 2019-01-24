import request from 'request';
import protobufjs from 'protobufjs';
import loadDevice from '../loadDevice.json';

const isDebug = true;

const TYPES = {
    LOAD_DEVICE: 13,
};

const ACTIONS = {
    ACK: '001b00000000',
    CONFIRM: '0064000000020801',
};

const isBridgeConnected = async () => new Promise(((resolve, reject) => {
    request.get('http://127.0.0.1:21325/status/', (error, response) => {
        if (error || response.statusCode !== 200) {
            reject(error);
        } else {
            if (isDebug) {
                console.log('Bridge is connected');
            }
            resolve(true);
        }
    });
}
));

const getDevices = async () => new Promise(((resolve, reject) => {
    if (isDebug) {
        console.log('get devices start');
    }
    request.post('http://127.0.0.1:21325/enumerate', {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            if (isDebug) {
                console.log('get devices success');
            }
            resolve(res.toJSON().body);
        }
    });
}));

const acquire = async (path, previousSession) => new Promise(((resolve, reject) => {
    if (isDebug) {
        console.log('start acquiring session on path', path);
    }
    request.post(`http://127.0.0.1:21325/acquire/${path}/${previousSession}`, {
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

const acquireDebug = async (path, previousSession) => new Promise(((resolve, reject) => {
    if (isDebug) {
        console.log('start acquiring debug session on path', path);
    }
    request.post(`http://127.0.0.1:21325/debug/acquire/${path}/${previousSession}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            console.log('successfully acquired debug session with path', path);
            resolve(JSON.parse(res.toJSON().body));
        }
    });
}));

const release = async session => new Promise(((resolve, reject) => {
    if (isDebug) {
        console.log('start release session', session);
    }
    request.post(`http://127.0.0.1:21325/release/${session}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            console.log('successfully released session', session);
            resolve(res.toJSON().body);
        }
    });
}));

const releaseDebug = async session => new Promise(((resolve, reject) => {
    if (isDebug) {
        console.log('start release debug session', session);
    }
    request.post(`http://127.0.0.1:21325/debug/release/${session}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            if (isDebug) {
                console.log('successfully released debug session', session);
            }
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
    if (isDebug) {
        console.log('calling hex', hex, 'with sesion', session);
    }
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

const postHexDebug = async (session, hex) => new Promise(((resolve, reject) => {
    if (isDebug) {
        console.log('calling post', hex, 'with sesion', session);
    }
    request.post(`http://127.0.0.1:21325/debug/post/${session}`, {
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
            resolve(res.toJSON().body);
        }
    });
}));

(async () => {
    await isBridgeConnected();

    // get emulator device (first and only one)
    const devices = JSON.parse(await getDevices());
    if (devices.length <= 0) {
        throw Error('No connected devices');
    }

    const { path, session, debugSession } = devices[0];

    // acquire device
    const acquiredDevice = await acquire(path, session, false);

    // acquire debug session
    const acquiredDebugDevice = await acquireDebug(path, debugSession, true);

    // load device with all seed
    await initDevice(acquiredDevice.session);
    await callHex(acquiredDevice.session, ACTIONS.ACK);

    // response confirm on device
    await postHexDebug(acquiredDebugDevice.session, ACTIONS.CONFIRM);

    // release sessions
    await release(acquiredDevice.session);
    await releaseDebug(acquiredDebugDevice.session);
})();

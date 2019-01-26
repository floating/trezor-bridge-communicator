import request from 'request';
import debug from 'debug';
import protobufjs from 'protobufjs';
import messages from 'messages.json';
import { compose } from 'message';
import constants from 'constants';

const postHexDebug = async (session, hex) => new Promise(((resolve, reject) => {
    debug('calling post', hex, 'with sesion', session);
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

const loadDevice = async session => new Promise(((resolve, reject) => {
    const root = protobufjs.Root.fromJSON(messages);
    const LoadDeviceMessage = root.lookupType('LoadDevice');

    const message = LoadDeviceMessage.encode({ mnemonic: 'all all all all all all all all all all all all' }).finish();
    const composedMessage = compose(message, constants.TYPES.LOAD_DEVICE);

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

const acquire = async (path, previousSession) => new Promise(((resolve, reject) => {
    debug('start acquiring session on path', path);
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
    debug('start acquiring debug session on path', path);
    request.post(`http://127.0.0.1:21325/debug/acquire/${path}/${previousSession}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            debug('successfully acquired debug session with path', path);
            resolve(JSON.parse(res.toJSON().body));
        }
    });
}));

const release = async session => new Promise(((resolve, reject) => {
    debug('start release session', session);
    request.post(`http://127.0.0.1:21325/release/${session}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            debug('successfully released session', session);
            resolve(res.toJSON().body);
        }
    });
}));

const releaseDebug = async session => new Promise(((resolve, reject) => {
    debug('start release debug session', session);
    request.post(`http://127.0.0.1:21325/debug/release/${session}`, {
        headers: {
            Origin: 'https://wallet.trezor.io',
        },
    }, (error, res) => {
        if (error) {
            reject(error);
        } else {
            debug('successfully released debug session', session);
            resolve(res.toJSON().body);
        }
    });
}));

const callHex = async (session, hex) => new Promise(((resolve, reject) => {
    debug('calling hex', hex, 'with sesion', session);
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

export {
    acquire,
    acquireDebug,
    callHex,
    postHexDebug,
    release,
    releaseDebug,
    loadDevice,
};

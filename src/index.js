import {
    acquire,
    acquireDebug,
    callHex,
    postHexDebug,
    release,
    releaseDebug,
    loadDevice,
} from 'api';

import request from 'request';
import { isBridgeConnected } from 'connection';
import constants from './constants';

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

const initSeedAllDevice = async () => {
    try {
        await isBridgeConnected();

        // get emulator device (first and only one)
        const devices = JSON.parse(await getDevices());
        if (devices.length <= 0) {
            throw Error('No connected devices');
        }

        const { path, session, debugSession } = devices[0];

        // acquire device
        const acquiredDevice = await acquire(path, session);

        // acquire debug session
        const acquiredDebugDevice = await acquireDebug(path, debugSession);

        // load device with all seed
        await loadDevice(acquiredDevice.session);

        await callHex(acquiredDevice.session, constants.ACTIONS.ACK);

        // response confirm on device
        await postHexDebug(acquiredDebugDevice.session, constants.ACTIONS.CONFIRM);

        // release sessions
        await release(acquiredDevice.session);
        await releaseDebug(acquiredDebugDevice.session);
    } catch (err) {
        console.error(err);
    }
};

// test with device
// (async () => {
//     await initSeedAllDevice();
// })();

export {
    initSeedAllDevice,
    getDevices,
};

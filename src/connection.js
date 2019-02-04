import request from 'request';
import debug from 'debug';

const isBridgeConnected = async () => new Promise(((resolve, reject) => {
    console.log('[trezor-bridge-communicator] Bridge is connected');
    request.get('http://127.0.0.1:21325/status/', (error, response) => {
        if (error || response.statusCode !== 200) {
            reject(error);
        } else {
            debug('Bridge is connected');
            resolve(true);
        }
    });
}
));

export {
    isBridgeConnected,
};

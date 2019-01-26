const compose = (buf, type) => {
    const header = Buffer.alloc(6);
    header.writeUInt16BE(type, 0);
    header.writeUInt32BE(buf.length, 2);

    return Buffer.concat([header, buf]);
};

export {
    compose,
};

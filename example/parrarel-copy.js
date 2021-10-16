"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const fs_2 = require("fs");
const promises_2 = require("stream/promises");
const controlable_stream_1 = require("controlable-stream");
const tasuku_1 = __importDefault(require("tasuku"));
function getFileStat(filePath) {
    return (0, promises_1.access)(filePath, fs_1.constants.F_OK | fs_1.constants.R_OK)
        .then(() => (0, promises_1.stat)(filePath))
        .catch(() => null);
}
function copy(filePath, destPath) {
    const taskTitle = `copy ${filePath} -> ${destPath}`;
    let percentage = 0;
    return (0, tasuku_1.default)(`${taskTitle} start`, async ({ setTitle, setStatus, setError }) => {
        setTitle(`${taskTitle} progress`);
        const fileStat = await getFileStat(filePath);
        if (fileStat === null) {
            return setError(`not accessable file = ${filePath}`);
        }
        const rStream = (0, fs_2.createReadStream)(filePath);
        const cStream = new controlable_stream_1.ControlableStream(Infinity, 100); // no limit
        const wStream = (0, fs_2.createWriteStream)(destPath);
        setStatus(`read ${percentage}%`);
        cStream.setOnAddHistory((speed, historys) => {
            const h = historys.at(-1);
            const nowPercentage = Math.floor((cStream.getTotalByte() / fileStat.size) * 100);
            if (percentage !== nowPercentage) {
                percentage = nowPercentage;
                setStatus(`read ${percentage}%, ${speed}byte/s`);
            }
        });
        rStream.pipe(cStream).pipe(wStream);
        await (0, promises_2.finished)(wStream).then(() => {
            setTitle(`${taskTitle} finish`);
        });
    });
}
exports.copy = copy;
copy(`A:\\test.mp4`, `A:\\test2.mp4`);
copy(`A:\\test.mp4`, `A:\\test3.mp4`);
copy(`A:\\test.mp4`, `A:\\test4.mp4`);
copy(`A:\\test.mp4`, `A:\\test5.mp4`);
copy(`A:\\test.mp4`, `A:\\test6.mp4`);
copy(`A:\\test.mp4`, `A:\\test7.mp4`);

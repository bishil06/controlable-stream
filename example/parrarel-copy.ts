import { constants } from 'fs';
import { access, stat } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { finished } from 'stream/promises';
import { ControlableStream } from 'controlable-stream';
import task from 'tasuku';

function getFileStat(filePath: string) {
  return access(filePath, constants.F_OK | constants.R_OK)
    .then(() => stat(filePath))
    .catch(() => null);
}

export function copy(filePath: string, destPath: string) {
  const taskTitle = `copy ${filePath} -> ${destPath}`;
  let percentage = 0;

  return task(
    `${taskTitle} start`,
    async ({ setTitle, setStatus, setError }) => {
      setTitle(`${taskTitle} progress`);

      const fileStat = await getFileStat(filePath);
      if (fileStat === null) {
        return setError(`not accessable file = ${filePath}`);
      }

      const rStream = createReadStream(filePath);
      const cStream = new ControlableStream(Infinity, 100); // no limit
      const wStream = createWriteStream(destPath);

      setStatus(`read ${percentage}%`);

      cStream.setOnAddHistory((speed, historys) => {
        const h = historys.at(-1);

        const nowPercentage = Math.floor(
          (cStream.getTotalByte() / fileStat.size) * 100
        );

        if (percentage !== nowPercentage) {
          percentage = nowPercentage;
          setStatus(`read ${percentage}%, ${speed}byte/s`);
        }
      });

      rStream.pipe(cStream).pipe(wStream);

      await finished(wStream).then(() => {
        setTitle(`${taskTitle} finish`);
      });
    }
  );
}

copy(`A:\\test.mp4`, `A:\\test2.mp4`);
copy(`A:\\test.mp4`, `A:\\test3.mp4`);
copy(`A:\\test.mp4`, `A:\\test4.mp4`);
copy(`A:\\test.mp4`, `A:\\test5.mp4`);
copy(`A:\\test.mp4`, `A:\\test6.mp4`);
copy(`A:\\test.mp4`, `A:\\test7.mp4`);

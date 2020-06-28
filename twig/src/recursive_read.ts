import glob from "glob";
import * as path from "path";

export default function globPromise (dir, asObject = false) {
    return new Promise ((resolve, reject) => {
        glob(path.resolve(`${dir}/**/*`), {strict: false, silent: true, nodir: true}, (err, files) => {
            if (err) {
                reject(err);
            } else {
                if (asObject) {
                    let filesObject = files.map(file => {
                        let regexp = /^(.*[\\\/])(.*)$/;
                        let match = regexp.exec(file);
                        return {
                            fullpath: file,
                            filepath: match[1],
                            filename: match[2],
                            dirname: regexp.exec(match[1].substring(0, match[1].length -1))[2],
                        };
                    })
                    resolve(filesObject);
                } else {
                    resolve(files);
                }
            }
        })
    })
}

import chokidar from 'chokidar';
import { addDataToVectorStore } from "../models/VectorStore";
import path from "path";

class FileWatcher {
    constructor(dataDir) {
        this.dataDir = dataDir;
    }

    startWatching() {
        const watcher = chokidar.watch(path.resolve('./data'), {
            ignoreInitial: true,
            depth:0,
        });

        watcher.on('add', async filePath => {
            console.log(`📥 Nuovo PDF in data/: ${filePath}`);
            try {
                await addDataToVectorStore(filePath);
            } catch (err) {
                console.error(`❌ Non ho potuto embeddare ${filePath}: ${err.message}`);
            }
        });

        console.log('🔄 Monitoraggio dei file avviato...');
    }
}

export default FileWatcher;
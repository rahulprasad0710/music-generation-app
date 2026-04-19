import { startAudioWorker } from "./audio.worker";

async function startWorker() {
    await startAudioWorker();
}

export default startWorker;

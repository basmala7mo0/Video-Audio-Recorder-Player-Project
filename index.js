let mediaRecorder;
let recordedChunks = [];
let mediaStream;
let isRecording = false;
let mediaType = '';

const preview = document.getElementById('preview');
const playbackVideo = document.getElementById('playback-video');
const playbackAudio = document.getElementById('playback-audio');
const recordVideoBtn = document.getElementById('record-video');
const recordAudioBtn = document.getElementById('record-audio');
const stopRecordBtn = document.getElementById('stop-record');
const downloadVideoBtn = document.getElementById('download-video');
const downloadAudioBtn = document.getElementById('download-audio');
const playVideoBtn = document.getElementById('play-video');
const pauseVideoBtn = document.getElementById('pause-video');
const fastForwardBtn = document.getElementById('fast-forward');
const rewindBtn = document.getElementById('rewind');
const videoPreviewBox = document.getElementById('video-preview-box');

recordVideoBtn.addEventListener('click', () => startRecording('video'));
recordAudioBtn.addEventListener('click', () => startRecording('audio'));
stopRecordBtn.addEventListener('click', stopRecording);
downloadVideoBtn.addEventListener('click', () => downloadMedia('video'));
downloadAudioBtn.addEventListener('click', () => downloadMedia('audio'));
playVideoBtn.addEventListener('click', () => {
    console.log('Play Video');
    playbackVideo.play();
});
pauseVideoBtn.addEventListener('click', () => {
    console.log('Pause Video');
    playbackVideo.pause();
});
fastForwardBtn.addEventListener('click', () => {
    console.log('Fast Forward');
    playbackVideo.currentTime += 10;
});
rewindBtn.addEventListener('click', () => {
    console.log('Rewind');
    playbackVideo.currentTime -= 10;
});

async function startRecording(type) {
    mediaType = type;
    recordedChunks = [];
    
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia(
            type === 'video' ? { video: true, audio: true } : { audio: true }
        );

        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (event) => recordedChunks.push(event.data);
        mediaRecorder.onstop = saveRecording;
        mediaRecorder.start();
        
        isRecording = true;
        stopRecordBtn.disabled = false;
        recordVideoBtn.disabled = true;
        recordAudioBtn.disabled = true;
        videoPreviewBox.classList.add(type === 'video' ? 'recording-video' : 'recording-audio');
        preview.srcObject = type === 'video' ? mediaStream : null;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaStream.getTracks().forEach(track => track.stop());
        isRecording = false;
        stopRecordBtn.disabled = true;
        recordVideoBtn.disabled = false;
        recordAudioBtn.disabled = false;
        videoPreviewBox.classList.remove('recording-video', 'recording-audio');
    }
}

function saveRecording() {
    const blob = new Blob(recordedChunks, { type: mediaType === 'video' ? 'video/webm' : 'audio/webm' });
    const url = URL.createObjectURL(blob);

    if (mediaType === 'video') {
        playbackVideo.src = url;
        downloadVideoBtn.dataset.url = url;
    } else {
        playbackAudio.src = url;
        downloadAudioBtn.dataset.url = url;
    }
}

function downloadMedia(type) {
    const url = type === 'video' ? downloadVideoBtn.dataset.url : downloadAudioBtn.dataset.url;
    if (!url) return;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'video' ? 'recording.webm' : 'audio_recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function showSkipEffect(text) {
    const skipEffect = document.getElementById('skip-effect');
    skipEffect.innerText = text;
    skipEffect.style.opacity = '1';

    setTimeout(() => {
        skipEffect.style.opacity = '0';
    }, 700);
}

fastForwardBtn.addEventListener('click', () => {
    playbackVideo.currentTime += 10;
    showSkipEffect('>> +10s');
});

rewindBtn.addEventListener('click', () => {
    playbackVideo.currentTime -= 10;
    showSkipEffect('<< -10s');
});

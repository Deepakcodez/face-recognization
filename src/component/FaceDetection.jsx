
import React, { useEffect, useRef,  } from 'react';
import * as faceapi from 'face-api.js';
const FaceDetection = () => {

    const videoRef = useRef(null)
   

    useEffect(() => {
        const loadModels = () => {
            const ModelURI = '../../public/models';
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(ModelURI),
                faceapi.nets.faceLandmark68Net.loadFromUri(ModelURI),
                faceapi.nets.faceRecognitionNet.loadFromUri(ModelURI),
                faceapi.nets.faceExpressionNet.loadFromUri(ModelURI),
            ]).then(() => startCamera()); 
        }
        loadModels();
    }, []);


    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        }
    };

    const responseFromDetection = async () => {
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions).withFaceLandmarks().withFaceExpressions();
        console.log('>>>>>>>>>>>', detections)
    }
        responseFromDetection()
   

    return (
        <>
            face detection
            <video ref={videoRef} autoPlay muted height={450} width={450} />
        </>
    );
}


export default FaceDetection
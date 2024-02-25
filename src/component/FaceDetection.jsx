import React, { useContext, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { AuthContext } from '../Context';
import { useNavigate } from 'react-router-dom';

const FaceDetection = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const navigate = useNavigate();
    const [intervalId,  setIntervalId] = useState(null)
    const { setIsAuthenticated } = useContext(AuthContext);
    const [isFaceStraight, setIsFaceStraight] = useState(false);

    // LOAD FROM USEEFFECT
    useEffect(() => {
        startVideo();
        videoRef && loadModels();

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // OPEN YOU FACE WEBCAM
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // LOAD MODELS FROM FACE API
    const loadModels = async () => {
        await Promise.all([
            // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ]);

        faceMyDetect();
    };

    const faceMyDetect = () => {
        const id = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(videoRef.current,
                new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

            if (detections.length > 0) {
                const faceLandmarks = detections[0].landmarks;
                const leftEye = faceLandmarks.getLeftEye();
                const rightEye = faceLandmarks.getRightEye();
                const nose = faceLandmarks.getNose();
                // Calculate angle between eyes and nose
                const angle = calculateAngle(leftEye[0], rightEye[0], nose[2]);
                setIsFaceStraight(angle < 20); // Set threshold angle as per your requirement
                setIsAuthenticated(angle < 20); // Set authentication based on face straightness
                console.log(angle < 20 ? 'Face is straight' : 'Face is not straight');
            } else {
                setIsAuthenticated(false); // No face detected
                console.log('>>>>>>>>>>>face not straight')
            }

            // DRAW YOU FACE IN WEBCAM
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
            faceapi.matchDimensions(canvasRef.current, {
                width: 940,
                height: 650
            });

            const resized = faceapi.resizeResults(detections, {
                width: 940,
                height: 650
            });

            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        }, 1000);
        setIntervalId(id)
        return id;
    };

    const calculateAngle = (p1, p2, p3) => {
        const angleRad = Math.atan2(p3.y - p1.y, p3.x - p1.x) - Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return Math.abs(angleRad * 180 / Math.PI);
    };

    useEffect(() => {
        if (!isFaceStraight) {
            setIsAuthenticated(false);
        }
    }, [isFaceStraight, setIsAuthenticated]);

    return (
        <div className="flex bg-blue-400 h-screen w-full items-center justify-center">
            <div className="appvide bg-red-400">
                <video crossOrigin="anonymous" ref={videoRef} autoPlay />
            </div>
            <canvas ref={canvasRef} className="bg-red-400/25 absolute" />
        </div>
    );
};

export default FaceDetection;

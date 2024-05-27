import { useEffect, useRef } from 'react';

export const VideoPlayer: React.FC<{stream: MediaStream}> = ({stream} : {stream: MediaStream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current) videoRef.current.srcObject = stream;
    }, [stream])

    return (<video ref={videoRef} autoPlay muted={true}/>)
}
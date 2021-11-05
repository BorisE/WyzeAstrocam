# WyzeAstrocam

    getAstroCamShot.js
    (c) by Boris Emchenko 2021
    
    Script for creating combined (integrated) image from WyzeCam v3 RTSP stream
    
    1) Get N frames, save it to disk
    2) Check if they are different
    3) Combine them (by averaging)

    Need to install:
    1) ffmpeg package  
    Zeranoe FFmpeg Builds <http://ffmpeg.zeranoe.com/builds/>
    tested with build: ffmpeg-20200424-a501947-win64-static

    2) GraphicsMagick package
    ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/
    tested with 1.3.36-Q16

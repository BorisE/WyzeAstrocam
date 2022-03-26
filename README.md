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


	Prerequests: WyzeCam need to be flashed with special (official beta) firmware to have RTSP streaming available
	
	Utilities:
	1) getAstroCamShot.js
		- script for creating combined (integrated) image from WyzeCam v3 RTSP stream
			1) Get N frames, save it to disk
			2) Check if they are different
			3) Combine them (by averaging)
	2) makeAVI.js
		- script for creating timelapse video from images grabbed from WyzeCam v3 RTSP stream
			1) Copy images to avitempfolder and rename them (0001 - 9999), so ffmpeg could work with them
			2) Make video from individual frames (ffmpeg)
			If file AstroCam_overlay.png found it would be overlayed over movie
			
			
	Other files:
	1) getAstroCamShot.bat
		- bat wrapper for getAstroCamShot.js
	2) makeAVI.bat
		- bat wrapper for makeAVI.js
	3) get_wyze_image.bat
		- bat file for debuging
	4) sum_images.bat
		- bat file for debuging

# WyzeAstrocam

    getAstroCamShot.js & makeAVI.js
    (c) by Boris Emchenko 2021-2022
    
    Script for creating combined (integrated) image from WyzeCam v3 RTSP stream
	Prerequests: WyzeCam need to be flashed with special (official beta) firmware to have RTSP streaming available
    
    1) Get N frames, save it to disk
    2) Check if they are different
    3) Combine them (by averaging) into one final frame
	4) Make avi from final frames

    Need to install:
    1) ffmpeg package  
    Zeranoe FFmpeg Builds <http://ffmpeg.zeranoe.com/builds/>
    tested with build: ffmpeg-20200424-a501947-win64-static

    2) GraphicsMagick package
    ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/
    tested with 1.3.36-Q16

	3) If you want to run tasks based on sunrise/sunset events, you may need Sunwait utility
	https://sourceforge.net/projects/sunwait4windows/
	Then you should use version of utilities with "on sunrise" suffix in task scheduler


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
	"On sunrise" version blocks running until sunrise|sunset events (for use with task schedule)
	1) getAstroCamShot.bat | getAstroCamShot_sunevents.bat
		- bat wrapper for getAstroCamShot.js
	2) makeAVI.bat | makeAVI_on_sunrise.bat
		- bat wrapper for makeAVI.js
	3) archiveImages.bat | archiveImages_on_sunrise.bat	
		- upload avi and moves avi frames to archive. 
	4) list_events.bat
		- list run times for current day 

	For debug purposes only:
	1) get_wyze_image.bat
		- bat file for debuging saving images from camera
	2) sum_images.bat
		- bat file for debuging combining images


	Using TASK SCHEDULER
	
	Recommended to create 3 task:
	1) Run getAstroCamShot.js (or getAstroCamShot_sunevents.bat) as often as you wish (be carefull not to run too frequently) from till  you need it 
		example - timelapse_taskmanager.xml
		advice: Task should be run like this: "cmd" and parameters "/c start /min "WyzeCam" D:\ASCOMscripts\WyzeAstrocam\getAstroCamShot_sunevents.bat ^& exit" - then program will start minimized
	2) Run makeAVI.js (or makeAVI_on_sunrise.bat) when you want to create AVI from the files, that are present in image folder at this moment. I run it after task 1 stops running (in morning)
		example - timelapse_makeavi_taskmanager.xml
	3) Run archiveImages (or archiveImages_on_sunrise.bat) after task 2 finishing to move frames to archive folder. Or just delete them
		example - timelapse_archiveimages_taskmanager.xml
	
	
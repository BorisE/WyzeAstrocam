# WyzeAstrocam

getAstroCamShot.js & makeAVI.js  
(c) by Boris Emchenko 2021-2025

Script for creating a combined (integrated) image from a WyzeCam v3 RTSP stream.  
Prerequisites: the WyzeCam must be flashed with the official beta firmware to enable RTSP streaming.

1) Capture N frames and save them to disk.  
2) Check that the frames are different.  
3) Combine them by averaging into one final frame.  
4) Make an AVI from the final frames.

Required software:
1) ffmpeg package  
   Zeranoe FFmpeg Builds <http://ffmpeg.zeranoe.com/builds/>  
   tested with build: ffmpeg-20200424-a501947-win64-static

2) GraphicsMagick package  
   ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/  
   tested with 1.3.36-Q16

3) If you want to run tasks based on sunrise/sunset events, you may need the Sunwait utility:  
   https://sourceforge.net/projects/sunwait4windows/  
   Use the versions of utilities with the "on sunrise" suffix in the task scheduler.


	Utilities:
        1) getAstroCamShot.js
                - script for creating combined (integrated) images from a WyzeCam v3 RTSP stream
                        1) Capture N frames and save them to disk
                        2) Check that the frames are different
                        3) Combine them by averaging
        2) makeAVI.js
                - script for creating timelapse video from images grabbed from WyzeCam v3 RTSP stream
                        1) Copy images to avitempfolder and rename them (0001 - 9999), so ffmpeg could work with them
                        2) Make video from individual frames (ffmpeg)
                        If AstroCam_overlay.png is found it will be overlaid on the movie
			
	Other files:
	"On sunrise" version blocks running until sunrise|sunset events (for use with task schedule)
	1) getAstroCamShot.bat | getAstroCamShot_sunevents.bat
		- bat wrapper for getAstroCamShot.js
	2) makeAVI.bat | makeAVI_on_sunrise.bat
		- bat wrapper for makeAVI.js
        3) archiveImages.bat | archiveImages_on_sunrise.bat
                - uploads the AVI and moves frames to the archive
	4) list_events.bat
		- list run times for current day 

	For debug purposes only:
        1) get_wyze_image.bat
                - batch file for debugging image captures from the camera
        2) sum_images.bat
                - batch file for debugging image combination


	Using TASK SCHEDULER
	
        Recommended to create three tasks:
        1) Run getAstroCamShot.js (or getAstroCamShot_sunevents.bat) as often as you wish (be careful not to run too frequently) from till you need it
		example - timelapse_taskmanager.xml
		advice: Task should be run like this: "cmd" and parameters "/c start /min "WyzeCam" D:\ASCOMscripts\WyzeAstrocam\getAstroCamShot_sunevents.bat ^& exit" - then program will start minimized
        2) Run makeAVI.js (or makeAVI_on_sunrise.bat) when you want to create an AVI from the files that are present in the image folder at that moment. Run it after task 1 stops (in the morning)
		example - timelapse_makeavi_taskmanager.xml
        3) Run archiveImages (or archiveImages_on_sunrise.bat) after task 2 finishes to move frames to the archive folder, or just delete them
                example - timelapse_archiveimages_taskmanager.xml

## Version history

### getAstroCamShot.js
- v2.3 [2025-08-30] - detect mount motion and append distance to filenames
- v2.2 [2025-08-30] - bugfix (codex pass)
- v2.1 [2025-08-30] - connect to ASCOM telescope to append Alt/Az coordinates and pier side letters to filenames
- v2.0 [2025-08-29] - connect to ASCOM telescope to append Alt/Az coordinates to filenames
- v1.2 [2021-11-05] - path for output images and command line parameters for debug output
- v1.1 [2021-11-02] - check if temp image folder exists and create it
- v1.0 [2021-11-01] - tested working release

### makeAVI.js
- v2.0 [2023-10-15] - Keogram creation
- v1.0 [2021-11-06] - tested working release


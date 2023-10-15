/*
    makeAVI.js
    (c) by Boris Emchenko 2021
    
    Script for creating timelapse video from images grabbed from WyzeCam v3 RTSP stream
    
    1) Copy images to avitempfolder and rename them (0001 - 9999), so ffmpeg could work with them
    2) Make video from individual frames (ffmpeg)

    Need to install:
    1) ffmpeg package  
    Zeranoe FFmpeg Builds <http://ffmpeg.zeranoe.com/builds/>
    tested with build: ffmpeg-20200424-a501947-win64-static


    v 2.0 [2023-10-15]
    - Keogram creation
    v 1.0 [2021-11-06]
    - tested working release

    Command line parameters:
    -debug or -verbose: output messages (better to use in cscript mode)
   
*/

//Options initialization
var FFMPEG_PATH= "e:\\Miscellaneous\\ffmpeg\\bin\\ffmpeg.exe";
var OUT_FILENAME_PATH = "e:\\AllSky\\frames\\";                                     // Path to source files. mandatory  "/" at the end
var OUT_FILENAME_PREFIX = "AstroCam_";                                              // Source files should begins with it (format: "AstroCam_2021-11-06_05-00-16.jpg", i.e. AstroCam_YYYY-MM-DD_HH-mm-ss.jpg)
var AVI_TEMPIMAGES_PATH = "e:\\AllSky\\tmpaviimages\\";                             // Temp images folder. mandatory  "/" at the end
var AVI_OVERLAY_IMAGE = "AstroCam_overlay.png";                                     // Full path to overlay image. Could be empty. But if file specified, it should be in place!
var AVI_MOVIE_OUTPATH = "e:\\AllSky\\";
var KEO_TEMP_FOLDER = "e:\\AllSky\\keo\\";                                          // Path to temp keogram images folder. mandatory  "/" at the end
//var AVI_OVERLAY_IMAGE = "";                                     					// No overlay
var silentMode = true;                                                              // Prevent any messages

var createAVI = true;																// Create AVI with timelapse
var createKeogram = true;															// Create Keogram

//Initialization    
var WshShell = new ActiveXObject("WScript.Shell");
var objFS = new ActiveXObject("Scripting.FileSystemObject");

var OutBaseName = "";   // would be calculated further
var AVI_FILE = "";      // would be calculated further. Name of avi file begins with OUT_FILENAME_PREFIX and date of the first frame, i.e. "AstroCam_2021-11-05.mp4"

/**********************************************************************
 * Check if temp image folder exists
 * Create if not
 * Empty (delete) images from the folder if yes
 * Copy source images there
 **********************************************************************/
function prepareImageFolder()
{
	var folder, f, fc;

    // check if Out folder (i.e. source) exists
	if (!objFS.FolderExists(OUT_FILENAME_PATH))
    {
        logger("Out image folder [" + OUT_FILENAME_PATH + "] is not found, exiting");
        return -1;
    }
    
    // check if temp folder exists
	if (!objFS.FolderExists(AVI_TEMPIMAGES_PATH))
    {
        objFS.CreateFolder (AVI_TEMPIMAGES_PATH);
        logger("Temp avi image folder [" + AVI_TEMPIMAGES_PATH + "] created");
    }
    else
    {
        //delete all files in temp folder
        folder = objFS.GetFolder(AVI_TEMPIMAGES_PATH);
       
        fc = new Enumerator(folder.files);
        i=0;

        for (; !fc.atEnd(); fc.moveNext())
        {
            f = fc.item();
            objFS.DeleteFile(f.Path);
            i++;
        }
        logger("Emptying temp image folder [" + AVI_TEMPIMAGES_PATH + "]. " + i + " files deleted");
    }

    // Copy all files to temp folder
    folder = objFS.GetFolder(OUT_FILENAME_PATH);
   
	fc = new Enumerator(folder.files);
    j=1;
	for (; !fc.atEnd(); fc.moveNext())
	{
		f = fc.item();
        var oldFileName = f.Name;
        if (j==1) {
            var result = oldFileName.match('(' + OUT_FILENAME_PREFIX + '(\\d+)-(\\d+)-(\\d+))_(.*).jpg');
            OutBaseName = result[1];
        } 
        var newFileName = OutBaseName + "_" +  padNumber(j, 4) +".jpg";
        //logger("["+newFileName+"]");
        //f.Name = newFileName;
        objFS.CopyFile(f.Path, AVI_TEMPIMAGES_PATH + newFileName);
        j++;
    }
    logger((j-1) + " files copied with auto renaming");

	
	if (createKeogram) 
	{
		// check if keo temp folder exists
		if (!objFS.FolderExists(KEO_TEMP_FOLDER))
		{
			objFS.CreateFolder (KEO_TEMP_FOLDER);
			logger("Temp keogram images folder [" + KEO_TEMP_FOLDER + "] created");
		}
		else
		{
			//delete all files in temp folder
			folder = objFS.GetFolder(KEO_TEMP_FOLDER);
		   
			fc = new Enumerator(folder.files);
			i=0;

			for (; !fc.atEnd(); fc.moveNext())
			{
				f = fc.item();
				objFS.DeleteFile(f.Path);
				i++;
			}
			logger("Emptying temp keogram images folder [" + KEO_TEMP_FOLDER + "]. " + i + " files deleted");
		}
	}


}

/**********************************************************************
 * Create avi from individual frames
 **********************************************************************/
function makeAvi()
{
    AVI_FILE = AVI_MOVIE_OUTPATH + OutBaseName + ".mp4";
    st="\"" + FFMPEG_PATH + "\" -y -r 24 -f image2 -s 1920x1080 -i " + AVI_TEMPIMAGES_PATH + OutBaseName + "_%04d.jpg " + (AVI_OVERLAY_IMAGE != ""? "-i " + AVI_OVERLAY_IMAGE +" -filter_complex \"[0:v][1:v] overlay=0:0\" ":"") + "-vcodec libx264 -crf 25  -pix_fmt yuv420p " + AVI_FILE + "";        
    logger(st);
    WshShell.Run (st,7, true);
}

/**********************************************************************
 * Create keo images from individual frames
 **********************************************************************/
function makeTempKeoImages()
{
    st="magick mogrify -crop 1x1080+959+0 -path "  + KEO_TEMP_FOLDER + " " + AVI_TEMPIMAGES_PATH + "*.jpg";
    logger(st);
    WshShell.Run (st,7, true);
}

/**********************************************************************
 * Create Keogram from individual frames
 **********************************************************************/
function makeKeogramm()
{
    KEOGRAM_FILE = AVI_MOVIE_OUTPATH + "keogram_" + OutBaseName + ".jpg";
    st="magick montage -geometry +0+0 -tile x1 " + KEO_TEMP_FOLDER + "*.jpg " + KEOGRAM_FILE;
    logger(st);
    WshShell.Run (st,7, true);
}


/**********************************************************************
 * pad number with zeroes
 **********************************************************************/
function padNumber(number, digits) {
  var maxnum = Math.pow(10, digits + 1) - 1;
  if (number<=maxnum) { number = ("000"+number).slice(-digits); }
  return number;
}

/**********************************************************************
 * write log message
 **********************************************************************/
function logger(message)
{
   if (! silentMode) 
		WScript.Echo(message);
	
   //st="CScript.exe "+ logpath +" \""+message+"\""
   //WScript.Echo(st);
   //WshShell.Run (st,7, true);
}

/**********************************************************************
 * parse command line parameters
 **********************************************************************/
function parseCommandLineParameters()
{
    var args = WScript.Arguments;
    for (var i= 0; i < args.length; i++) {
        if (args(i) == "-debug" || args(i) == "-verbose")
        {
            silentMode = false;
        }
    } 

}

/**********************************************************************
 * Output information (valid for debug mode only)
 **********************************************************************/
function headerOutput()
{
    logger("makeAVI script");
    logger("");
    logger("Source files: " + OUT_FILENAME_PATH);
    logger("Using overlay: " + AVI_OVERLAY_IMAGE);
    logger("Make AVI: " + createAVI);
    logger("Make Keogram: " + createKeogram);
    logger("Using verbose mode");            
    logger("");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

parseCommandLineParameters();
headerOutput();
prepareImageFolder();
if (createAVI) {
	makeAvi();
}
if (createKeogram) 
{
	makeTempKeoImages();
	makeKeogramm();
}

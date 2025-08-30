/*
    getAstroCamShot.js
    (c) by Boris Emchenko 2021-2025
    http://astromania.info
    
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

    v 2.3 [2025-08-30]
    - detect mount motion and append distance to filenames

    v 2.2 [2025-08-30]
    - bugifx using codex

    v 2.1 [2025-08-30]
    - connect to ASCOM telescope to append Alt/Az coordinates and pier side letters to filenames
    
    v 2.0 [2025-08-29]
    - connect to ASCOM telescope to append Alt/Az coordinates to filenames

    v 1.2 [2021-11-05]
    - path for out images
    - command line parameters for debug output

    v 1.1 [2021-11-02]
    - check if temp image folder exists and create it
    
    v 1.0 [2021-11-01]
    - tested working release


    Command line parameters:
    -debug or -verbose: output messages (better to use in cscript mode)

*/
var SCRIPT_VERSION            = "2.3";
var SCRIPT_DATE               = "2025-08-30";

//Options initialization
var RTSP_URL                  = "rtsp://borise:astrotest@192.168.2.112/live";
var FFMPEG_PATH               = "e:\\Miscellaneous\\ffmpeg\\bin\\ffmpeg.exe";
var IMAGE_MAGIC_PATH          = "c:\\Program Files\\GraphicsMagick-1.3.36-Q16\\gm.exe";
var TEMP_IMAGE_DIR            = "f:\\AllSky\\tmpimages\\";                                   // mandatory  "/" at the end
var TEMP_IMAGE_PREFIX         = "do_";
var OUT_FILENAME_PATH         = "f:\\AllSky\\frames\\";                                      // mandatory  "/" at the end
var OUT_FILENAME_PREFIX       = "AstroCam_";

var ASCOM_TELESCOPE_PROGID    = "EQMOD.Telescope";

var MOUNT_MOVE_THRESHOLD      = 0.5;                                                         // degrees

var Number_Of_Frames_to_Get = 25;                                                            // number of frames to capture
var Frame_Rate = 2;                                                                          // ffmpeg capturing frame rate

var silentMode = true;                                                                       // prevent any messages


//Initialization    
var WshShell = new ActiveXObject("WScript.Shell");
var objFS = new ActiveXObject("Scripting.FileSystemObject");


/**********************************************************************
 * Get frames from RTSP stream and save it to files
 **********************************************************************/
function loadImages()
{
   // -timelimit 20
   //"d:\Miscellaneous\#App\ffmpeg\bin\ffmpeg.exe" -y -loglevel verbose -stimeout 3000000 -rtsp_transport tcp -i rtsp://boris:astrotest@192.168.1.241/live -frames:v 100 -q:v 2 -r 10 -bufsize 500K -maxrate 1M tmpimages\do_%%d.jpg 
   var st = "\"" + FFMPEG_PATH + "\" -y -loglevel verbose -stimeout 3000000 -timelimit 20 -rtsp_transport tcp -i " + RTSP_URL + " -frames:v " + Number_Of_Frames_to_Get+ " -q:v 2 -r " + Frame_Rate + " -bufsize 500K -maxrate 1M " + TEMP_IMAGE_DIR + TEMP_IMAGE_PREFIX + "%d.jpg";
   logger(st);
   WshShell.Run (st,7, true);
}

/**********************************************************************
 * Combine with averaging saved frames
 **********************************************************************/
function averageImages(coords, dist)
{
   var ts = formatDateTime(new Date());
   var coordText = "";

   var sideText = "";
   if (coords) {
       coordText = "_az_" + formatDegMin(coords.az, 3) + "_alt_" + formatDegMin(coords.alt, 2);
       if (coords.side)
           sideText = "_" + coords.side;
   }
   var distText = "";
   if (dist != null && dist > MOUNT_MOVE_THRESHOLD) {
       distText = "_dist_" + dist.toFixed(1);
   }
   var Out_File_Name = OUT_FILENAME_PATH + OUT_FILENAME_PREFIX + ts + coordText + sideText + distText + ".jpg";
   
   // Launch averaging
   //"c:\Program Files\GraphicsMagick-1.3.36-Q16\gm.exe" convert -average tmpimages\do_*.jpg avg.jpg
    var st = "\"" + IMAGE_MAGIC_PATH + "\" convert -average " + TEMP_IMAGE_DIR + TEMP_IMAGE_PREFIX + "*.jpg " + Out_File_Name;
   logger(st);
   WshShell.Run (st,7, true);
}

/**********************************************************************
 * Check if temp image folder exists
 * Create if not
 * Empty (delete) images from the folder if yes
 **********************************************************************/
function prepareImageFolder()
{
    var folder, f, fc;

    // Ensure Temp folder exists
    if (!objFS.FolderExists(TEMP_IMAGE_DIR))
    {
        objFS.CreateFolder (TEMP_IMAGE_DIR);
        logger("Temp image folder [" + TEMP_IMAGE_DIR + "] created");
    }

    // Ensure Out folder exists
    if (!objFS.FolderExists(OUT_FILENAME_PATH))
    {
        objFS.CreateFolder (OUT_FILENAME_PATH);
        logger("Out image folder [" + OUT_FILENAME_PATH + "] created");
    }

    // Clean up Temp folder even if it was just created
    folder = objFS.GetFolder(TEMP_IMAGE_DIR);

    fc = new Enumerator(folder.files);
    var i=0;

        for (; !fc.atEnd(); fc.moveNext())
        {
                f = fc.item();
        objFS.DeleteFile(f.Path);
        i++;
    }
    logger("Emptying temp image folder [" + TEMP_IMAGE_DIR + "]. " + i + " files deleted");
}

/**********************************************************************
 * Delete repeating images (based on size)
 **********************************************************************/
function clearImages()
{
	var folder, f, fc, suitableFile;

	folder = objFS.GetFolder(TEMP_IMAGE_DIR);
   
	fc = new Enumerator(folder.files);
    var arFiles = new Array(); 
    var n=0;

	for (; !fc.atEnd(); fc.moveNext())
	{
		f = fc.item();

        arFiles[n] = new Array(3);
        var fn=f.Name;
        var fn2 = fn.substring(TEMP_IMAGE_PREFIX.length, fn.indexOf(".")); 
        if (fn2 < 10) fn2 = "0" + fn2;
        if (fn2 < 100) fn2 = "0" + fn2;
        arFiles[n][0] = fn2;
        arFiles[n][1] = f.Name; 
        n++;
    }

    arFiles.sort(sortFunction);
    
    var s="";
    var s2="";
    var prevfilesize=-1;
    var fileDeleteCount=0;
    
    for (n=0; n < arFiles.length; n++)
    {
		//check if this is suitable file
        if (folder.files(arFiles[n][1]).size == prevfilesize)
        {
            s2 += "x" + folder.files(arFiles[n][1]).Path + "\n";
            objFS.DeleteFile(folder.files(arFiles[n][1]).Path);
			fileDeleteCount++;
		}
        else
        {
            prevfilesize = folder.files(arFiles[n][1]).size;
        }

        //s += folder.files(arFiles[n]).Path+"\n";
        s += arFiles[n][1] + "|"  + arFiles[n][0]+"\n";
    }
    //WScript.echo(s2); 

   logger("Repeating images deleted: " + fileDeleteCount);
}

/**********************************************************************
 * Get Alt/Az coordinates from ASCOM mount
 **********************************************************************/
function getTelescopeAltAz()
{
    try {
        var telescope = new ActiveXObject(ASCOM_TELESCOPE_PROGID);
        telescope.Connected = true;
        var alt = telescope.Altitude;
        var az = telescope.Azimuth;
        var side = "";
        try {
            var pier = telescope.SideOfPier;
            var pierStr = ("" + pier).toLowerCase();
            // SideOfPier returns the mount side, so swap to get pointing direction
            if (pier == 0 || pierStr.indexOf("east") != -1)
                side = "W"; // mount east of pier -> pointing west
            else if (pier == 1 || pierStr.indexOf("west") != -1)
                side = "E"; // mount west of pier -> pointing east
        } catch (e1) {
        }
        telescope.Connected = false;
        return {alt: alt, az: az, side: side};
    }
    catch (e) {
        logger("ASCOM connection failed: " + e.message);
        return null;
    }
}

/**********************************************************************
 * Calculate angular distance between two Alt/Az positions
 **********************************************************************/
function angularDistance(c1, c2)
{
    if (!c1 || !c2)
        return null;
    var alt1 = deg2rad(c1.alt);
    var az1 = deg2rad(c1.az);
    var alt2 = deg2rad(c2.alt);
    var az2 = deg2rad(c2.az);
    var cosD = Math.sin(alt1) * Math.sin(alt2) + Math.cos(alt1) * Math.cos(alt2) * Math.cos(az1 - az2);
    if (cosD > 1) cosD = 1;
    if (cosD < -1) cosD = -1;
    return rad2deg(Math.acos(cosD));
}

function deg2rad(d) { return d * Math.PI / 180; }
function rad2deg(r) { return r * 180 / Math.PI; }

/**********************************************************************
 * Format degrees to DEG-MIN string
 **********************************************************************/
function formatDegMin(value, padDeg)
{
    var sign = value < 0 ? "-" : "";
    value = Math.abs(value);
    var deg = Math.floor(value);
    var minutes = Math.round((value - deg) * 60);
    if (minutes == 60) { minutes = 0; deg += 1; }
    var degStr = ("000" + deg).slice(-padDeg);
    var minStr = ("0" + minutes).slice(-2);
    return sign + degStr + "-" + minStr;
}

/**********************************************************************
 * format date time for filename
 **********************************************************************/
function formatDateTime(d) {
    var datestring = d.getFullYear() +  "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) 
        + "_" + ("0" + d.getHours()).slice(-2) + "-" + ("0" + d.getMinutes()).slice(-2) + "-" + ("0" + d.getSeconds()).slice(-2);
    return datestring;
}

/**********************************************************************
 * aux sort function
 **********************************************************************/
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
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
    logger("getAstroCamShot script");
    logger("version " + SCRIPT_VERSION + " from " + SCRIPT_DATE);
    logger("");
    logger("Camera url: " + RTSP_URL);
    logger("Using verbose mode");            
    logger("");
    logger("");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

parseCommandLineParameters();
headerOutput();
prepareImageFolder();

var startCoords = getTelescopeAltAz();
loadImages();
var endCoords = getTelescopeAltAz();
var moveDist = angularDistance(startCoords, endCoords);

clearImages();

averageImages(endCoords, moveDist);

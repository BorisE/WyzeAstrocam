"e:\Miscellaneous\ffmpeg\bin\ffmpeg.exe" -y -loglevel verbose -stimeout 1000000 -rtsp_transport tcp -i rtsp://borisу:astrotest1@192.168.2.112/live -frames:v 100 -q:v 2 -r 10 do_%%d.jpg 

"c:\Program Files\GraphicsMagick-1.3.36-Q16\gm.exe" convert -average do_*.jpg avg.jpg

pause
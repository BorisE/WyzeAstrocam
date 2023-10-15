: extract one line to later on create keogram
gm mogrify -crop 1x1080+959+0 -output-directory e:\AllSky\keom -create-directories e:\AllSky\tmpaviimages1\*.jpg

: concatenate all files into one row
:gm montage -geometry +0+0 -tile 10000x1 keom/source/*.jpg keogram.jpg
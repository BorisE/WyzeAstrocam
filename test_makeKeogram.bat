: extract one line to later on create keogram
magick mogrify -crop 1x1080+959+0 -path f:\AllSky\keom f:\AllSky\tmpaviimages1/*.jpg

: concatenate all files into one row
magick montage -geometry +0+0 -tile x1 f:\AllSky\keom/*.jpg f:\AllSky\keogram.jpg
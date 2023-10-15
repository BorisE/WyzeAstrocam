: extract one line to later on create keogram
magick mogrify -crop 1x1080+959+0 -path e:\AllSky\keom e:\AllSky\tmpaviimages1/*.jpg

: concatenate all files into one row
magick montage -geometry +0+0 -tile x1 e:\AllSky\keom/*.jpg e:\AllSky\keogram.jpg
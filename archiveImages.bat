:Variables
@SET SourcePath=f:\AllSky
@SET DestPath=E:\FITSUpload

:RUN
@echo.
@echo.
@echo [92mCopy latest AVI file[0m
@FOR /F "delims=|" %%I IN ('DIR "%SourcePath%\*.mp4" /B /O:D') DO SET NewestFile=%%I
copy /y "%SourcePath%\%NewestFile%" "%DestPath%"
call e:\ASCOMscripts\Telegram\sendVideo.bat "%SourcePath%\%NewestFile%" "%NewestFile%"

:KEO
@echo.
@echo.
@echo [92mCopy latest Keogram file[0m
@FOR /F "delims=|" %%I IN ('DIR "%SourcePath%\*.jpg" /B /O:D') DO SET NewestFile=%%I
copy /y "%SourcePath%\%NewestFile%" "%DestPath%"
call e:\ASCOMscripts\Telegram\sendVideo.bat "%SourcePath%\%NewestFile%" "%NewestFile%"

:ARCHIVE
@echo.
@echo.
@echo [92mArchive avi frames[0m
move %SourcePath%\frames\* %SourcePath%\images_archive
:Variables
@SET SourcePath=e:\AllSky
@SET DestPath=E:\FITSUpload

:SUNWAIT
@echo [92mWaiting for sunrise+someoffset for uploading AVI file[0m
@echo | set /p dummyName="[91mWaiting till "
@sunwait.exe list daylight rise offset 20 +44.75N +38.5E
@echo [0m
sunwait.exe wait daylight rise offset 20 +44.75N +38.5E

:RUN
@echo.
@echo.
@echo [92mCopy latest AVI file[0m
@FOR /F "delims=|" %%I IN ('DIR "%SourcePath%\*.mp4" /B /O:D') DO SET NewestFile=%%I
copy /y "%SourcePath%\%NewestFile%" "%DestPath%"

:ARCHIVE
@echo.
@echo.
@echo [92mArchive avi frames[0m
move %SourcePath%\frames\* %SourcePath%\images_archive
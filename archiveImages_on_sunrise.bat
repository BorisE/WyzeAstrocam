:SUNWAIT
@echo [92mWaiting for sunrise+someoffset for uploading AVI file[0m
@echo | set /p dummyName="[91mWaiting till "
@sunwait.exe list daylight rise offset 20 +44.75N +38.5E
@echo [0m
sunwait.exe wait daylight rise offset 20 +44.75N +38.5E

:RUN
@call archiveImages.bat
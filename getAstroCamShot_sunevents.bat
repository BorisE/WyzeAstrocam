:CHECK_NIGHT
sunwait.exe poll daylight set offset 15 +44.75N +38.5E
@REM if %ERRORLEVEL% EQU 2 echo It is DAY (outside twilight)
@REM if %ERRORLEVEL% EQU 3 echo It is NIGHT
@REM NIGH 22.45, offset 15 22.30
@REM RISE 07.58, offset 15 08.13
@if %ERRORLEVEL% EQU 2 Goto END

:RUN
@ECHO.
@Echo [92mNight, get a frame[0m
cscript getAstroCamShot.js -debug
@exit /b 0

:END
@Echo [91mNot a night, exiting[0m
@exit /b %ERRORLEVEL%
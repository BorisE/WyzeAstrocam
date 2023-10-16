:SUNWAIT
@echo [92mWaiting for sunrise to make AVI and Keogram file[0m
@echo | set /p dummyName="[91mWaiting till "
@sunwait.exe list daylight rise offset 17 +44.75N +38.5E
@echo [0m
sunwait.exe wait daylight offset 17 +44.75N +38.5E

:RUN
cscript makeAVI.js -debug

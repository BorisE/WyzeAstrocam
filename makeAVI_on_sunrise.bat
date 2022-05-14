:SUNWAIT
@echo [92mWaiting for sunrise to make AVI file[0m
sunwait.exe wait daylight offset 17 +44.75N +38.5E

:RUN
cscript makeAVI.js -debug

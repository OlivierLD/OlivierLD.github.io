@setlocal
@echo off
del /q dpp_en.epub
move exploded\mimetype .
zip -X0 dpp_en.epub mimetype 
cd exploded
zip -rX9 ..\dpp_en.epub META-INF *.*
cd ..
move mimetype exploded
@echo Done.
@endlocal

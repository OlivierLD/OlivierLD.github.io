@setlocal
@echo off
del /q dpp_fr.epub
move exploded\mimetype .
zip -X0 dpp_fr.epub mimetype 
cd exploded
zip -rX9 ..\dpp_fr.epub META-INF *.*
cd ..
move mimetype exploded
@echo Done.
@endlocal

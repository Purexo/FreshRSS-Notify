cd /d %~dp0

:boucle
    call jpm xpi
    pause > nul && pause > nul
goto :boucle

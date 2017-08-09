del Build.zip

call npm run build

xcopy public public1 /i/s

RMDIR "public1\images" /S /Q

"C:\Program Files\7-Zip\7z.exe" a -tzip "Build.zip" "public1"

RMDIR "public1" /S /Q
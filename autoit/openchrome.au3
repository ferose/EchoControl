#include <Constants.au3>

AutoItSetOption("WinTitleMatchMode", $OPT_MATCHANY)

If WinExists("[CLASS:Chrome_WidgetWin_1]") Then
   Local $hWnd = WinWait("[TITLE: - Google Chrome;CLASS:Chrome_WidgetWin_1]")
   WinActivate($hWnd)

   Send('{ESC}')
   Sleep(100)
   Send("^l")
   Sleep(100)
   Send($CmdLine[1])
   Send("{ENTER}")
Else
   ShellExecute($CmdLine[1])
EndIf

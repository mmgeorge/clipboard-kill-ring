# Clipboard Kill Ring

Provides a clipboard history / kill ring implementation for Visual Studio Code. Killing / saving regions will modify the clipboard. 

### Commands
|Command | Desc |
|--------|------|
| Kill Line | Kill entire line |
| Kill Line Append | Kill entire line, appending to last entry in history |
| Kill Line Left | Kill the line left of the cursor |
| Kill Line Right | Kill the line right of the cursor |
| Kill Word | Kill word on the cursor |
| Kill Word Append | Kill word on the cursor |
| Kill Region | Kill the region |
| Kill Region Append | Kill the region, appending to the last entry in history |
| Save Region | Save, but do not kill, the region |
| Show History | Show contents of ring buffer and select one to yank |
| Yank Last | Yank the last killed item |
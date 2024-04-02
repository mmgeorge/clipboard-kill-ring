# Clipboard Kill Ring

Provides a clipboard history / kill ring implementation for Visual Studio Code. Killing / saving regions will modify the clipboard. 

### Commands
|Command | Desc |
|--------|------|
| clipboard-kill-ring.kill-line | Kill entire line |
| clipboard-kill-ring.kill-line-append | Kill entire line, appending to last entry in history |
| clipboard-kill-ring.kill-line-left | Kill the line left of the cursor |
| clipboard-kill-ring.kill-line-right | Kill the line right of the cursor |
| clipboard-kill-ring.kill-word | Kill word on the cursor |
| clipboard-kill-ring-kill-word-append | Kill word on the |
| clipboard-kill-ring.kill-region | Kill the region |
| clipboard-kill-ring.kill-region-append | Kill the region, appending to the last entry in history |
| clipboard-kill-ring.save-region | Save, but do not kill, the region |
| clipboard-kill-ring.show-history | Show contents of ring buffer and select one to yank |
| clipboard-kill-ring.yank | Yank the last killed item |
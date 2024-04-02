import { commands, Range, type ExtensionContext, type TextEditor, Position, Uri, workspace, env, window } from 'vscode';
import { Ring } from './ring';

let lastPosition: Position | null = null; 
let lastUri: string | null; 

export function activate(context: ExtensionContext) {
  let registered = [
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-line", killLine), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-line-append", killLineAppend), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-line-left", killLineLeft), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-line-right", killLineRight), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-word", killWord), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-word-append", killWordAppend), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-region", killRegion), 
    commands.registerTextEditorCommand("clipboard-kill-ring.kill-region-append", killRegionAppend), 
    commands.registerTextEditorCommand("clipboard-kill-ring.save-region", saveRegion), 
    commands.registerTextEditorCommand("clipboard-kill-ring.show-history", showHistory), 
    commands.registerTextEditorCommand("clipboard-kill-ring.yank", (editor) => yankText(editor)), 
  ]; 
  
  context.subscriptions.push(...registered); 
}

export function deactivate() { }

function killWord(editor: TextEditor): void {
  const position = editor.selection.active; 
  const wordRange = editor.document.getWordRangeAtPosition(position); 

  if (wordRange === undefined) {
    return; 
  }

  const wordText = editor.document.getText(wordRange);
  Ring.Instance.insert(wordText);
  
  lastPosition = null; 
  lastUri = null; 
  editor.edit((builder => builder.delete(wordRange))); 
}

function killWordAppend(editor: TextEditor): void {
  const position = editor.selection.active; 
  const wordRange = editor.document.getWordRangeAtPosition(position); 

  if (wordRange === undefined) {
    return; 
  }

  const wordText = editor.document.getText(wordRange);
  Ring.Instance.appendLast(wordText);
  
  lastPosition = null; 
  lastUri = null; 
  editor.edit((builder => builder.delete(wordRange))); 
}


function killLine(editor: TextEditor): void {
  const position = editor.selection.active; 
  const uri = editor.document.uri.toString(); 
  const line = editor.document.lineAt(position.line); 
  
  let lineRange = line.rangeIncludingLineBreak;
  let lineText = editor.document.getText(lineRange);
  
  if (lineText.length === 0) {
    return; 
  }
  
  // Killing multiple lines -> append to last entry
  if (lastUri === uri && lastPosition != null && position.line === lastPosition.line) {
    Ring.Instance.appendLast(lineText);
  }
  
  else {
    Ring.Instance.insert(lineText);
  }
  
  lastPosition = position; 
  lastUri = uri; 
  editor.edit((builder => builder.delete(lineRange))); 
}

function killLineLeft(editor: TextEditor): void {
  const position = editor.selection.active; 
  const uri = editor.document.uri.toString(); 
  const line = editor.document.lineAt(position.line); 
  
  let startRange = new Range(line.range.start, position); 
  let text = editor.document.getText(startRange);
  if (text.length === 0) {
    return; 
  }

  Ring.Instance.insert(text);
  
  lastPosition = null; 
  lastUri = null; 
  editor.edit((builder => builder.delete(startRange))); 
}

function killLineRight(editor: TextEditor): void {
  const position = editor.selection.active; 
  const uri = editor.document.uri.toString(); 
  const line = editor.document.lineAt(position.line); 
  
  let endRange = new Range(position, line.range.end); 
  let text = editor.document.getText(endRange);
  if (text.length === 0) {
    return; 
  }

  Ring.Instance.insert(text);
  
  lastPosition = null; 
  lastUri = null; 
  editor.edit((builder => builder.delete(endRange))); 
}

function killLineAppend(editor: TextEditor): void {
  const position = editor.selection.active; 
  const line = editor.document.lineAt(position.line); 
  
  let lineRange = line.rangeIncludingLineBreak;
  let lineText = editor.document.getText(lineRange);
  
  if (lineText.length === 0) {
    return; 
  }
  
  Ring.Instance.appendLast(lineText);
  
  lastPosition = null; 
  lastUri = null;
  editor.edit((builder => builder.delete(lineRange))); 
}

function killRegion(editor: TextEditor): void {
  const start = editor.selection.start; 
  const end = editor.selection.end; 
  const uri = editor.document.uri.toString(); 
  const range = new Range(start, end); 
  const text = editor.document.getText(range);
  
  Ring.Instance.insert(text);
  
  lastPosition = null; 
  lastUri = null; 
  editor.edit((builder => builder.delete(range))); 
}

function killRegionAppend(editor: TextEditor): void {
  const start = editor.selection.start; 
  const end = editor.selection.end; 
  const range = new Range(start, end); 
  const text = editor.document.getText(range);
  
  Ring.Instance.appendLast(text);
  
  lastPosition = null; 
  lastUri = null; 
  editor.edit((builder => builder.delete(range))); 
}

function saveRegion(editor: TextEditor): void {
  const start = editor.selection.start; 
  const end = editor.selection.end; 
  const uri = editor.document.uri.toString(); 
  const range = new Range(start, end); 
  const text = editor.document.getText(range);
  
  Ring.Instance.insert(text);
  
  lastPosition = null; 
  lastUri = null; 
}

function yankText(editor: TextEditor, text = Ring.Instance.last()) {
  const selection = editor.selection; 
  
  editor.edit(builder => {
    builder.insert(selection.active, text);
  });
}

async function showHistory(editor: TextEditor): Promise<void> {
  const items = Ring.Instance.items(); 
  const itemsTrimmed = items.map((item, i) => `${i + 1}. ${item.trim()}`); 
  
  let itemTrimmed = await window.showQuickPick(itemsTrimmed, {
    placeHolder: "Select item to yank"
  });  
  
  if (itemTrimmed === undefined) {
    return; 
  }
  
  const itemIndex = itemsTrimmed.indexOf(itemTrimmed);;
  const item = items[itemIndex];
  
  yankText(editor, item);
}
import { env, workspace } from "vscode";

export class Ring {
  private constructor() {}
  
  static Instance = new Ring();
  
  private readonly _stack: string[] = [];
  
  insert(yanked: string): void {
    const historySize = workspace.getConfiguration("clipboardKillRing")
    .get<number>("historySize") ?? 10; 
    
    if (this._stack.length > historySize) {
      this._stack.shift(); 
    }
    
    env.clipboard.writeText(yanked); 
    this._stack.push(yanked);
  }
  
  /* Append to the last pushed element  */
  appendLast(yanked: string): void {
    if (this._stack.length === 0) {
      return  this.insert(yanked);
    }
    
    this._stack[this._stack.length - 1] += yanked; 
    env.clipboard.writeText(this.last()); 
  }
  
  items(): string[] {
    return [...this._stack].reverse();
  }
  
  last(): string {
    return this._stack[this._stack.length - 1];
  }
}
export default class Stack {
  constructor() {
    this.stack = [];
  }

  clear() {
    this.stack = [];
    return undefined;
  }

  isEmpty() {
    return !this.stack.length;
  }

  peek() {
    const len = this.size();
    return len ? this.stack[len - 1] : undefined;
  }

  print() {
    console.log(this.stack.toString());
  }

  pop() {
    return this.stack.pop();
  }

  push(num) {
    this.stack.push(num);
    return undefined;
  }

  size() {
    return this.stack.length;
  }
}

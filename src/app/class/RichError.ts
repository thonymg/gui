export interface RichErrorData {
	type: string;
	code: number;
	stack: string;
	lineNumber: number;
	columnNumber: number;
}
export class RichError implements Error {
	name: string;
	message: string;
	stack?: string;
	data?: RichErrorData;
	constructor(message: string, data?: RichErrorData) {
		this.name = 'RichError';
		this.message = message;
		if (data) {
			this.stack = data.stack;
			this.data = data;
		}
	}
	static from(payload: any) {
		return new this(payload.message, payload.data);
	}
	details(): string {
		let output = this.message;
		if (this.data) {
			output += '\n';
			output += `\nType: ${this.data.type}`;
			output += `\nCode: ${this.data.code}`;
			if (this.data.stack) {
				output += `\nStack: ${this.data.stack}`;
			}
			if (this.data.lineNumber) {
				output += `\nLine Number: ${this.data.lineNumber}`;
			}
			if (this.data.columnNumber) {
				output += `\nColumn Number: ${this.data.columnNumber}`;
			}
		}
		return output;
	}
}

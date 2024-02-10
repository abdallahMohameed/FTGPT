import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'codeBlockParser'
})
export class CodeBlockParserPipe implements PipeTransform {

    codeString = "";
    transform(response: string): string {
        let flagCodeEnded = false;

        const codeBlockRegex = /```([^`\n]+)\n([\s\S]*?)\n```/g;
        let match;
        while ((match = codeBlockRegex.exec(response)) !== null) {
            const language = match[1].trim();
            const code = match[2].trim();
            this.codeString += code + "\n";

            // Check if the closing triple backticks are found
            if (match[0].endsWith('```')) {
                flagCodeEnded = true;
            }
        }

        // If the code has ended, clear the codeString variable
        if (flagCodeEnded) {
            // Do something with the accumulated codeString
            console.log("Detected code: ", this.codeString);
            this.codeString = ""; // Clear the codeString variable
        }

        return response;
    }

}

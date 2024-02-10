import { CodeBlockParserPipe } from './code-block-parser.pipe';

describe('CodeBlockParserPipe', () => {
    it('create an instance', () => {
        const pipe = new CodeBlockParserPipe();
        expect(pipe).toBeTruthy();
    });
});

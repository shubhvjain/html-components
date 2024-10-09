import {foldNodeProp, indentNodeProp, LRLanguage, LanguageSupport} from "@codemirror/language";
import {styleTags, tags} from "@lezer/highlight";
import {parser} from './parser';  // Generated parser

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      "Block": tags.content,
      "Line":tags.content,
      "NameBracket": tags.name,
      "Name":tags.name,
      "Title": tags.heading1,
      "Annotation":tags.monospace,
      "Invocation":tags.monospace,
      "InputBlockName":tags.monospace,
      "Append":tags.monospace,
      "Edge": tags.monospace,
      "Label": tags.monospace,
      "Comment": tags.comment,
      "Key": tags.keyword
    }),

    // Add indentation handling if needed
    // indentNodeProp.add({
    //   Block: context => context.lineIndent(context.node.from) + context.unit
    // }),

    // Add fold functionality
    foldNodeProp.add({
      Block(node, state) {
        // Get the document associated with the current state
        let doc = state.doc;
        let firstLine = doc.lineAt(node.from);  // Get the first line of the block
        let secondLine = doc.line(firstLine.number + 1);  // Get the second line

        // Check if the block has more than one line
        if (secondLine && secondLine.from < node.to) {
          // Fold everything starting from the second line to the end of the block
          return { from: secondLine.from, to: node.to };
        }

        // If there's only one line, do not fold anything
        return null;
      }
    })
  ]
});

// Define the language with the parser and metadata
const exampleLanguage = LRLanguage.define({
  parser: parserWithMetadata
});

// Load the custom syntax with the theme
export function loadBlockSyntax() {
  return new LanguageSupport(exampleLanguage);
}

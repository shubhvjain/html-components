import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags} from "@lezer/highlight"
import {LRLanguage,LanguageSupport} from "@codemirror/language"
import {parser} from './parser';  // Generated parser

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      "Block":tags.content,
      "Declaration": tags.keyword,         // Style the Declaration as a keyword
      "Invocation": tags.operator,         // Invocation > [Name]
      "Append": tags.operator,             // Append + [Name]
      "Edge": tags.operator,               // Edge ~ [Label, Name]
      "Name": tags.variableName,           // Name as a variable name
      "Label": tags.string,                // Label as a string
      "Title": tags.string,                // Title as a string
      "ContentLine": tags.content,         // Content lines styled as content
    }),
    indentNodeProp.add({
      Block: context => context.lineIndent(context.node.from) + context.unit
    }),
    foldNodeProp.add({
      Block(node) { return { from: node.from, to: node.to }; }
    })
  ]
})

export const exampleLanguage = LRLanguage.define({
  parser: parserWithMetadata
})

export function example() {
  return new LanguageSupport(exampleLanguage)
}
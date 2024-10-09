import {tags} from "@lezer/highlight"
import {HighlightStyle} from "@codemirror/language"

export const  myHighlightStyle = HighlightStyle.define([
  { tag: tags.content, font:"12px" ,color: "black"},
  { tag: tags.heading1, color:"black",fontSize:"20px"},
  { tag: tags.operator,color:"blue"},
  { tag: tags.name, color: "grey", fontSize:"10px"},
  { tag: tags.keyword, color: "orange",fontWeight: "bold"},
  { tag: tags.comment, color: "grey", fontStyle: "italic"},  
  { tag: tags.monospace, color:"blue"}
])
<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'

  import Block from './Block.svelte';

  export const meta = {
    title : "Block editor",
    component : Block
  }

  let samplebind1
  let samplebind2
  let samplebind3

  let content1 = {text:".[main] This is the title of the block"}
  let content2 = {text:`.[main] This is the title\nThis is line 2\n~[text relation,block-123]\n>[block2]\n/[This is a comment line]\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel risus nulla.\nMauris convallis, magna vel suscipit vehicula, justo neque tristique dui, ut tincidunt elit eros at arcu. \nDonec mollis magna sit amet lorem iaculis, sit amet tristique nisi auctor. \nPraesent ut ipsum eget lectus cursus gravida. \nInteger placerat dui sit amet urna porttitor ultricies. \nFusce id ipsum bibendum, malesuada est ac, molestie risus.\nCras vehicula orci euismod augue interdum, nec laoreet elit mollis. \nUt rhoncus nulla in magna tempus, ut fringilla mauris posuere. \nIn non felis non nulla tincidunt tincidunt.\nEtiam non mauris sit amet eros consequat gravida.`}

</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  
</script>

<Story name="Nothing provided">
  <Block></Block>
</Story>

<Story name="bindview not provided">
  <Block Id="sample"></Block>
</Story>

<Story name="Invaild content">
  <Block Id="sample" BindView={(view)=>{ samplebind1 = view}} Content="This is the text"></Block>
</Story>

<Story name="No content">
  <Block Id="sample" BindView={(view)=>{ samplebind1 = view}}></Block>
</Story>

<Story name="Small content">
  <Block Id="sample" BindView={(view)=>{ samplebind2 = view}} Content={content1}></Block>
</Story>

<Story name="Large content">
  <Block Id="sample1" BindView={(view)=>{ samplebind3 = view}} Content={content2}></Block>
</Story>
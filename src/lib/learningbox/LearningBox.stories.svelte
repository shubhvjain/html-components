<script context="module">
  import {Story} from '@storybook/addon-svelte-csf'
  import LearnBoard from './LearnBoard.svelte';
  export const meta = {
    title : "Learnboard",
    component : LearnBoard
  }
</script>

<script>

</script>

<Story name="Initial">
  <LearnBoard></LearnBoard>
</Story>


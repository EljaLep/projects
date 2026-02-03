<script>
  import { useAnswerState } from "$lib/states/answerState.svelte";
  import { onMount } from "svelte";
  import AnswerItem from "./AnswerItem.svelte";
  import { fade } from "svelte/transition";

  let answerState = useAnswerState();

  let { data } = $props();

  onMount(() => {
    answerState.update(data.id, data.qid);
  });

  /*$effect(async () => {
    await answerState.update(data.id, data.qid);
    console.log(answerState.answers[0]);
  });*/
</script>

<ul>
  {#each answerState.answers as answer }
    <li transition:fade>

      <AnswerItem answer = { answer } data = { data }  />
    </li>
  {/each}
</ul>
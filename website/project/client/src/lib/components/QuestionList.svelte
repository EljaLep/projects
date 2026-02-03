<script>
  import { useQuestionState } from "$lib/states/questionState.svelte.js";
  import QuestionItem from "./QuestionItem.svelte";
  import { fade } from "svelte/transition";

  import * as questionsApi from "$lib/apis/questions-api.js";
  

  let { data } = $props();
  //let questions = $state([]);

  let questionState = useQuestionState();

  console.log(data.id)

  $effect(async () => {
    await questionState.update(data.id);
  });


</script>


<ul>
  {#each questionState.questions as question}
    <li transition:fade>
      <QuestionItem question = { question } courseId = { data.id } />
    </li>
  {/each}
</ul>
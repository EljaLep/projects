<script>
  import Answers from "$lib/components/Answers.svelte";
  import { useAnswerState } from "$lib/states/answerState.svelte";

  let answerState = useAnswerState();

  let { data } = $props();

  console.log(data.user)
  
</script>

<Answers {data} />

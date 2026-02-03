<script>
  import Questions from "$lib/components/Questions.svelte";

  import { useQuestionState } from "$lib/states/questionState.svelte.js";

  let questionState = useQuestionState();

  let { data } = $props();

  let { courseId } = data.id;

  console.log(`aa ${data.id}`);
  
</script>


<Questions {data} />
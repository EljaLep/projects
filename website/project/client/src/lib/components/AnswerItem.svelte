<script>
  import { useAnswerState } from "$lib/states/answerState.svelte";

  let answerState = useAnswerState();

  let { answer, data } = $props();

  console.log(data.user)

  /*$effect(() => {
    answerState.update(data.id, answer.question_id);
  });*/

</script>

<div class="card border-[2px] p-4 border-gray-300">
  <label for={answer.id}>
    <h5> Upvotes: {answer.upvotes} </h5>
    <p class="text-base p-6">{answer.text}</p>
  </label>

  {#if data.user}
    <button  class="btn preset-filled-primary-500" onclick={async () => answerState.upvote(data.id, answer.question_id, answer.id)}>upvote</button>
  {/if}

</div>
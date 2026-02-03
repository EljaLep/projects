<script>
  import  * as questionApi from "$lib/apis/questions-api.js";
  import { onMount } from "svelte";
  import AnswerForm from "./AnswerForm.svelte";
  import AnswerList from "./AnswerList.svelte";

  let questionName = $state({});
  let { data } = $props();

  const updateName = async () => {
    const response = await questionApi.readQuestion(data.id, data.qid);
    console.log("updated name of question");
    console.log(response);
    questionName = response;
  };

  onMount(async () => {
    await updateName();
  })
</script>



<h1 class="text-2xl text-primary-900">{questionName.title}</h1>
<p class="text-xl">{questionName.text}</p>

{#if data.user}
  <AnswerForm { data} />
{/if}



<AnswerList { data } />



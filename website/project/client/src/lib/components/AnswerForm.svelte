<script>
  import { useAnswerState } from "$lib/states/answerState.svelte";
  import * as answerApi from "$lib/apis/answers-api.js";
  import { useUserState } from "$lib/states/userState.svelte";
  //import { useQuestionState } from "$lib/states/questionState.svelte";
  

  let answerState = useAnswerState();
  let userState = useUserState();
  //let questionState = useQuestionState();

  let { data } = $props();

  const addAnswer = async (e) => {
    const answer = Object.fromEntries(new FormData(e.target));
    //question.id = crypto.randomUUID();
		answer.upvotes = 0;
    //await questionState.add({title: answer.text, text: answer.text}, data.id);
    await answerState.add(data.id, data.qid, answer);
    e.target.reset();
    e.preventDefault();      
    //window.dispatchEvent(updateEvent);
  };

  console.log(userState);
</script>

<form onsubmit={addAnswer}>
	<br/>
	<label for="text">
    <span class="label-text text-xl">Submit new Answer</span>
  </label>
	<textarea class="w-full rounded-lg" id="text" name="text"  placeholder="text" ></textarea>
	<br/>
  <button class="w-full btn preset-filled-primary-500" type="submit" value="Add Answer">Add Answer</button>
</form>
<script>
  import { useQuestionState } from "$lib/states/questionState.svelte.js";
  import * as questionApi from "$lib/apis/questions-api.js";
  
  let questionState = useQuestionState();

  let { data } = $props();

  const addQuestion = async (e) => {
    const question = Object.fromEntries(new FormData(e.target));
    //question.id = crypto.randomUUID();
		question.upvotes = 0;
    //const response = await questionApi.createQuestion(question.title, question.text, data.id);
    await questionState.add(question, data.id);
    e.target.reset();
    e.preventDefault();      
    //window.dispatchEvent(updateEvent);
  };
</script>

<form onsubmit={addQuestion}>
  <label for="title" class="label">
    <span class=" label-text text-xl">title</span>
    <input class="w-full rounded-lg" id="title" name="title" type="text" placeholder="Enter the title of a new question" />
  </label>
  
	<br/>
	<label for="text">
    <span class="label-text text-xl">text</span>
  </label>
	<textarea class="w-full rounded-lg" id="text" name="text"  placeholder="Enter question" ></textarea>
	<br/>
  <button class="w-full btn preset-filled-primary-500" type="submit" value="Add Question">Add Question</button>
</form>
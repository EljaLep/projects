<script>
  import { useQuestionState } from "$lib/states/questionState.svelte.js";
  import { fade } from "svelte/transition";
  import * as questionApi from "$lib/apis/questions-api.js";

  

  let { question, courseId }  = $props();

  let questionState = useQuestionState();

  console.log("courseId: " + courseId);

  $effect(() => {
    questionState.update(courseId);
  });

  //const updateEvent = new CustomEvent('update');
/*
  const upvoteQuestion = async () => {
    const response = await questionApi.upvoteQuestion(question.id, question.course_id);
    
    window.dispatchEvent(updateEvent);
  };

  const deleteQuestion = async () => {
    const response = await questionApi.removeQuestion(question.id, question.course_id);
    window.dispatchEvent(updateEvent);
  };*/

</script>


<div class="card border-[2px] p-4 border-gray-300">
  <label for={question.id}>
    <a class="text-xl text-gray-500" href="/courses/{courseId}/questions/{question.id}"> {question.title} </a>

    <h5> Upvotes: {question.upvotes} </h5>
    <p class="text-base p-6"> {question.text} </p>
  </label>

  <button class="btn preset-filled-primary-500" onclick={async () => questionState.upvote(question.id, courseId)}>Upvote</button>

  <button class="btn preset-filled-primary-500" onclick={async () => questionState.remove(question.id, courseId)}>Delete</button>
</div>


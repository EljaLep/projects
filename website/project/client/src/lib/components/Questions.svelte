<script>

  import QuestionForm from "./QuestionForm.svelte";
  import QuestionList from "./QuestionList.svelte";
  import * as courseApi from "$lib/apis/course-api.js";

  let { data } = $props();

  let courseName = $state({});

  $effect(async () => {
    await updateName();
  })

  console.log("in questions.svelte" + data.id);

  const updateName = async () => {
    const response = await courseApi.readCourse(data.id);
    courseName = response;
  }

</script>

<h1 class="text-2xl text-primary-900">{courseName.name}</h1>

<h1 class="text-xl text-primary-900">Questions</h1>

<h2 class="text text-primary-900">Add Question</h2>

<QuestionForm {data} />
<br />

<h2 class="text-xl text-primary-900">Existing questions</h2>

<QuestionList {data} /> 
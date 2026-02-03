<script>
  import { useCoursesState } from "$lib/states/courseState.svelte";
  import CourseForm from "./CourseForm.svelte";
  import * as courseApi from "$lib/apis/course-api.js";
  import { onMount, onDestroy } from "svelte";
  import CourseList from "./CourseList.svelte";
  let coursesState = useCoursesState();


  //let courses = $state([]);

  $effect( async () => {
    await coursesState.update();
  })

  /*
  $effect(() => {
    updateCourses();
  })

  onMount(() => {
    window.addEventListener('update', updateCourses);
  });

  onDestroy(() => {
    window.removeEventListener('update', updateCourses);
  });*/

</script>



<h1 class="h1">Courses</h1>

<br/>

<CourseForm />

<br />

<CourseList />
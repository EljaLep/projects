
<script>

  import * as courseApi from "$lib/apis/course-api.js";
  import {useCoursesState} from "$lib/states/courseState.svelte.js";

  let coursesState = useCoursesState();

  const addCourse = async (e) => {
    const course = Object.fromEntries(new FormData(e.target));
    //const response = await courseApi.createCourse(course);
    const response = coursesState.add(course);
    //const updateEvent = new CustomEvent('update');
    //window.dispatchEvent(updateEvent);
    e.target.reset();
    e.preventDefault();
  }

</script>

<form onsubmit={addCourse} class="mx-auto w-full-max-w-md space-y-4">
  <label for="name" class="label">
    <span class="label-text text-2xl">name</span>
    <input class="" id="name" name="name" type="text" placeholder="Enter name of course" />
  </label>
  
	<br/>
	
  <button type="submit" class="w-full btn preset-filled-primary-500">New Course</button>
</form>